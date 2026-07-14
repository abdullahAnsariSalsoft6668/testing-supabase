import { useCallback, useRef, useState } from 'react';

import { AI_QUICK_PROMPTS, getAiGreeting, sendAiChatMessage } from '@/services/aiAssistantService';
import type { AiChatMessage } from '@/types/aiAssistant';
import { useSelector } from '@/redux/hooks';

function makeMessage(role: AiChatMessage['role'], text: string): AiChatMessage {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role,
        text,
        timestamp: Date.now(),
    };
}

export function useAiAssistant(patientId: string | undefined, firstName?: string) {
    const accessToken = useSelector((s) => s.auth.auth_token);
    const [messages, setMessages] = useState<AiChatMessage[]>([]);
    const [sessionId, setSessionId] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const sendingRef = useRef(false);

    const initGreeting = useCallback(() => {
        if (initialized) return;
        setMessages([makeMessage('assistant', getAiGreeting(firstName))]);
        setInitialized(true);
    }, [firstName, initialized]);

    const sendMessage = useCallback(
        async (text: string) => {
            const trimmed = text.trim();
            if (!trimmed || !patientId || sendingRef.current) return;

            sendingRef.current = true;
            setLoading(true);
            setMessages((prev) => [...prev, makeMessage('user', trimmed)]);

            try {
                const res = await sendAiChatMessage({
                    message: trimmed,
                    patientId,
                    sessionId,
                    accessToken,
                });
                setSessionId(res.sessionId);
                setMessages((prev) => [...prev, makeMessage('assistant', res.replyText)]);
                return res;
            } catch {
                setMessages((prev) => [
                    ...prev,
                    makeMessage('assistant', 'Sorry, something went wrong. Please try again.'),
                ]);
                return null;
            } finally {
                setLoading(false);
                sendingRef.current = false;
            }
        },
        [patientId, sessionId, accessToken],
    );

    const resetSession = useCallback(() => {
        setSessionId(undefined);
        setMessages([makeMessage('assistant', getAiGreeting(firstName))]);
        setInitialized(true);
    }, [firstName]);

    return {
        messages,
        loading,
        sessionId,
        quickPrompts: AI_QUICK_PROMPTS,
        initGreeting,
        sendMessage,
        resetSession,
    };
}
