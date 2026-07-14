import Retell from 'retell-sdk';
import { config } from '../config';

const retell = new Retell({ apiKey: config.retellApiKey });

export type VoiceSessionResult = {
  accessToken: string;
  callId: string;
  agentId?: string;
};

export async function createVoiceSession(params: {
  patientId: string;
  firstName: string;
}): Promise<VoiceSessionResult> {
  if (!config.retellApiKey || !config.retellAgentId) {
    throw new Error('Retell is not configured. Set RETELL_API_KEY and RETELL_AGENT_ID.');
  }

  const call = await retell.call.createWebCall({
    agent_id: config.retellAgentId,
    metadata: { patient_id: params.patientId },
    retell_llm_dynamic_variables: {
      patient_name: params.firstName,
      patient_id: params.patientId,
    },
  });

  return {
    accessToken: call.access_token,
    callId: call.call_id,
    agentId: call.agent_id,
  };
}
