import os

# =========================================================
# OFFLINE MODE
# =========================================================
# Force Hugging Face libraries to use only the local model cache.
# This prevents sentence-transformers / transformers / huggingface_hub
# from contacting huggingface.co at runtime.
# The model "sentence-transformers/all-MiniLM-L6-v2" must already
# exist in the local HF cache before starting the server.
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ingestion.loader import load_document
from ingestion.chunker import create_chunks
from ingestion.embeddings import get_embeddings

from retrieval.vector_store import load_database, create_database
from retrieval.retriever import retrieve

from generation.llm import generate_answer


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="Universal RAG API",
    description="Offline Universal Document RAG Assistant",
    version="1.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# SETUP
# =========================================================

embeddings = get_embeddings()

DB_PATH = "database"
DOCUMENT_PATH = "documents"


# =========================================================
# LOAD EXISTING DATABASE
# =========================================================

try:
    db = load_database(embeddings)
except Exception:
    db = None


# =========================================================
# REQUEST MODEL
# =========================================================

class QuestionRequest(BaseModel):
    question: str


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Universal RAG API is running"
    }


# =========================================================
# HEALTH
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# UPLOAD DOCUMENT
# =========================================================

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    global db

    # Supported file types
    allowed_extensions = [
        ".pdf",
        ".docx",
        ".pptx",
        ".txt",
        ".csv",
        ".xlsx",
        ".xls",
        ".json",
        ".png",
        ".jpg",
        ".jpeg"
    ]

    # Get file extension
    extension = os.path.splitext(
        file.filename
    )[1].lower()

    # Check extension
    if extension not in allowed_extensions:
        return {
            "error": f"Unsupported file type: {extension}"
        }

    # Create documents directory if necessary
    os.makedirs(
        DOCUMENT_PATH,
        exist_ok=True
    )

    # Save uploaded file
    file_path = os.path.join(
        DOCUMENT_PATH,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:
        buffer.write(
            await file.read()
        )

    # Load document
    documents = load_document(
        file_path
    )

    # Create chunks
    chunks = create_chunks(
        documents
    )

    # Store chunks in ChromaDB
    db = create_database(
        chunks,
        embeddings
    )

    return {
        "message": "Document uploaded successfully",
        "filename": file.filename,
        "documents": len(documents),
        "chunks": len(chunks)
    }


# =========================================================
# ASK QUESTION
# =========================================================

@app.post("/ask")
def ask_question(
    request: QuestionRequest
):

    if db is None:
        return {
            "error": "No documents have been uploaded yet."
        }

    # Retrieve relevant chunks
    documents = retrieve(
        db,
        request.question,
        k=10
    )

    # Generate answer using Ollama
    answer = generate_answer(
        request.question,
        documents
    )

    # Collect sources
    sources = []

    seen_sources = set()

    for document in documents:

        source = document.metadata.get(
            "source",
            "Unknown"
        )

        page = document.metadata.get(
            "page",
            "None"
        )

        doc_type = document.metadata.get(
            "type",
            "Unknown"
        )

        # Remove duplicate source entries
        source_key = (
            source,
            page,
            doc_type
        )

        if source_key not in seen_sources:

            sources.append({
                "source": source,
                "page": page,
                "type": doc_type
            })

            seen_sources.add(
                source_key
            )

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources
    }