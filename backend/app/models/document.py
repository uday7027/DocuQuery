from sqlalchemy import Column, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.database import Base


class DocumentChunk(Base):

    __tablename__ = "document_chunks"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    document_id = Column(
        Integer,
        ForeignKey(
            "documents.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    page_number = Column(
        Integer,
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )

    embedding = Column(
        Vector(1536),
        nullable=False
    )

    document = relationship(
        "Document",
        back_populates="chunks"
    )