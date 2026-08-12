# Run Guide — Hospital Health App

Complete setup for the React Native app, Supabase, optional FastAPI chat, and Retell voice calling.

---

## What runs where

| Service | Port | Required for |
|---------|------|----------------|
| Metro (React Native) | 8081 | Mobile app dev |
| Node.js backend | 3001 | **Talk to AI** voice calls |
| FastAPI | 8000 | Optional remote AI chat |
| ngrok | — | Retell tools → your local Node server |
| Supabase | cloud | Auth, doctors, slots, bookings |

```
Mobile App
  ├── Supabase (auth + data)
  ├── AI Chat → local alpha OR FastAPI :8000
  └── Talk to AI → Node :3001 → Retell → LiveKit (WebRTC)
                        └── /retell/tools/* → Supabase
```

---

## Prerequisites

- **Node.js** 18+ and **Yarn**
- **React Native environment** — [official setup guide](https://reactnative.dev/docs/set-up-your-environment)
- **Android Studio** (Android) or **Xcode** (iOS)
- **Python 3.13** (only if using FastAPI — not 3.14 on macOS)
- **Retell account** — [dashboard.retellai.com](https://dashboard.retellai.com) (voice only)
- **ngrok** — [ngrok.com](https://ngrok.com) (voice tools in local dev)
- **Supabase project** with schema + seed data

---

## 1. Install dependencies

From project root:

```bash
yarn install
yarn node:install
```

Optional FastAPI:

```bash
yarn api:install
```

iOS (first time or after native dep changes):

```bash
cd ios && pod install && cd ..
```

---

## 2. Environment variables

### Root `.env` (mobile app)

Copy and fill:

```bash
cp .env.example .env
```

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=your_supabase_anon_or_publishable_key

# Voice backend (Node.js) — see "Device URLs" below
EXPO_PUBLIC_NODE_API_BASE_URL=http://localhost:3001

# Optional — remote AI chat (falls back to in-app alpha if unset)
# EXPO_PUBLIC_AI_API_BASE_URL=http://localhost:8000
```

### `nodejsbackend/.env` (Retell + server-side Supabase)

```bash
cp nodejsbackend/.env.example nodejsbackend/.env
```

```env
RETELL_API_KEY=your_retell_api_key
RETELL_AGENT_ID=agent_xxxxxxxx          # Single-Prompt agent from Retell dashboard

SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_secret   # NOT the publishable/anon key

PORT=3001
CORS_ORIGINS=*
VERIFY_RETELL_SIGNATURE=false           # use false for local dev; true in production
```

> **Important:** `SUPABASE_SERVICE_ROLE_KEY` must be the **service_role** secret from Supabase → Settings → API.

After changing `.env`, restart Metro with cache reset:

```bash
yarn start --reset-cache
```

---

## 3. Device URLs (`EXPO_PUBLIC_NODE_API_BASE_URL`)

| Target | Value |
|--------|--------|
| Android **emulator** | `http://10.0.2.2:3001` |
| Android **physical device** (USB) | `http://localhost:3001` + `yarn node:reverse` |
| iOS **simulator** | `http://localhost:3001` |
| iOS **physical device** | `http://YOUR_MAC_LAN_IP:3001` |

Physical Android USB:

```bash
adb reverse tcp:3001 tcp:3001
adb reverse tcp:8081 tcp:8081   # if Metro connection issues
```

Helper script:

```bash
yarn node:reverse
```

---

## 4. Run the app (minimum)

**Terminal 1 — Metro:**

```bash
yarn start
```

**Terminal 2 — Android or iOS:**

```bash
yarn android
# or
yarn ios
```

**Login** with a test patient (see [TESTING.md](./TESTING.md)):

- Email: `user1@mailinator.com`

---

## 5. AI Chat (text)

Works without any backend server — uses in-app **alpha** assistant + Supabase.

1. Patient Home → **AI Health Assistant**
2. **Chat with AI**
3. Try: `Book an appointment`

Optional: run FastAPI for a remote chat endpoint:

```bash
yarn api:dev
```

Set in root `.env`:

```env
EXPO_PUBLIC_AI_API_BASE_URL=http://10.0.2.2:8000   # emulator
```

---

## 6. Talk to AI (voice) — full setup

Voice needs **Node backend**, **Retell agent**, and **ngrok** for booking tools.

### Step A — Start servers

**Terminal 1 — Metro:**

```bash
yarn start
```

**Terminal 2 — Node backend:**

```bash
yarn node:dev
```

Verify:

```bash
curl http://localhost:3001/health
# {"status":"ok","retellConfigured":true,"supabaseConfigured":true}
```

**Terminal 3 — ngrok (Retell tools):**

```bash
ngrok http 3001
```

Copy the HTTPS URL, e.g. `https://xxxx.ngrok-free.dev`.

**Terminal 4 — Android (physical device):**

```bash
yarn node:reverse
yarn android
```

### Step B — Retell dashboard

1. Create a **Single-Prompt Agent** (not Conversation Flow demo).
2. **Prompt** — hospital assistant; use `{{patient_name}}` in text.
3. **Functions** → add 5 Custom Functions (POST):

| Name | URL |
|------|-----|
| `list_doctors` | `https://YOUR_NGROK/retell/tools/list-doctors` |
| `list_slots` | `https://YOUR_NGROK/retell/tools/list-slots` |
| `book_appointment` | `https://YOUR_NGROK/retell/tools/book-appointment` |
| `my_appointments` | `https://YOUR_NGROK/retell/tools/my-appointments` |
| `cancel_appointment` | `https://YOUR_NGROK/retell/tools/cancel-appointment` |

4. **Publish** the agent.
5. Copy **Agent ID** → `nodejsbackend/.env` → `RETELL_AGENT_ID`.
6. Restart Node: `yarn node:dev`.

Suggested prompt:

```
You are a friendly hospital assistant for {{patient_name}}.
Use list_doctors, list_slots, book_appointment, my_appointments, cancel_appointment.
Confirm doctor, date, and time before booking. Keep answers short for voice.
```

More detail: [nodejsbackend/README.md](../nodejsbackend/README.md).

### Step C — Test in app

1. Patient login → **AI Health Assistant** → **Talk to AI**
2. Allow **microphone** permission
3. Wait for **Live voice call**
4. Say: *"I want to book an appointment"*
5. Check ngrok inspector: http://127.0.0.1:4040 — should show `POST /retell/tools/...`

### Voice flow (reference)

```
Talk to AI
  → POST /voice/session (Node)
  → Retell access token
  → WebRTC / LiveKit
  → Retell AI + tools
  → POST /retell/tools/* (via ngrok)
  → Supabase booking
```

---

## 7. Native setup notes (LiveKit)

Voice uses `@livekit/react-native`. Required once per native build:

- **Android:** `LiveKitReactNative.setup()` in `MainApplication.kt` (already in repo)
- **iOS:** `LivekitReactNative.setup()` in `AppDelegate.swift` (already in repo)
- **JS:** `registerGlobals()` in `index.js` (already in repo)

After changing native code or adding LiveKit:

```bash
yarn android   # or yarn ios
```

---

## 8. All terminals cheat sheet

| # | Command | When |
|---|---------|------|
| 1 | `yarn start` | Always (mobile) |
| 2 | `yarn android` / `yarn ios` | Build & install app |
| 3 | `yarn node:dev` | Voice calls |
| 4 | `yarn node:reverse` | Physical Android → localhost:3001 |
| 5 | `ngrok http 3001` | Retell tools in local dev |
| 6 | `yarn api:dev` | Optional AI chat API |

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| Voice session failed | `yarn node:dev` running? `yarn node:reverse` on physical Android? |
| LiveKit "Device module not initialized" | Rebuild app: `yarn android` (native setup must be in build) |
| Agent says generic / screening questions | Wrong Retell agent — use **Single-Prompt** + hospital prompt; update `RETELL_AGENT_ID` |
| Tools not called | ngrok running? URLs in Retell **Functions** (not Webhook Settings)? Agent **Published**? |
| Tool 401 / signature error | Set `VERIFY_RETELL_SIGNATURE=false` in `nodejsbackend/.env` for local dev |
| Booking fails in tools | Use Supabase **service_role** key, not publishable key |
| Env changes not applied | `yarn start --reset-cache` and rebuild app |
| ngrok URL changed | Update all 5 function URLs in Retell after restarting ngrok |

---

## 10. Related docs

| Doc | Purpose |
|-----|---------|
| [TESTING.md](./TESTING.md) | Manual test plan — auth, admin, doctor, patient flows |
| [nodejsbackend/README.md](../nodejsbackend/README.md) | Retell tools API reference |
| [api/README.md](../api/README.md) | FastAPI AI chat backend |

---

## Quick start (voice, physical Android)

```bash
# Terminal 1
yarn start --reset-cache

# Terminal 2
yarn node:dev

# Terminal 3
ngrok http 3001
# → put ngrok URL in Retell Functions, publish agent, update RETELL_AGENT_ID

# Terminal 4
yarn node:reverse
yarn android
```

Then: Patient login → **Talk to AI** → speak to book.
