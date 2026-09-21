def retrieve(
    db,
    question,
    k=5
):

    results = db.similarity_search(
        question,
        k=k
    )

    return results