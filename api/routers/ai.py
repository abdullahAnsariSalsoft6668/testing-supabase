from fastapi import APIRouter, Header, HTTPException

from models.schemas import AiChatRequest, AiChatResponse
from services.assistant import handle_chat

router = APIRouter()


def _extract_bearer(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.split(" ", 1)
    if len(parts) == 2 and parts[0].lower() == "bearer":
        token = parts[1].strip()
        return token or None
    return None


@router.post("/chat", response_model=AiChatResponse, response_model_by_alias=True)
async def ai_chat(
    body: AiChatRequest,
    authorization: str | None = Header(default=None),
) -> AiChatResponse:
    patient_id = body.patient_id.strip()
    if not patient_id:
        raise HTTPException(status_code=400, detail="patientId is required")

    access_token = _extract_bearer(authorization)

    try:
        return await handle_chat(
            message=body.message,
            patient_id=patient_id,
            session_id=body.session_id,
            access_token=access_token,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail="AI assistant failed") from exc
