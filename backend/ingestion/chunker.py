from langchain_text_splitters import RecursiveCharacterTextSplitter


def create_chunks(documents):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=120
    )

    chunks = []

    for document in documents:
        texts = splitter.split_text(document["text"])

        for text in texts:
            chunks.append({
                "text": text,
                "source": document["source"],
                "page": document["page"],
                "type": document["type"]
            })

    return chunks