from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)

chat_service = ChatService()


@router.post("")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):

    return chat_service.answer_question(
    question=request.question,
    db=db,
    top_k=request.top_k,
    document_id=request.document_id
)