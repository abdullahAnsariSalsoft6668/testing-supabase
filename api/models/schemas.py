from typing import Literal

from pydantic import BaseModel, Field


AiBookingStep = Literal[
    "GREET", "PICK_DOCTOR", "PICK_DATE", "PICK_SLOT", "CONFIRM", "BOOKED", "IDLE"
]


class OptionItem(BaseModel):
    id: str
    label: str


class AiSessionState(BaseModel):
    step: AiBookingStep = "GREET"
    doctor_id: str | None = Field(default=None, alias="doctorId")
    doctor_name: str | None = Field(default=None, alias="doctorName")
    date: str | None = None
    slot_id: str | None = Field(default=None, alias="slotId")
    slot_label: str | None = Field(default=None, alias="slotLabel")
    slot_options: list[OptionItem] | None = Field(default=None, alias="slotOptions")
    doctor_options: list[OptionItem] | None = Field(default=None, alias="doctorOptions")

    model_config = {"populate_by_name": True}


class AiChatRequest(BaseModel):
    message: str = Field(..., min_length=0)
    patient_id: str = Field(..., alias="patientId")
    session_id: str | None = Field(default=None, alias="sessionId")

    model_config = {"populate_by_name": True}


class AiChatResponse(BaseModel):
    session_id: str = Field(..., alias="sessionId")
    reply_text: str = Field(..., alias="replyText")
    suggestions: list[str] | None = None
    session_state: AiSessionState | None = Field(default=None, alias="sessionState")
    booked_appointment_id: str | None = Field(default=None, alias="bookedAppointmentId")
    used_remote_api: bool = Field(default=True, alias="usedRemoteApi")

    model_config = {"populate_by_name": True}


class HealthResponse(BaseModel):
    status: str
    openai_configured: bool
    supabase_configured: bool
