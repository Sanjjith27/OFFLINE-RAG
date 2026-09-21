from langchain_chroma import Chroma

DB_PATH = "database"
COLLECTION_NAME = "universal_rag"


def create_database(chunks, embeddings):
    texts = [chunk["text"] for chunk in chunks]

    metadatas = [
        {
            "source": chunk["source"],
            "page": str(chunk["page"]),
            "type": chunk["type"]
        }
        for chunk in chunks
    ]

    db = Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=DB_PATH,
        embedding_function=embeddings
    )

    db.add_texts(
        texts=texts,
        metadatas=metadatas
    )

    return db


def load_database(embeddings):
    return Chroma(
        collection_name=COLLECTION_NAME,
        persist_directory=DB_PATH,
        embedding_function=embeddings
    )