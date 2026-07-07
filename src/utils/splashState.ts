/**
 * Tracks whether we're showing OnBoard for the first time this session (right after splash).
 * Used so onboarding uses a delayed animation only after splash, and no delay after logout.
 */
let isFirstOnBoardAfterLaunch = true;

export function consumeFirstOnBoardAfterLaunch(): boolean {
  const value = isFirstOnBoardAfterLaunch;
  isFirstOnBoardAfterLaunch = false;
  return value;
}
