export type AiChatRole = 'user' | 'assistant' | 'system';

export type AiChatMessage = {
    id: string;
    role: AiChatRole;
    text: string;
    timestamp: number;
};

export type AiBookingStep =
    | 'GREET'
    | 'PICK_DOCTOR'
    | 'PICK_DATE'
    | 'PICK_SLOT'
    | 'CONFIRM'
    | 'BOOKED'
    | 'IDLE';

export type AiSessionState = {
    step: AiBookingStep;
    doctorId?: string;
    doctorName?: string;
    date?: string;
    slotId?: string;
    slotLabel?: string;
    slotOptions?: { id: string; label: string }[];
    doctorOptions?: { id: string; label: string }[];
};

export type AiChatResponse = {
    sessionId: string;
    replyText: string;
    suggestions?: string[];
    sessionState?: AiSessionState;
    bookedAppointmentId?: string;
    usedRemoteApi: boolean;
};
