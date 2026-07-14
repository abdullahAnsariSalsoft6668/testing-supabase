from supabase import Client, create_client

from config import get_settings


def get_supabase(access_token: str | None = None) -> Client:
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_key:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_KEY in api/.env"
        )

    client = create_client(settings.supabase_url, settings.supabase_key)
    if access_token:
        client.postgrest.auth(access_token)
    return client


def display_name(user: dict | None, fallback: str = "") -> str:
    if not user:
        return fallback
    return (
        user.get("full_name")
        or user.get("name")
        or fallback
    )
