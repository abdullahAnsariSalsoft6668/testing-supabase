/**
 * Logs only in development. No-op in production.
 */
export function devLog(...args: unknown[]): void {
    if (__DEV__) {
        console.log(...args);
    }
}
