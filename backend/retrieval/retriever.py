from retrieval.reranker import rerank_documents


def retrieve(db, question, k=5):
    # Get more documents first
    documents = db.similarity_search(
        question,
        k=k
    )

    # Rerank the retrieved documents
    documents = rerank_documents(
        documents,
        question
    )

    # Return the best 8 to give LLM enough context for list/summary questions
    return documents[:8]