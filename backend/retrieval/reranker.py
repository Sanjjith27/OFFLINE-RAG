# Keywords that indicate the user is asking about an image / visual content
_IMAGE_QUESTION_KEYWORDS = {
    "image", "picture", "photo", "photograph", "screenshot",
    "scan", "diagram", "figure", "img", "png", "jpg", "jpeg",
    "say", "read", "written", "text", "shows", "contain",
    "ocr", "visual", "graphic"
}


def rerank_documents(documents, question):
    """
    Simple reranking:
    Give higher priority to documents whose text contains words
    from the user's question.

    Image chunks receive a bonus when the question contains
    image-related keywords so they are not buried behind text
    documents that happen to share generic question words.
    The original similarity-search position is used as a
    tiebreaker so zero-score chunks keep their relative order.
    """

    question_words = set(question.lower().split())
    is_image_question = bool(question_words & _IMAGE_QUESTION_KEYWORDS)

    scored_documents = []

    for position, document in enumerate(documents):
        text = document.page_content.lower()
        doc_type = document.metadata.get("type", "")

        score = 0

        for word in question_words:
            if len(word) > 2 and word in text:
                score += 1

        # Boost image-type chunks when the question is about an image
        if doc_type == "image" and is_image_question:
            score += 10

        # Store original position as tiebreaker (lower index = better similarity)
        scored_documents.append((score, position, document))

    # Sort descending by score, then ascending by original position (tiebreaker)
    scored_documents.sort(key=lambda x: (-x[0], x[1]))

    return [document for score, position, document in scored_documents]