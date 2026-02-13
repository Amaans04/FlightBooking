from fastapi import FastAPI
from pydantic import BaseModel
from rag_service import load_and_index, query_rag

app = FastAPI(title="AI Service")

class QueryRequest(BaseModel):
    question: str

@app.on_event("startup")
def startup():
    load_and_index()

@app.post("/ai/query")
def ask_ai(request: QueryRequest):
    answer = query_rag(request.question)
    return {"answer": answer}