from ingestion.embeddings import get_embeddings
from retrieval.vector_store import load_database
from retrieval.retriever import retrieve
from generation.llm import generate_answer


embeddings = get_embeddings()

db = load_database(embeddings)

question = "What does Universal RAG do?"

documents = retrieve(db, question, k=3)

answer = generate_answer(question, documents)

print("\nQUESTION:")
print(question)

print("\nANSWER:")
print(answer)

print("\nSOURCES:")

for document in documents:
    print(
        document.metadata.get("source"),
        "|",
        document.metadata.get("page")
    )
