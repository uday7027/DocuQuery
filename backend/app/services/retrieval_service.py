from sqlalchemy.orm import Session

from app.models.document import DocumentChunk
from app.services.embedding_service import EmbeddingService


class RetrievalService:

    def __init__(self):

        self.embedding_service = EmbeddingService()

    def search(
        self,
        query: str,
        db: Session,
        top_k: int = 5,
        document_id: int | None = None,
        similarity_threshold: float = 0.30
    ):

        # 1. Generate embedding for the query
        query_embedding = (
            self.embedding_service.create_embeddings(
                [query]
            )[0]
        )

        # 2. Calculate cosine distance
        distance = DocumentChunk.embedding.cosine_distance(
            query_embedding
        )

        # 3. Build query
        query_builder = db.query(
            DocumentChunk,
            distance.label("distance")
        )

        # 4. Optional document filter
        if document_id is not None:

            query_builder = query_builder.filter(
                DocumentChunk.document_id == document_id
            )

        # 5. Get closest chunks
        results = (
            query_builder
            .order_by(distance)
            .limit(top_k)
            .all()
        )

        # 6. Convert distance → similarity
        filtered_results = []

        for chunk, distance_value in results:

            similarity = 1 - distance_value

            if similarity >= similarity_threshold:

                filtered_results.append({
                    "chunk": chunk,
                    "similarity": similarity
                })

        return filtered_results