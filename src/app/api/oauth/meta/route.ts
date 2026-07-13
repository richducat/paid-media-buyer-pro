import { NextResponse } from 'next/server';
import { createOAuthState, OAUTH_COOKIE } from '@/lib/oauth-state';
import { metaRedirectUri } from '@/lib/meta-ads';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.META_APP_ID || !process.env.META_APP_SECRET || !process.env.TOKEN_ENCRYPTION_KEY) {
    return NextResponse.redirect(new URL('/dashboard?connection_error=meta_not_configured', process.env.APP_URL || 'https://paidmediapro.eb28.co'));
  }
  const oauth = createOAuthState('meta');
  const version = process.env.META_GRAPH_VERSION || 'v23.0';
  const url = new URL(`https://www.facebook.com/${version}/dialog/oauth`);
  url.search = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    redirect_uri: metaRedirectUri(),
    response_type: 'code',
    scope: 'ads_read,business_management',
    state: oauth.value.state,
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
