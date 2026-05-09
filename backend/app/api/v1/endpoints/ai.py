from fastapi import APIRouter, Depends
from app.services import ai
from app.api import deps
from pydantic import BaseModel

router = APIRouter()

class AIDescriptionRequest(BaseModel):
    title: str
    context: str = ""

class AIChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/generate-description")
async def generate_description(
    request: AIDescriptionRequest,
    current_user = Depends(deps.get_current_active_user)
):
    description = await ai.generate_task_description(request.title, request.context)
    return {"description": description}

@router.post("/chat")
async def ai_chat(
    request: AIChatRequest,
    current_user = Depends(deps.get_current_active_user)
):
    response = await ai.chat_with_ai(request.message, request.history)
    return {"response": response}
