# Retell AI Voice Backend (Node.js)

Node.js server for **Retell voice calls** + **Supabase booking tools**.

## Setup

```bash
cd nodejsbackend
npm install
cp .env.example .env   # optional — root .env is also loaded
```

Fill in `nodejsbackend/.env` or root `.env`:

| Variable | Description |
|----------|-------------|
| `RETELL_API_KEY` | From [Retell dashboard](https://dashboard.retellai.com) |
| `RETELL_AGENT_ID` | Your voice agent id |
| `EXPO_PUBLIC_SUPABASE_URL` | Same as mobile (auto-loaded from root `.env`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Recommended for server-side booking |

## Run

```bash
# From project root
yarn node:dev

# Or from nodejsbackend/
npm run dev
```

- Health: `http://localhost:3001/health`
- Create web call: `POST /calls/web`
- Retell tools: `POST /retell/tools/*`

## Retell dashboard — Custom Functions

Point each function to your public URL (use ngrok for local dev):

| Function name | URL |
|---------------|-----|
| `list_doctors` | `POST https://YOUR_HOST/retell/tools/list-doctors` |
| `list_slots` | `POST https://YOUR_HOST/retell/tools/list-slots` |
| `book_appointment` | `POST https://YOUR_HOST/retell/tools/book-appointment` |
| `my_appointments` | `POST https://YOUR_HOST/retell/tools/my-appointments` |
| `cancel_appointment` | `POST https://YOUR_HOST/retell/tools/cancel-appointment` |

### Suggested agent prompt

```
You are a friendly hospital assistant for {{patient_name}}.

Use tools to find doctors, check slots, book appointments, and list visits.
Always confirm doctor, date, and time before calling book_appointment.
Keep responses short for voice.
```

### Tool parameters (JSON schema in Retell)

**list_doctors** — optional `specialization` (string)

**list_slots** — required `doctor_id`, `date` (today/tomorrow/YYYY-MM-DD)

**book_appointment** — required `doctor_id`, `slot_id`, `appointment_date`, `appointment_time`

**my_appointments** — no args (uses `patient_id` from call metadata)

## Mobile (React Native — native voice)

The app uses **LiveKit native SDK** (not WebView) to connect to Retell's room with the access token from `POST /calls/web`.

Root `.env`:
```env
EXPO_PUBLIC_NODE_API_BASE_URL=http://10.0.2.2:3001
```

After adding LiveKit native modules:
```bash
cd ios && pod install
yarn android   # or yarn ios
adb reverse tcp:3001 tcp:3001   # Android emulator
```

## Local dev with ngrok

```bash
ngrok http 3001
# Put ngrok URL in Retell custom function endpoints
```

Set `VERIFY_RETELL_SIGNATURE=false` only for local debugging without signatures.
