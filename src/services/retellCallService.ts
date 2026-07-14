import { EXPO_PUBLIC_NODE_API_BASE_URL } from '@env';

export type VoiceSession = {
  accessToken: string;
  callId: string;
  agentId?: string;
};

function getNodeApiBaseUrl() {
  return EXPO_PUBLIC_NODE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';
}

export function isVoiceSessionEnabled() {
  return Boolean(getNodeApiBaseUrl());
}

/** @deprecated use isVoiceSessionEnabled */
export function isRetellVoiceEnabled() {
  return isVoiceSessionEnabled();
}

/** POST /voice/session → Retell access token for WebRTC (LiveKit) */
export async function createVoiceSession(params: {
  patientId: string;
  firstName?: string;
  accessToken: string;
}): Promise<VoiceSession | null> {
  const baseUrl = getNodeApiBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/voice/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.accessToken}`,
      },
      body: JSON.stringify({
        patientId: params.patientId,
        firstName: params.firstName,
      }),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as VoiceSession;
    if (!data.accessToken) return null;
    return data;
  } catch {
    return null;
  }
}

/** @deprecated use createVoiceSession */
export type RetellWebCallSession = VoiceSession;

/** @deprecated use createVoiceSession */
export async function createRetellWebCall(params: {
  patientId: string;
  firstName?: string;
  accessToken: string;
}): Promise<VoiceSession | null> {
  return createVoiceSession(params);
}
