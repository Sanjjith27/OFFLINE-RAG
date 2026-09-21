from ingestion.loader import load_document

documents = load_document("documents/test.txt")

print("Documents loaded:", len(documents))

for document in documents:
    print("\n--- DOCUMENT ---")
    print("Source:", document["source"])
    print("Type:", document["type"])
    print("Content:")
    print(document["text"])
