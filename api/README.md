# Hospital Health AI API

FastAPI backend for the React Native app's AI assistant.

## Setup

> **Note:** Use **Python 3.13** (not 3.14). Homebrew's Python 3.14 has a broken `venv`/`ensurepip` on macOS.

```bash
# From project root
yarn api:install

# Or manually:
cd api
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Copy env and fill Supabase credentials (same project as mobile app)
cp .env.example .env
```

`api/.env` keys (optional — **root `.env` is used automatically**):

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_SUPABASE_URL` | Read from project root `.env` (same as mobile) |
| `EXPO_PUBLIC_SUPABASE_KEY` | Read from project root `.env` (anon or service role) |
| `SUPABASE_URL` / `SUPABASE_KEY` | Optional override in `api/.env` only |
| `OPENAI_API_KEY` | Optional — reserved for future OpenAI integration |

## Run

```bash
yarn api:dev
```

Health check: http://localhost:8000/health  
Chat endpoint: `POST http://localhost:8000/ai/chat`

## Mobile connection

Add to root `.env`:

```env
EXPO_PUBLIC_AI_API_BASE_URL=http://10.0.2.2:8000   # Android emulator
# EXPO_PUBLIC_AI_API_BASE_URL=http://localhost:8000  # iOS simulator
```

Restart Metro with `yarn start --reset-cache`.

If the API is down or URL is unset, the app **falls back** to the built-in local alpha assistant.

## Request example

```json
POST /ai/chat
Authorization: Bearer <supabase_access_token>

{
  "message": "Book an appointment",
  "patientId": "uuid",
  "sessionId": "optional-session-id"
}
```
