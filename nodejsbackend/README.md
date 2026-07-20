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
| `SUPABASE_SERVICE_ROLE_KEY` | **Required** secret/service_role key (not publishable). Without it RLS returns zero doctors to Retell tools. |

Also run `supabase/migrations/021_retell_anon_read_approved_catalog.sql` in the SQL Editor if you temporarily use the publishable key.

## Run

```bash
# From project root
yarn node:dev

# Or from nodejsbackend/
npm run dev
```

- Health: `http://localhost:3001/health`
- Create voice session: `POST /voice/session`
- Legacy: `POST /calls/web` (same handler)
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

When the patient asks which days or slots are available:
- Call list_slots (doctor optional). Read back the open days and times in plain speech.
- Example: "Hashim is free tomorrow at 9 and 10, and Saturday at 11."

Booking flow:
1) list_doctors or list_slots to see availability.
2) Copy doctor_id and slot_id from tool results — never invent IDs.
3) Confirm doctor, day, and time, then book_appointment.

Never ask the patient for a doctor_id. Speak names, days, and times only.
Keep responses short for voice.
```

**Retell dashboard tip:** Keep **Payload: args only** turned **OFF** for booking tools so `call.metadata.patient_id` is sent. Or add a `patient_id` parameter with const `{{patient_id}}`.


### Tool parameters (JSON schema in Retell)

**list_doctors** — optional `specialization` (string)

**list_slots** — optional `doctor_id` (omit to hear all doctors’ open days), optional `date` (`today` / `tomorrow` / `YYYY-MM-DD`, or `available` / leave empty for all upcoming days)

**book_appointment** — `doctor_id`, `slot_id` (from list_slots), optional `appointment_date` / `appointment_time`

**my_appointments** — no args (uses `patient_id` from call metadata)

Example `list_slots` parameters JSON:
```json
{
  "type": "object",
  "required": ["doctor_id", "date"],
  "properties": {
    "doctor_id": {
      "type": "string",
      "description": "Exact doctor_id UUID from list_doctors (preferred), or doctor list number / name"
    },
    "date": {
      "type": "string",
      "description": "today, tomorrow, or YYYY-MM-DD"
    }
  }
}
```

Example `book_appointment` parameters JSON:
```json
{
  "type": "object",
  "required": ["doctor_id", "slot_id"],
  "properties": {
    "doctor_id": { "type": "string", "description": "doctor_id from list_doctors" },
    "slot_id": { "type": "string", "description": "slot_id from list_slots" },
    "appointment_date": { "type": "string" },
    "appointment_time": { "type": "string" }
  }
}
```

## Mobile (React Native — native voice)

The app uses **LiveKit native SDK** (WebRTC) to connect to Retell's voice server with the access token from `POST /voice/session`.

```
React Native (Talk to AI)
        → POST /voice/session
        → Node.js + Retell SDK
        → access token
        → WebRTC (LiveKit) → Retell Voice Server
        → LLM + function calling
        → POST /retell/tools/* → Supabase
```

Root `.env` (works with `adb reverse` on USB device + emulator):
```env
EXPO_PUBLIC_NODE_API_BASE_URL=http://127.0.0.1:3001
```

After adding LiveKit native modules:
```bash
cd ios && pod install
yarn android   # or yarn ios
yarn node:reverse   # forwards device :3001/:8000 → Mac
```

## Local dev with ngrok

```bash
ngrok http 3001
# Put ngrok URL in Retell custom function endpoints
```

Set `VERIFY_RETELL_SIGNATURE=false` only for local debugging without signatures.
