from ingestion.loader import load_document
from ingestion.chunker import create_chunks
from ingestion.embeddings import get_embeddings
from retrieval.vector_store import create_database


documents = load_document("documents/test.txt")
chunks = create_chunks(documents)

embeddings = get_embeddings()

db = create_database(chunks, embeddings)

print("ChromaDB created successfully")
print("Chunks stored:", len(chunks))
