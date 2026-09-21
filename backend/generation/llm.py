import re
from ollama import chat

MODEL = "granite4.2:3b"


# =========================================================
# QUESTION TYPE CLASSIFIER
# =========================================================

# Ordered from most-specific to least-specific.
# First match wins inside _classify_question; detail > summary > list > factual.
_LIST_PATTERNS = re.compile(
    r"\b("
    r"what are|list( all| every| the)?|"
    r"give me( all| every| a list of)|"
    r"show( me)?( all| every)?|"
    r"all the|every|enumerate|"
    r"use cases?|features?|components?|types?|"
    r"examples?|steps?|items?|options?|"
    r"capabilities|advantages|disadvantages|benefits|drawbacks|"
    r"requirements?|dependencies|parts?|sections?"
    r")\b",
    re.IGNORECASE,
)

_DETAIL_PATTERNS = re.compile(
    r"\b("
    r"explain in detail|explain thoroughly|explain fully|"
    r"describe in detail|elaborate|in depth|deep dive|"
    r"comprehensive(ly)?|thoroughly|detailed? explanation"
    r")\b",
    re.IGNORECASE,
)

_SUMMARY_PATTERNS = re.compile(
    r"\b("
    r"summar(ize|y|ise)|overview|brief(ly)?|"
    r"what is( this| the| a)?( document| file| text| content| paper| article| report)?|"
    r"what does( this| the)?( document| file| text| content| paper| report)? (say|contain|cover|discuss|talk about)|"
    r"main (points?|ideas?|topics?|themes?|findings?|conclusions?)|"
    r"key (points?|ideas?|takeaways?|findings?)"
    r")\b",
    re.IGNORECASE,
)


def _classify_question(question: str) -> str:
    """Return one of: 'list', 'detail', 'summary', 'factual'.

    Priority order: detail > summary > list > factual.
    Summary is checked before list so that meta-questions like
    'Give me an overview' or 'What are the key points?' are not
    mistakenly treated as enumeration requests.
    """
    if _DETAIL_PATTERNS.search(question):
        return "detail"
    if _SUMMARY_PATTERNS.search(question):
        return "summary"
    if _LIST_PATTERNS.search(question):
        return "list"
    return "factual"


# =========================================================
# PROMPT TEMPLATES
# =========================================================

_BASE_RULES = """
You are a document research assistant.
Answer ONLY using the provided document context below.
Do NOT use outside knowledge. Do NOT hallucinate.
If the answer is not present in the context, say exactly:
"I could not find the answer in the uploaded documents."
"""

_INSTRUCTIONS = {
    "list": """
The user is asking for a LIST or enumeration.
- Return EVERY relevant item found in the context — do not truncate or omit any.
- Use a numbered or bulleted list.
- If items have sub-details in the context, include them as indented sub-points.
- Do not add items that are not in the context.
""",
    "detail": """
The user wants a DETAILED EXPLANATION.
- Cover all relevant aspects found in the context.
- Use clear headings or sections where appropriate.
- Include specific examples, figures, or steps mentioned in the context.
- Be thorough — do not omit any relevant retrieved sections.
""",
    "summary": """
The user wants a STRUCTURED SUMMARY.
- Identify the major topics or sections in the context.
- Write a short paragraph for each major topic.
- Use headings to organise the summary.
- Be concise per section but do not skip any major topic present in the context.
""",
    "factual": """
The user is asking a SPECIFIC FACTUAL QUESTION.
- Answer directly and concisely (1–3 short paragraphs maximum).
- State only what the context says — no padding.
- If the context contains a single clear answer, give it plainly.
""",
}


# =========================================================
# MAIN GENERATION FUNCTION
# =========================================================

def generate_answer(question: str, documents: list) -> str:
    # Build context block from retrieved documents
    context = ""
    for document in documents:
        source = document.metadata.get("source", "Unknown")
        page = document.metadata.get("page", "Unknown")
        context += f"\nSource: {source}\nPage: {page}\n\n{document.page_content}\n"

    # Classify the question and pick matching instructions
    q_type = _classify_question(question)
    type_instructions = _INSTRUCTIONS[q_type]

    prompt = f"""{_BASE_RULES}
RESPONSE STYLE INSTRUCTIONS:
{type_instructions}
DOCUMENT CONTEXT:
{context}

QUESTION:
{question}

ANSWER:
"""

    response = chat(
        model=MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    return response["message"]["content"]