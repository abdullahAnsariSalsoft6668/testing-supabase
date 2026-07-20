import { EXPO_PUBLIC_NODE_API_BASE_URL } from '@env';

export type VoiceSession = {
  accessToken: string;
  callId: string;
  agentId?: string;
};

export type CreateVoiceSessionResult =
  | { ok: true; session: VoiceSession }
  | { ok: false; error: string };

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
}): Promise<CreateVoiceSessionResult> {
  const baseUrl = getNodeApiBaseUrl();
  if (!baseUrl) {
    return {
      ok: false,
      error: 'EXPO_PUBLIC_NODE_API_BASE_URL is not set. Use http://127.0.0.1:3001 with yarn node:reverse.',
    };
  }

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

    const data = (await res.json().catch(() => ({}))) as VoiceSession & { error?: string };

    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? `Voice session failed (${res.status}). Is Node running on :3001?`,
      };
    }

    if (!data.accessToken) {
      return { ok: false, error: 'Voice session response missing accessToken' };
    }

    return {
      ok: true,
      session: {
        accessToken: data.accessToken,
        callId: data.callId,
        agentId: data.agentId,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    return {
      ok: false,
      error: `${message}. Run: yarn node:dev && yarn node:reverse`,
    };
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
  const result = await createVoiceSession(params);
  return result.ok ? result.session : null;
}
