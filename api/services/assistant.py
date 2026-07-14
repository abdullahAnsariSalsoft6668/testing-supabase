import re
import uuid
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any

from models.schemas import AiChatResponse, AiSessionState, OptionItem
from services.supabase_client import display_name, get_supabase

sessions: dict[str, dict[str, Any]] = {}


@dataclass
class SessionRecord:
    state: AiSessionState
    history: list[dict[str, str]] = field(default_factory=list)


def _new_session_id() -> str:
    return f"ai-{uuid.uuid4().hex[:12]}"


def _get_or_create_session(session_id: str | None) -> tuple[str, SessionRecord]:
    if session_id and session_id in sessions:
        raw = sessions[session_id]
        return session_id, SessionRecord(
            state=AiSessionState(**raw["state"]),
            history=raw.get("history", []),
        )

    sid = session_id or _new_session_id()
    record = SessionRecord(state=AiSessionState(step="GREET"))
    sessions[sid] = {"state": record.state.model_dump(), "history": []}
    return sid, record


def _persist_session(session_id: str, record: SessionRecord) -> None:
    sessions[session_id] = {
        "state": record.state.model_dump(),
        "history": record.history,
    }


def _normalize(text: str) -> str:
    return text.strip().lower()


def _parse_date_input(text: str) -> str | None:
    t = _normalize(text)
    today = date.today()
    if "today" in t:
        return today.isoformat()
    if "tomorrow" in t:
        return (today + timedelta(days=1)).isoformat()
    match = re.search(r"\d{4}-\d{2}-\d{2}", text.strip())
    return match.group(0) if match else None


def _pick_by_index_or_label(text: str, options: list[OptionItem]) -> OptionItem | None:
    t = _normalize(text)
    num = re.search(r"\b(\d+)\b", t)
    if num:
        idx = int(num.group(1)) - 1
        if 0 <= idx < len(options):
            return options[idx]
    for opt in options:
        label = _normalize(opt.label)
        if label in t or t in label:
            return opt
    return None


def _is_affirmative(text: str) -> bool:
    t = _normalize(text)
    return any(w in t for w in ("yes", "yeah", "yep", "confirm", "book it", "ok", "okay", "sure", "go ahead"))


def _is_negative(text: str) -> bool:
    t = _normalize(text)
    return any(w in t for w in ("no", "cancel", "stop", "never mind", "not now"))


def _list_approved_doctors(client) -> list[dict]:
    res = (
        client.from_("doctors")
        .select("*, users(*), hospitals(*), departments(*)")
        .eq("status", "APPROVED")
        .order("created_at", desc=True)
        .execute()
    )
    return res.data or []


def _list_patient_appointments(client, patient_id: str) -> list[dict]:
    res = (
        client.from_("appointments")
        .select("*, patients(*, users(*)), doctors(*, users(*))")
        .eq("patient_id", patient_id)
        .order("appointment_date", desc=True)
        .execute()
    )
    if res.data:
        return res.data
    basic = (
        client.from_("appointments")
        .select("*")
        .eq("patient_id", patient_id)
        .order("appointment_date", desc=True)
        .execute()
    )
    return basic.data or []


def _list_available_slots(client, doctor_id: str, slot_date: str) -> list[dict]:
    res = (
        client.from_("doctor_slots")
        .select("*")
        .eq("doctor_id", doctor_id)
        .eq("appointment_date", slot_date)
        .eq("status", "AVAILABLE")
        .order("start_time")
        .execute()
    )
    return res.data or []


def _book_appointment(client, payload: dict) -> dict:
    res = (
        client.from_("appointments")
        .insert({**payload, "status": "PENDING"})
        .select("*")
        .single()
        .execute()
    )
    if not res.data:
        raise RuntimeError("Failed to book appointment")
    return res.data


async def run_local_alpha_assistant(
    message: str,
    patient_id: str,
    session_id: str,
    record: SessionRecord,
    access_token: str | None = None,
) -> AiChatResponse:
    client = get_supabase(access_token)
    text = message.strip()
    state = record.state
    record.history.append({"role": "user", "text": text})

    reply_text = ""
    suggestions: list[str] | None = None
    booked_appointment_id: str | None = None

    help_text = (
        'I can help you book an appointment, check your visits, or answer basic questions. '
        'Try: "Book an appointment", "Show my visits", or "Find a cardiologist".'
    )

    if not text:
        reply_text = "Please say or type your request."
        suggestions = ["Book an appointment", "Show my visits", "Help"]
    elif "help" in _normalize(text) or _normalize(text) == "?":
        state.step = "IDLE"
        reply_text = help_text
        suggestions = ["Book an appointment", "Show my visits"]
    elif any(
        phrase in _normalize(text)
        for phrase in ("my visit", "my appointment", "upcoming")
    ):
        state.step = "IDLE"
        rows = _list_patient_appointments(client, patient_id)
        if not rows:
            reply_text = "You don't have any appointments yet. Would you like to book one?"
            suggestions = ["Book an appointment"]
        else:
            lines = []
            for a in rows[:5]:
                doctor = display_name((a.get("doctors") or {}).get("users"), "Doctor")
                time = (a.get("appointment_time") or "")[:5]
                lines.append(f"• {doctor} — {a.get('appointment_date')} at {time} ({a.get('status')})")
            reply_text = "Here are your recent visits:\n\n" + "\n".join(lines)
            suggestions = ["Book another appointment"]
    elif (
        state.step in ("IDLE", "GREET")
        or "book" in _normalize(text)
        or "appointment" in _normalize(text)
        or "doctor" in _normalize(text)
        or "find" in _normalize(text)
    ):
        doctors = _list_approved_doctors(client)
        if not doctors:
            state.step = "IDLE"
            reply_text = "No approved doctors are available right now. Please try again later."
        else:
            query = _normalize(text)
            is_generic = (
                "book" in query
                or "appointment" in query
                or query == "find a doctor"
                or query == "help"
            )
            filtered = (
                []
                if is_generic
                else [
                    d
                    for d in doctors
                    if query in display_name(d.get("users"), "").lower()
                    or query in (d.get("specialization") or "").lower()
                    or query in ((d.get("departments") or {}).get("name") or "").lower()
                ]
            )
            picks = filtered if 0 < len(filtered) <= 3 else doctors[:5]
            state.doctor_options = [
                OptionItem(
                    id=d["id"],
                    label=f"{display_name(d.get('users'), 'Doctor')} — {d.get('specialization', '')}",
                )
                for d in picks
            ]

            if len(filtered) == 1:
                d = filtered[0]
                state.doctor_id = d["id"]
                state.doctor_name = display_name(d.get("users"), "Doctor")
                state.step = "PICK_DATE"
                reply_text = (
                    f"Great, {state.doctor_name} ({d.get('specialization', '')}). "
                    'What date works for you? Say "tomorrow" or use YYYY-MM-DD.'
                )
                suggestions = ["Tomorrow", "Today"]
            else:
                state.step = "PICK_DOCTOR"
                listing = "\n".join(
                    f"{i + 1}. {opt.label}" for i, opt in enumerate(state.doctor_options)
                )
                reply_text = (
                    "I can help you book a visit. Which doctor would you like?\n\n"
                    f"{listing}\n\nReply with a number or doctor name."
                )
                suggestions = [o.label.split(" — ")[0] for o in state.doctor_options[:3]]
    elif state.step == "PICK_DOCTOR" and state.doctor_options:
        picked = _pick_by_index_or_label(text, state.doctor_options)
        if not picked:
            reply_text = "I didn't catch that doctor. Please reply with the number or name from the list."
        else:
            state.doctor_id = picked.id
            state.doctor_name = picked.label.split(" — ")[0]
            state.step = "PICK_DATE"
            reply_text = (
                f"Perfect. When would you like to see {state.doctor_name}? "
                'Say "tomorrow" or a date like 2026-07-15.'
            )
            suggestions = ["Tomorrow", "Today"]
    elif state.step == "PICK_DATE":
        slot_date = _parse_date_input(text)
        if not slot_date or not state.doctor_id:
            reply_text = 'Please share a valid date — try "tomorrow" or YYYY-MM-DD.'
            suggestions = ["Tomorrow"]
        else:
            slots = _list_available_slots(client, state.doctor_id, slot_date)
            if not slots:
                state.step = "PICK_DATE"
                reply_text = f"No open slots on {slot_date}. Try another date."
                suggestions = ["Tomorrow"]
            else:
                state.date = slot_date
                state.slot_options = [
                    OptionItem(
                        id=s["id"],
                        label=f"{s['start_time'][:5]} – {s['end_time'][:5]}",
                    )
                    for s in slots[:6]
                ]
                state.step = "PICK_SLOT"
                listing = "\n".join(
                    f"{i + 1}. {opt.label}" for i, opt in enumerate(state.slot_options)
                )
                reply_text = f"Available times on {slot_date}:\n\n{listing}\n\nWhich slot would you like?"
                suggestions = [o.label for o in state.slot_options[:3]]
    elif state.step == "PICK_SLOT" and state.slot_options:
        picked = _pick_by_index_or_label(text, state.slot_options)
        if not picked:
            reply_text = "Please pick a slot by number or time from the list."
        else:
            state.slot_id = picked.id
            state.slot_label = picked.label
            state.step = "CONFIRM"
            reply_text = (
                "Please confirm:\n\n"
                f"Doctor: {state.doctor_name}\n"
                f"Date: {state.date}\n"
                f"Time: {state.slot_label}\n\n"
                "Shall I book this appointment?"
            )
            suggestions = ["Yes, book it", "No, cancel"]
    elif state.step == "CONFIRM":
        if _is_negative(text):
            state.step = "IDLE"
            reply_text = "No problem — booking cancelled. How else can I help?"
            suggestions = ["Book an appointment", "Show my visits"]
        elif _is_affirmative(text) and state.doctor_id and state.slot_id and state.date:
            slot = next((s for s in (state.slot_options or []) if s.id == state.slot_id), None)
            start_time = (slot.label.split("–")[0].strip() if slot else "09:00")
            time_value = f"{start_time}:00" if start_time.count(":") == 1 else start_time
            appointment = _book_appointment(
                client,
                {
                    "patient_id": patient_id,
                    "doctor_id": state.doctor_id,
                    "slot_id": state.slot_id,
                    "appointment_date": state.date,
                    "appointment_time": time_value,
                    "notes": "Booked via AI assistant (FastAPI)",
                },
            )
            booked_appointment_id = appointment["id"]
            state.step = "BOOKED"
            reply_text = (
                f"Done! Your appointment with {state.doctor_name} is booked for "
                f"{state.date} at {state.slot_label}. Check My Visits for details."
            )
            suggestions = ["Show my visits", "Book another"]
        else:
            reply_text = 'Reply "yes" to confirm booking or "no" to cancel.'
            suggestions = ["Yes, book it", "No"]
    elif state.step == "BOOKED":
        state.step = "IDLE"
        reply_text = "Happy to help! Would you like to book another visit or check your appointments?"
        suggestions = ["Show my visits", "Book an appointment"]
    else:
        state.step = "IDLE"
        reply_text = help_text
        suggestions = ["Book an appointment", "Show my visits"]

    record.history.append({"role": "assistant", "text": reply_text})
    _persist_session(session_id, record)

    return AiChatResponse(
        sessionId=session_id,
        replyText=reply_text,
        suggestions=suggestions,
        sessionState=deepcopy(state),
        bookedAppointmentId=booked_appointment_id,
        usedRemoteApi=True,
    )


async def handle_chat(
    message: str,
    patient_id: str,
    session_id: str | None = None,
    access_token: str | None = None,
) -> AiChatResponse:
    sid, record = _get_or_create_session(session_id)
    return await run_local_alpha_assistant(message, patient_id, sid, record, access_token)
