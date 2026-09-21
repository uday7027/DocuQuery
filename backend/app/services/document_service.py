from io import BytesIO

from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.services.embedding_service import EmbeddingService
from app.models.document import DocumentChunk
from app.models.document_entity import Document


class DocumentService:

    def __init__(self):
        self.embedding_service = EmbeddingService()

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=100
        )

    def extract_pages(
        self,
        file_bytes: bytes
    ) -> list[dict]:

        pdf_file = BytesIO(file_bytes)

        reader = PdfReader(pdf_file)

        pages = []

        for page_number, page in enumerate(
            reader.pages,
            start=1
        ):

            text = page.extract_text()

            if text and text.strip():

                pages.append({
                    "page_number": page_number,
                    "text": text.strip()
                })

        return pages

    def process_document(
        self,
        file_bytes: bytes,
        filename: str,
        db
    ):

        # 1. Extract pages
        pages = self.extract_pages(file_bytes)

        if not pages:
            raise ValueError(
                "Could not extract text from PDF."
            )

        # 2. Create document record
        document = Document(
            filename=filename,
            total_pages=len(pages)
        )

        db.add(document)

        # Flush so document.id becomes available
        db.flush()

        # 3. Create chunks
        chunk_data = []

        for page in pages:

            page_number = page["page_number"]
            text = page["text"]

            chunks = self.text_splitter.split_text(text)

            for chunk in chunks:

                chunk_data.append({
                    "page_number": page_number,
                    "content": chunk
                })

        if not chunk_data:
            raise ValueError(
                "No text chunks were generated."
            )

        # 4. Generate embeddings
        texts = [
            item["content"]
            for item in chunk_data
        ]

        embeddings = self.embedding_service.create_embeddings(
            texts
        )

        # Make sure every chunk received an embedding
        if len(embeddings) != len(chunk_data):
            db.rollback()

            raise ValueError(
                "Number of embeddings does not match number of chunks."
            )

        # 5. Store chunks
        for item, embedding in zip(
            chunk_data,
            embeddings
        ):

            document_chunk = DocumentChunk(
                document_id=document.id,
                page_number=item["page_number"],
                content=item["content"],
                embedding=embedding
            )

            db.add(document_chunk)

        # 6. Commit
        db.commit()

        return {
            "document_id": document.id,
            "filename": filename,
            "total_pages": len(pages),
            "total_chunks": len(chunk_data)
        }
