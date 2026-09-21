from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.services.document_service import DocumentService
from app.models.document_entity import Document
from fastapi import status


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)

document_service = DocumentService()


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )

    file_bytes = await file.read()

    try:

        result = document_service.process_document(
            file_bytes,
            file.filename,
            db
        )

        return {
            "message": "Document processed successfully",
            **result
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )

@router.get("")
def get_documents(
    db: Session = Depends(get_db)
):

    documents = (
        db.query(Document)
        .order_by(Document.created_at.desc())
        .all()
    )

    return [
        {
            "id": document.id,
            "filename": document.filename,
            "total_pages": document.total_pages,
            "created_at": document.created_at
        }
        for document in documents
    ]
@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):

    document = (
        db.query(Document)
        .filter(Document.id == document_id)
        .first()
    )

    if not document:

        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }