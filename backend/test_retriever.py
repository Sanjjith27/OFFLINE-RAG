from ingestion.embeddings import get_embeddings
from retrieval.vector_store import load_database
from retrieval.retriever import retrieve


embeddings = get_embeddings()

db = load_database(embeddings)

question = "What does Universal RAG do?"

results = retrieve(db, question)

print("Search results:", len(results))

for i, result in enumerate(results):
    print(f"\n--- RESULT {i + 1} ---")
    print("Source:", result.metadata.get("source"))
    print("Type:", result.metadata.get("type"))
    print("Content:")
    print(result.page_content)
