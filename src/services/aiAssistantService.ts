import { bookAppointment, listPatientAppointments } from '@/services/appointmentService';
import { listApprovedDoctors } from '@/services/doctorService';
import { listAvailableSlots } from '@/services/slotService';
import type { AiChatResponse, AiSessionState } from '@/types/aiAssistant';
import { getUserDisplayName } from '@/utils/userDisplay';
import { EXPO_PUBLIC_AI_API_BASE_URL } from '@env';

type SessionRecord = {
    state: AiSessionState;
    history: { role: 'user' | 'assistant'; text: string }[];
};

const sessions = new Map<string, SessionRecord>();

function newSessionId() {
    return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getOrCreateSession(sessionId?: string): { id: string; record: SessionRecord } {
    if (sessionId && sessions.has(sessionId)) {
        return { id: sessionId, record: sessions.get(sessionId)! };
    }
    const id = sessionId ?? newSessionId();
    const record: SessionRecord = {
        state: { step: 'GREET' },
        history: [],
    };
    sessions.set(id, record);
    return { id, record };
}

function normalize(text: string) {
    return text.trim().toLowerCase();
}

function parseDateInput(text: string): string | null {
    const t = normalize(text);
    const today = new Date();
    if (t.includes('today')) {
        return today.toISOString().split('T')[0];
    }
    if (t.includes('tomorrow')) {
        const d = new Date(today);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    }
    const iso = text.trim().match(/\d{4}-\d{2}-\d{2}/);
    return iso ? iso[0] : null;
}

function pickByIndexOrLabel<T extends { id: string; label: string }>(text: string, options: T[]): T | null {
    const t = normalize(text);
    const num = t.match(/\b(\d+)\b/);
    if (num) {
        const idx = Number(num[1]) - 1;
        if (idx >= 0 && idx < options.length) return options[idx];
    }
    return options.find((o) => t.includes(normalize(o.label)) || normalize(o.label).includes(t)) ?? null;
}

function isAffirmative(text: string) {
    const t = normalize(text);
    return ['yes', 'yeah', 'yep', 'confirm', 'book it', 'ok', 'okay', 'sure', 'go ahead'].some((w) => t.includes(w));
}

function isNegative(text: string) {
    const t = normalize(text);
    return ['no', 'cancel', 'stop', 'never mind', 'not now'].some((w) => t.includes(w));
}

async function runLocalAlphaAssistant(
    message: string,
    patientId: string,
    sessionId: string,
    record: SessionRecord,
): Promise<AiChatResponse> {
    const text = message.trim();
    const state = record.state;
    record.history.push({ role: 'user', text });

    let replyText = '';
    let suggestions: string[] | undefined;
    let bookedAppointmentId: string | undefined;

    const helpText =
        'I can help you book an appointment, check your visits, or answer basic questions. Try: "Book an appointment", "Show my visits", or "Find a cardiologist".';

    if (!text) {
        replyText = 'Please say or type your request.';
        suggestions = ['Book an appointment', 'Show my visits', 'Help'];
    } else if (normalize(text).includes('help') || normalize(text) === '?') {
        state.step = 'IDLE';
        replyText = helpText;
        suggestions = ['Book an appointment', 'Show my visits'];
    } else if (
        normalize(text).includes('my visit') ||
        normalize(text).includes('my appointment') ||
        normalize(text).includes('upcoming')
    ) {
        state.step = 'IDLE';
        const rows = await listPatientAppointments(patientId);
        if (rows.length === 0) {
            replyText = "You don't have any appointments yet. Would you like to book one?";
            suggestions = ['Book an appointment'];
        } else {
            const lines = rows.slice(0, 5).map((a) => {
                const doctor = getUserDisplayName(a.doctors?.users, 'Doctor');
                const time = a.appointment_time?.slice(0, 5) ?? '';
                return `• ${doctor} — ${a.appointment_date} at ${time} (${a.status})`;
            });
            replyText = `Here are your recent visits:\n\n${lines.join('\n')}`;
            suggestions = ['Book another appointment'];
        }
    } else if (
        state.step === 'IDLE' ||
        state.step === 'GREET' ||
        normalize(text).includes('book') ||
        normalize(text).includes('appointment') ||
        normalize(text).includes('doctor') ||
        normalize(text).includes('find')
    ) {
        const doctors = await listApprovedDoctors();
        if (doctors.length === 0) {
            state.step = 'IDLE';
            replyText = 'No approved doctors are available right now. Please try again later.';
        } else {
            const query = normalize(text);
            const isGenericBook =
                query.includes('book') || query.includes('appointment') || query === 'find a doctor' || query === 'help';

            const filtered = isGenericBook
                ? []
                : doctors.filter((d) => {
                      const name = getUserDisplayName(d.users, '');
                      return (
                          name.toLowerCase().includes(query) ||
                          d.specialization?.toLowerCase().includes(query) ||
                          d.departments?.name?.toLowerCase().includes(query)
                      );
                  });

            const picks = filtered.length > 0 && filtered.length <= 3 ? filtered : doctors.slice(0, 5);

            state.doctorOptions = picks.map((d) => ({
                id: d.id,
                label: `${getUserDisplayName(d.users, 'Doctor')} — ${d.specialization}`,
            }));

            if (filtered.length === 1) {
                const d = filtered[0];
                state.doctorId = d.id;
                state.doctorName = getUserDisplayName(d.users, 'Doctor');
                state.step = 'PICK_DATE';
                replyText = `Great, ${state.doctorName} (${d.specialization}). What date works for you? Say "tomorrow" or use YYYY-MM-DD.`;
                suggestions = ['Tomorrow', 'Today'];
            } else {
                state.step = 'PICK_DOCTOR';
                const list = state.doctorOptions.map((d, i) => `${i + 1}. ${d.label}`).join('\n');
                replyText = `I can help you book a visit. Which doctor would you like?\n\n${list}\n\nReply with a number or doctor name.`;
                suggestions = state.doctorOptions.slice(0, 3).map((d) => d.label.split(' — ')[0]);
            }
        }
    } else if (state.step === 'PICK_DOCTOR' && state.doctorOptions?.length) {
        const picked = pickByIndexOrLabel(text, state.doctorOptions);
        if (!picked) {
            replyText = "I didn't catch that doctor. Please reply with the number or name from the list.";
        } else {
            state.doctorId = picked.id;
            state.doctorName = picked.label.split(' — ')[0];
            state.step = 'PICK_DATE';
            replyText = `Perfect. When would you like to see ${state.doctorName}? Say "tomorrow" or a date like 2026-07-15.`;
            suggestions = ['Tomorrow', 'Today'];
        }
    } else if (state.step === 'PICK_DATE') {
        const date = parseDateInput(text);
        if (!date || !state.doctorId) {
            replyText = 'Please share a valid date — try "tomorrow" or YYYY-MM-DD.';
            suggestions = ['Tomorrow'];
        } else {
            const slots = await listAvailableSlots(state.doctorId, date);
            if (slots.length === 0) {
                state.step = 'PICK_DATE';
                replyText = `No open slots on ${date}. Try another date.`;
                suggestions = ['Tomorrow'];
            } else {
                state.date = date;
                state.slotOptions = slots.slice(0, 6).map((s) => ({
                    id: s.id,
                    label: `${s.start_time.slice(0, 5)} – ${s.end_time.slice(0, 5)}`,
                }));
                state.step = 'PICK_SLOT';
                const list = state.slotOptions.map((s, i) => `${i + 1}. ${s.label}`).join('\n');
                replyText = `Available times on ${date}:\n\n${list}\n\nWhich slot would you like?`;
                suggestions = state.slotOptions.slice(0, 3).map((s) => s.label);
            }
        }
    } else if (state.step === 'PICK_SLOT' && state.slotOptions?.length) {
        const picked = pickByIndexOrLabel(text, state.slotOptions);
        if (!picked) {
            replyText = 'Please pick a slot by number or time from the list.';
        } else {
            state.slotId = picked.id;
            state.slotLabel = picked.label;
            state.step = 'CONFIRM';
            replyText = `Please confirm:\n\nDoctor: ${state.doctorName}\nDate: ${state.date}\nTime: ${state.slotLabel}\n\nShall I book this appointment?`;
            suggestions = ['Yes, book it', 'No, cancel'];
        }
    } else if (state.step === 'CONFIRM') {
        if (isNegative(text)) {
            state.step = 'IDLE';
            replyText = 'No problem — booking cancelled. How else can I help?';
            suggestions = ['Book an appointment', 'Show my visits'];
        } else if (isAffirmative(text) && state.doctorId && state.slotId && state.date) {
            const slot = state.slotOptions?.find((s) => s.id === state.slotId);
            const startTime = slot?.label.split('–')[0]?.trim() ?? '09:00';
            const timeValue = startTime.includes(':') && startTime.split(':').length === 2 ? `${startTime}:00` : startTime;
            const appointment = await bookAppointment({
                patient_id: patientId,
                doctor_id: state.doctorId,
                slot_id: state.slotId,
                appointment_date: state.date,
                appointment_time: timeValue,
                notes: 'Booked via AI assistant (alpha)',
            });
            bookedAppointmentId = appointment.id;
            state.step = 'BOOKED';
            replyText = `Done! Your appointment with ${state.doctorName} is booked for ${state.date} at ${state.slotLabel}. Check My Visits for details.`;
            suggestions = ['Show my visits', 'Book another'];
        } else {
            replyText = 'Reply "yes" to confirm booking or "no" to cancel.';
            suggestions = ['Yes, book it', 'No'];
        }
    } else if (state.step === 'BOOKED') {
        state.step = 'IDLE';
        replyText = 'Happy to help! Would you like to book another visit or check your appointments?';
        suggestions = ['Show my visits', 'Book an appointment'];
    } else {
        state.step = 'IDLE';
        replyText = helpText;
        suggestions = ['Book an appointment', 'Show my visits'];
    }

    record.history.push({ role: 'assistant', text: replyText });
    return {
        sessionId,
        replyText,
        suggestions,
        sessionState: { ...state },
        bookedAppointmentId,
        usedRemoteApi: false,
    };
}

function getAiApiBaseUrl() {
    return EXPO_PUBLIC_AI_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';
}

async function sendViaRemoteApi(params: {
    message: string;
    patientId: string;
    sessionId?: string;
    accessToken?: string;
}): Promise<AiChatResponse | null> {
    const baseUrl = getAiApiBaseUrl();
    if (!baseUrl) return null;

    try {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        const token = params.accessToken?.trim();
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${baseUrl}/ai/chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                message: params.message,
                patientId: params.patientId,
                sessionId: params.sessionId,
            }),
        });

        if (!res.ok) return null;

        const data = (await res.json()) as AiChatResponse;
        return { ...data, usedRemoteApi: true };
    } catch {
        return null;
    }
}

export async function sendAiChatMessage(params: {
    message: string;
    patientId: string;
    sessionId?: string;
    accessToken?: string;
}): Promise<AiChatResponse> {
    const remote = await sendViaRemoteApi(params);
    if (remote) return remote;

    const { id, record } = getOrCreateSession(params.sessionId);
    return runLocalAlphaAssistant(params.message, params.patientId, id, record);
}

export function getAiGreeting(firstName?: string) {
    const name = firstName?.trim() || 'there';
    return `Hi ${name}! I'm your health assistant. I can book appointments and answer questions about your visits. How can I help you today?`;
}

export const AI_QUICK_PROMPTS = ['Book an appointment', 'Show my visits', 'Find a doctor', 'Help'] as const;
