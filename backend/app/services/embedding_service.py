import os

from dotenv import load_dotenv
from google import genai


load_dotenv()


class EmbeddingService:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError("GEMINI_API_KEY is not set")

        self.client = genai.Client(
            api_key=api_key
        )

        self.model = "gemini-embedding-001"

    def create_embeddings(
        self,
        texts: list[str]
    ) -> list[list[float]]:

        if not texts:
            return []

        response = self.client.models.embed_content(
            model=self.model,
            contents=texts,
            config={
                "output_dimensionality": 1536
            }
        )

        return [
            embedding.values
            for embedding in response.embeddings
        ]

    def create_embedding(
        self,
        text: str
    ) -> list[float]:

        embeddings = self.create_embeddings([text])

        return embeddings[0]
