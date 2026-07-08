/** Turn Supabase / JS errors into readable toast text (avoids "[object Object]"). */
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
            if (message.includes('Could not find the') && message.includes("'patients'")) {
                return `${message} Run supabase/migrations/016_add_patient_profile_columns.sql in Supabase SQL Editor.`;
            }
            if (message.includes('infinite recursion') && message.includes('patients')) {
                return `${message} Run supabase/migrations/018_fix_patients_rls_recursion.sql in Supabase SQL Editor.`;
            }
            if (message.includes('list_doctor_appointments') || message.includes('get_doctor_appointment')) {
                return `${message} Run supabase/migrations/020_doctor_appointments_rpc.sql in Supabase SQL Editor.`;
            }
            if (message.includes('row-level security')) {
                if (message.includes('patients')) {
                    return `${message} Run supabase/migrations/018_fix_patients_rls_recursion.sql in Supabase SQL Editor, then sign out and sign in.`;
                }
                if (message.includes('doctors')) {
                    return `${message} Run supabase/migrations/012_fix_doctor_patient_insert_rls.sql in Supabase SQL Editor.`;
                }
                if (message.includes('appointments')) {
                    return `${message} Run supabase/migrations/019_fix_appointments_users_rls.sql in Supabase SQL Editor.`;
                }
                return `${message} Run supabase/migrations/009_fix_is_admin_and_backfill_users.sql, set role ADMIN via auth email join, then log out and back in.`;
            }
            return message;
        }

        try {
            return JSON.stringify(error);
        } catch {
            return 'Something went wrong';
        }
    }

    return String(error);
}
