import { NextResponse } from 'next/server';
import { createOAuthState, OAUTH_COOKIE } from '@/lib/oauth-state';
import { googlePkce, googleRedirectUri } from '@/lib/google-ads';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.GOOGLE_ADS_CLIENT_ID || !process.env.GOOGLE_ADS_CLIENT_SECRET || !process.env.GOOGLE_ADS_DEVELOPER_TOKEN || !process.env.TOKEN_ENCRYPTION_KEY) {
    return NextResponse.redirect(new URL('/dashboard?connection_error=google_not_configured', process.env.APP_URL || 'https://paidmediapro.eb28.co'));
  }
  const { verifier, challenge } = googlePkce();
  const oauth = createOAuthState('google', verifier);
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile https://www.googleapis.com/auth/adwords',
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: 'true',
    state: oauth.value.state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString();
  const response = NextResponse.redirect(url);
  response.cookies.set(OAUTH_COOKIE, oauth.cookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return response;
}
