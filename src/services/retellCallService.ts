import { EXPO_PUBLIC_NODE_API_BASE_URL } from '@env';

export type RetellWebCallSession = {
  accessToken: string;
  callId: string;
  agentId?: string;
};

function getNodeApiBaseUrl() {
  return EXPO_PUBLIC_NODE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';
}

export function isRetellVoiceEnabled() {
  return Boolean(getNodeApiBaseUrl());
}

export async function createRetellWebCall(params: {
  patientId: string;
  firstName?: string;
  accessToken: string;
}): Promise<RetellWebCallSession | null> {
  const baseUrl = getNodeApiBaseUrl();
  if (!baseUrl) return null;

  try {
    const res = await fetch(`${baseUrl}/calls/web`, {
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

    const data = (await res.json()) as RetellWebCallSession;
    if (!data.accessToken) return null;
    return data;
  } catch {
    return null;
  }
}
