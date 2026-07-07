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
            if (message.includes('row-level security')) {
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
