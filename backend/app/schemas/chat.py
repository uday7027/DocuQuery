from pydantic import BaseModel, Field


class ChatRequest(BaseModel):

    question: str = Field(
        min_length=2,
        max_length=1000
    )

    top_k: int = Field(
        default=5,
        ge=1,
        le=10
    )

    document_id: int | None = None