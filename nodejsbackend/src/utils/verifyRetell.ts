import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyRetellSignature(
  rawBody: string,
  apiKey: string,
  signature: string | undefined,
): boolean {
  if (!signature || !apiKey) return false;

  const match = /^v=(\d+),d=(.*)$/.exec(signature);
  if (!match) return false;

  const timestamp = match[1];
  const digest = match[2];

  if (Math.abs(Date.now() - Number(timestamp)) > 5 * 60 * 1000) {
    return false;
  }

  const expected = createHmac('sha256', apiKey)
    .update(rawBody + timestamp)
    .digest('hex');

  try {
    const expectedBuf = Buffer.from(expected, 'hex');
    const digestBuf = Buffer.from(digest, 'hex');
    if (expectedBuf.length !== digestBuf.length) return false;
    return timingSafeEqual(expectedBuf, digestBuf);
  } catch {
    return false;
  }
}
