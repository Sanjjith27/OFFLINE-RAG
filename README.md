# Universal RAG

### Universal Multimodal Retrieval-Augmented Generation Assistant

Universal RAG is a multimodal AI knowledge assistant that allows users to upload and interact with different types of documents using natural-language questions.

Instead of manually searching through large collections of documents, users can upload their files and ask questions directly. The system processes the documents, extracts textual and visual information, creates semantic embeddings, retrieves relevant content, and generates context-aware answers using a local Large Language Model (LLM).

---

## Overview

Universal RAG is designed as a general-purpose document intelligence system capable of working with multiple document formats and multimodal content.

The system supports:

- PDF documents
- Microsoft Word documents
- PowerPoint presentations
- Text files
- CSV files
- Excel spreadsheets
- JSON files
- Images

For image-based content, OCR is used to extract readable text before it is indexed for retrieval.

The core objective is to create a **single AI-powered knowledge interface for heterogeneous documents**.

---

## Key Features

### Multi-Format Document Support

Upload and process different document types through a single interface.

Supported formats:

```text
PDF
DOCX
PPTX
TXT
CSV
XLS
XLSX
JSON
PNG
JPG
JPEG

Multimodal Processing

Universal RAG can process both textual and image-based information.

Documents
    │
    ├── Text
    ├── Tables
    └── Images
          │
          ▼
         OCR

This allows users to ask questions about text present inside images and scanned content.

Semantic Search

Documents are converted into embeddings and stored in a vector database.

Instead of relying only on exact keyword matching, the system retrieves information based on semantic similarity.

User Question
      ↓
Query Embedding
      ↓
Vector Search
      ↓
Relevant Chunks
Intelligent Retrieval

The retrieval pipeline adapts to different types of questions.

Simple questions require fewer retrieved chunks, while broad or comprehensive questions retrieve more information.

Simple Query
    ↓
Small Retrieval

Normal Query
    ↓
Medium Retrieval

Broad Query
    ↓
Larger Retrieval
Query Understanding

The system analyzes the user's question to identify the type of information being requested.

Examples include:

Definitions
Explanations
Summaries
Lists
Use cases
Comparisons
Advantages and disadvantages
Procedures
Image-related questions
General factual questions

This allows the retrieval process to be better aligned with the user's intent.

Local AI Processing

Universal RAG is designed around locally hosted AI components.

The current architecture uses:

Local embeddings
ChromaDB
Ollama
Granite 4.2 3B
Tesseract OCR

This allows the core system to operate without depending on external AI APIs.

System Architecture
                         ┌─────────────────────┐
                         │    User Interface   │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    FastAPI Backend  │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Document Processing │
                         └──────────┬──────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
                 PDF/DOCX        PPTX/TXT       Images
                    │               │               │
                    │               │              OCR
                    └───────────────┼───────────────┘
                                    ▼
                            Text / Content
                                    │
                                    ▼
                            Chunking & Embedding
                                    │
                                    ▼
                              ChromaDB
                           Vector Database
                                    │
                                    ▼
                              User Query
                                    │
                                    ▼
                            Query Analyzer
                                    │
                                    ▼
                         Retrieval + Reranking
                                    │
                                    ▼
                           Relevant Context
                                    │
                                    ▼
                           Local LLM (Ollama)
                                    │
                                    ▼
                         Context-Aware Answer
                                    │
                                    ▼
                              Sources
Technology Stack
Frontend
React
Vite
JavaScript
HTML
CSS
Backend
Python
FastAPI
Uvicorn
Retrieval
ChromaDB
Sentence Transformers
Semantic Vector Search
Adaptive Retrieval
Query Analysis
Reranking
AI / LLM
Ollama
Granite 4.2 3B
OCR
Tesseract OCR
Pytesseract
Document Processing
PyMuPDF
python-docx
python-pptx
Pandas
OpenPyXL
JSON processing
Pillow
Project Structure
Universal-RAG/
│
├── backend/
│   │
│   ├── database/
│   │
│   ├── documents/
│   │
│   ├── generation/
│   │   └── llm.py
│   │
│   ├── ingestion/
│   │   └── loader.py
│   │
│   ├── retrieval/
│   │   ├── adaptive.py
│   │   ├── query_analyzer.py
│   │   ├── retriever.py
│   │   ├── reranker.py
│   │   └── vector_store.py
│   │
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
How It Works
1. Upload

The user uploads one or more supported documents.

Document
   ↓
File Type Detection
2. Document Processing

The appropriate loader extracts the content.

PDF      → Text Extraction
DOCX     → Paragraphs / Content
PPTX     → Slide Content
CSV      → Tabular Data
XLSX     → Spreadsheet Data
JSON     → Structured Data
Image    → OCR
3. Chunking

Large documents are divided into smaller meaningful sections.

Large Document
      ↓
   Chunking
      ↓
Chunk 1
Chunk 2
Chunk 3
...

This improves retrieval efficiency and allows the LLM to work with relevant portions of the document.

4. Embedding

Each chunk is converted into a numerical vector representation using a local embedding model.

Text Chunk
    ↓
Embedding Model
    ↓
Vector Representation
5. Vector Storage

The embeddings and associated document metadata are stored in ChromaDB.

Chunk
  +
Embedding
  +
Metadata
   ↓
ChromaDB
6. Query Analysis

When the user asks a question, the system analyzes the query.

For example:

"What are all the use cases?"
        ↓
USE_CASES
        ↓
Broad Retrieval

or:

"What is RAG?"
        ↓
DEFINITION
        ↓
Simple Retrieval
7. Retrieval

Relevant chunks are retrieved from the vector database.

The retrieval depth can adapt according to the query.

Question
   ↓
Query Analysis
   ↓
Adaptive Retrieval
   ↓
Relevant Chunks
8. Reranking

Retrieved chunks are ranked according to their relevance to the question.

This helps prioritize the most useful information before sending context to the LLM.

9. Answer Generation

The selected context is passed to the local LLM.

Question
    +
Retrieved Context
    ↓
Granite 4.2 3B
    ↓
Answer

The answer is generated using the retrieved information rather than relying only on the model's pre-trained knowledge.

Offline Capability

One of the important goals of Universal RAG is local operation.

The core AI pipeline can operate without requiring external AI APIs.

                    LOCAL MACHINE
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Embeddings        ChromaDB          Ollama
        │                                 │
        ▼                                 ▼
    Retrieval                         Local LLM
        │                                 │
        └──────────────┬──────────────────┘
                       ▼
                     Answer

This makes the system suitable for environments where documents should remain on the user's machine.

Installation
Prerequisites

Install:

Python 3.x
Node.js
Ollama
Tesseract OCR
Clone the Repository
git clone <YOUR_REPOSITORY_URL>
cd Universal-RAG
Backend Setup

Create and activate a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install -r backend/requirements.txt
Install Ollama Model

Install Ollama and pull the local model:

ollama pull granite4.2:3b

Verify:

ollama list
Tesseract OCR

Install Tesseract OCR and ensure the executable is available to the application.

Example Windows path:

C:\Program Files\Tesseract-OCR\tesseract.exe
Running the Backend

Open a terminal:

cd backend
uvicorn main:app --reload

The backend will run at:

http://127.0.0.1:8000
Running the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Then open the URL shown by Vite in the terminal.

Example Questions

After uploading documents, users can ask questions such as:

What is the main topic of this document?

Summarize this document.

What are the use cases?

What are the advantages and disadvantages?

Compare the two approaches.

Explain the architecture.

What does the image say?

List all the important features.

What are the key points?
Multimodal Question Answering

For image-based documents:

Image
  ↓
Tesseract OCR
  ↓
Extracted Text
  ↓
Chunking
  ↓
Embedding
  ↓
ChromaDB
  ↓
Retrieval
  ↓
LLM
  ↓
Answer

This allows questions such as:

"What does the image say?"

to be answered using OCR-extracted information.

Design Goals

Universal RAG focuses on:

Multi-format support
Multimodal document understanding
Local AI processing
Semantic retrieval
Adaptive retrieval
Query-aware search
Source-aware answers
Offline capability
Simple user experience
Extensible architecture
Future Development

Potential future improvements include:

Agentic RAG orchestration
Self-correction
Evidence verification
Contradiction detection
Document comparison
Advanced table understanding
Improved multimodal reasoning
Voice-based interaction
Knowledge-base analytics
Optional cloud LLM integration
Hybrid retrieval

These features can be added progressively without replacing the core RAG architecture.

Project Objective

The objective of Universal RAG is to provide a general-purpose AI assistant for personal and organizational knowledge bases, allowing users to interact with heterogeneous documents through natural language while keeping the core processing local and controllable.
