from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from pinecone import Pinecone
from pinecone.exceptions import NotFoundException
from config import GOOGLE_API_KEY, PINECONE_API_KEY, PINECONE_INDEX_NAME
from langchain_pinecone import PineconeVectorStore

try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    # Fallback if langchain-text-splitters not installed: pip install langchain-text-splitters
    class RecursiveCharacterTextSplitter:
        def __init__(self, chunk_size=500, chunk_overlap=50):
            self.chunk_size = chunk_size
            self.chunk_overlap = chunk_overlap

        def split_text(self, text):
            chunks = []
            start = 0
            while start < len(text):
                end = min(start + self.chunk_size, len(text))
                chunks.append(text[start:end])
                start = end - self.chunk_overlap
                if start >= len(text):
                    break
            return chunks

# RAG namespace for flight policy vectors (index dimension 3072)
RAG_NAMESPACE = "flight-policy"

# Initialize embeddings — gemini-embedding-001 outputs 3072 dimensions for Pinecone
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=GOOGLE_API_KEY,
)

# Initialize Pinecone client (lightweight, no API call)
pc = Pinecone(api_key=PINECONE_API_KEY)
_index = None


def _get_index():
    """Lazy-init Pinecone index to avoid startup crash if index doesn't exist yet."""
    global _index
    if _index is None:
        if not PINECONE_INDEX_NAME:
            raise ValueError("PINECONE_INDEX_NAME environment variable is not set")
        _index = pc.Index(PINECONE_INDEX_NAME)
    return _index


def _namespace_vector_count(namespace: str) -> int:
    """Return the number of vectors in the given namespace, or 0 if empty/missing."""
    try:
        stats = _get_index().describe_index_stats()
    except Exception as e:
        raise RuntimeError(f"Failed to get Pinecone index stats: {e}") from e
    namespaces = getattr(stats, "namespaces", None) or {}
    ns_summary = namespaces.get(namespace) if isinstance(namespaces, dict) else None
    if ns_summary is None:
        return 0
    return getattr(ns_summary, "vector_count", 0) or 0


def load_and_index(force: bool = False) -> None:
    """Load policy text and index into Pinecone. If force=False, skips when namespace already has vectors."""
    if not force and _namespace_vector_count(RAG_NAMESPACE) > 0:
        return

    if force:
        _get_index().delete_namespace(namespace=RAG_NAMESPACE)

    try:
        with open("data/airline_policies.txt", "r", encoding="utf-8") as f:
            text = f.read()
    except FileNotFoundError as e:
        raise FileNotFoundError(f"Policy file not found: data/airline_policies.txt") from e
    except OSError as e:
        raise IOError(f"Failed to read policy file: {e}") from e

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
    )
    chunks = splitter.split_text(text)

    vector_store = PineconeVectorStore(
        index=_get_index(),
        embedding=embeddings,
        namespace=RAG_NAMESPACE,
    )
    vector_store.add_texts(chunks)


def query_rag(question: str) -> str:
    """Answer the question using RAG over flight policy context. Raises readable exceptions on errors."""
    if not question or not str(question).strip():
        raise ValueError("Question cannot be empty")

    try:
        vectorstore = PineconeVectorStore(
            index=_get_index(),
            embedding=embeddings,
            namespace=RAG_NAMESPACE,
        )
    except NotFoundException as e:
        raise RuntimeError(
            f"Pinecone index '{PINECONE_INDEX_NAME}' not found. "
            "Create it in the Pinecone dashboard with dimension 3072 for gemini-embedding-001."
        ) from e
    except Exception as e:
        raise RuntimeError(f"Failed to initialize vector store: {e}") from e

    try:
        docs = vectorstore.similarity_search(question, k=3)
    except Exception as e:
        raise RuntimeError(f"Vector search failed: {e}") from e

    context = "\n".join([doc.page_content for doc in docs])

    if not context.strip():
        return "No relevant policy context was found for your question. Please rephrase or ask about flight policies."

    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=GOOGLE_API_KEY,
        )
        prompt = f"""
Answer the question based only on the context below.

Context:
{context}

Question:
{question}
"""
        response = llm.invoke(prompt)
        return response.content
    except Exception as e:
        raise RuntimeError(f"LLM request failed: {e}") from e
