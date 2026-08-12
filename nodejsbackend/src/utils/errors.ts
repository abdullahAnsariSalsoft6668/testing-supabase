/** Turn Supabase PostgrestError / JS errors into readable log + voice text. */
export function formatErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;

  if (typeof error === 'object') {
    const e = error as Record<string, unknown>;
    const message =
      (typeof e.message === 'string' && e.message) ||
      (typeof e.error_description === 'string' && e.error_description) ||
      (typeof e.details === 'string' && e.details) ||
      '';

    if (message) {
      if (message.includes('appointments_patient_id_fkey') || message.includes('Key (patient_id)')) {
        return `${message} Check RETELL_TEST_PATIENT_ID in nodejsbackend/.env — it must match a row in the patients table.`;
      }
      if (message.includes('invalid input syntax for type uuid')) {
        return `${message} The patient or slot id sent to Supabase was invalid.`;
      }
      return message;
    }

    const code = typeof e.code === 'string' ? e.code : '';
    const details = typeof e.details === 'string' ? e.details : '';
    if (code || details) {
      return [code, details].filter(Boolean).join(': ');
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'Something went wrong';
    }
  }

  return String(error);
}
