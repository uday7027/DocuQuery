from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.search import SearchRequest
from app.services.retrieval_service import RetrievalService


router = APIRouter(
    prefix="/api/search",
    tags=["Search"]
)

retrieval_service = RetrievalService()


@router.post("")
def search_documents(
    request: SearchRequest,
    db: Session = Depends(get_db)
):

    results = retrieval_service.search(
        query=request.query,
        db=db,
        top_k=request.top_k,
        document_id=request.document_id
    )

    return {
        "query": request.query,

        "results": [
            {
                "id": item["chunk"].id,
                "document_id": item["chunk"].document_id,
                "document_name": (
                    item["chunk"].document.filename
                ),
                "page_number": item["chunk"].page_number,
                "similarity": round(
                    item["similarity"],
                    4
                ),
                "content": item["chunk"].content
            }

            for item in results
        ]
    }