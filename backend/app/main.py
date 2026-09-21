from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.document_entity import Document
from app.models.document import DocumentChunk

from app.api.document_controller import router as document_router
from app.api.search_controller import router as search_router
from app.api.chat_controller import router as chat_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="DocuQuery API",
    description="AI-powered document question answering using RAG",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
app.include_router(document_router)
app.include_router(search_router)
app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "message": "DocuQuery API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "UP"
    }