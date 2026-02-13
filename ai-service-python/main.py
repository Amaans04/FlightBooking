import logging

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from rag_service import load_and_index, query_rag

logger = logging.getLogger(__name__)
app = FastAPI(title="AI Service")


class QueryRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    """Health check - returns 200 if the service is running."""
    return {"status": "ok"}


@app.on_event("startup")
def startup():
    """Load and index policies. Log errors but don't crash - app can still serve with graceful errors."""
    try:
        load_and_index()
        logger.info("RAG indexing complete (or already indexed)")
    except Exception as e:
        logger.warning("Startup indexing skipped or failed: %s", e)


@app.post("/ai/reindex")
def reindex():
    """Re-index airline policies from the updated file. Call this after changing data/airline_policies.txt."""
    try:
        load_and_index(force=True)
        return {"status": "ok", "message": "Policies re-indexed successfully"}
    except Exception as e:
        logger.exception("Reindex failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/ai/query")
def ask_ai(request: QueryRequest):
    try:
        answer = query_rag(request.question)
        return {"answer": answer}
    except RuntimeError as e:
        if "not found" in str(e).lower() or "pinecone" in str(e).lower():
            raise HTTPException(status_code=503, detail=str(e))
        raise