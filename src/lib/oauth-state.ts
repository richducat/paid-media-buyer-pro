import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const OAUTH_COOKIE = 'pmp_oauth_state';

export type OAuthState = {
  platform: 'google' | 'meta';
  state: string;
  verifier?: string;
  issuedAt: number;
};

function stateSecret() {
  const secret = process.env.OAUTH_STATE_SECRET || process.env.TOKEN_ENCRYPTION_KEY;
  if (!secret || secret.length < 32) throw new Error('OAUTH_STATE_SECRET must be configured.');
  return secret;
}

function sign(payload: string) {
  return createHmac('sha256', stateSecret()).update(payload).digest('base64url');
}

export function createOAuthState(platform: OAuthState['platform'], verifier?: string) {
  const value: OAuthState = {
    platform,
    state: randomBytes(24).toString('base64url'),
    verifier,
    issuedAt: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  return { value, cookie: `${payload}.${sign(payload)}` };
}

export function verifyOAuthState(cookie: string | undefined, state: string | null, platform: OAuthState['platform']) {
  if (!cookie || !state) return null;
  const [payload, signature] = cookie.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as OAuthState;
  if (parsed.platform !== platform || parsed.state !== state || Date.now() - parsed.issuedAt > 10 * 60_000) return null;
  return parsed;
}
