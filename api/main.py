from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from models.schemas import HealthResponse
from routers import ai

settings = get_settings()

app = FastAPI(
    title="Hospital Health AI API",
    description="FastAPI backend for the Hospital Management mobile app AI assistant.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai.router, prefix="/ai", tags=["ai"])


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        openai_configured=bool(settings.openai_api_key.strip()),
        supabase_configured=bool(settings.supabase_url.strip() and settings.supabase_key.strip()),
    )
