from ingestion.embeddings import get_embeddings

embeddings = get_embeddings()

text = "Universal RAG allows users to ask questions about documents."

vector = embeddings.embed_query(text)

print("Embedding created successfully")
print("Dimensions:", len(vector))
print("First 5 values:", vector[:5])
