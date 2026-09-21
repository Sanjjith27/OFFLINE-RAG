from ingestion.loader import load_document
from ingestion.chunker import create_chunks

documents = load_document("documents/test.txt")
chunks = create_chunks(documents)

print("Documents:", len(documents))
print("Chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print(f"\n--- CHUNK {i + 1} ---")
    print(chunk["text"])
