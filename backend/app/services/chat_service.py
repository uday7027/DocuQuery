import os

from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

from app.services.retrieval_service import RetrievalService


load_dotenv()


class ChatService:

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set")

        self.client = genai.Client(
            api_key=api_key
        )

        self.retrieval_service = RetrievalService()

        self.model = "gemini-3.1-flash-lite"

    def answer_question(
    self,
    question: str,
    db: Session,
    top_k: int = 5,
    document_id: int | None = None
):

        # 1. Retrieve relevant document chunks
        results = self.retrieval_service.search(
    query=question,
    db=db,
    top_k=top_k,
    document_id=document_id
)

        if not results:
            return {
                "answer": (
                    "I couldn't find relevant information "
                    "in the uploaded documents."
                ),
                "sources": []
            }

        # 2. Build context
        context_parts = []

        for item in results:

            chunk = item["chunk"]
            similarity = item["similarity"]

            context_parts.append(
                f"Document: {chunk.document.filename}\n"
                f"Page: {chunk.page_number}\n"
                f"Relevance: {similarity:.2f}\n"
                f"Content:\n{chunk.content}"
            )

        context = "\n\n---\n\n".join(context_parts)

        # 3. Create RAG prompt
        system_prompt = """
You are a document question-answering assistant.

Answer the user's question using ONLY the information
provided in the CONTEXT.

Rules:
1. Do not use outside knowledge.
2. If the answer cannot be found in the context,
   say that the information is not available in the
   uploaded documents.
3. Do not invent facts.
4. Give a clear and concise answer.
"""

        user_prompt = f"""
{system_prompt}

CONTEXT:

{context}


QUESTION:

{question}
"""

        # 4. Send context + question to Gemini
        response = self.client.models.generate_content(
            model=self.model,
            contents=user_prompt
        )

        answer = response.text

        # 5. Build source information
        sources = [
            {
                "id": item["chunk"].id,
                "document_id": item["chunk"].document_id,
                "document_name": item["chunk"].document.filename,
                "page_number": item["chunk"].page_number,
                "similarity": round(
                    item["similarity"],
                    4
                )
            }
            for item in results
        ]

        # 6. Return answer + sources
        return {
            "answer": answer,
            "sources": sources
        }
