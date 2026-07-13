import { NextRequest, NextResponse } from 'next/server';
import { encryptTokens, saveConnection } from '@/lib/runtime-store';
import { exchangeGoogleCode, listGoogleAccounts } from '@/lib/google-ads';
import { OAUTH_COOKIE, verifyOAuthState } from '@/lib/oauth-state';

export const dynamic = 'force-dynamic';

function dashboard(request: NextRequest, params: Record<string, string>) {
  const url = new URL('/dashboard', process.env.APP_URL || request.nextUrl.origin);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get('error');
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const verified = verifyOAuthState(request.cookies.get(OAUTH_COOKIE)?.value, state, 'google');
  if (error || !code || !verified?.verifier) {
    return NextResponse.redirect(dashboard(request, { connection_error: error || 'google_oauth_failed' }));
  }
  try {
    const tokens = await exchangeGoogleCode(code, verified.verifier);
    const accounts = await listGoogleAccounts(tokens);
    await saveConnection({
      platform: 'google',
      connectedAt: new Date().toISOString(),
      profile: {},
      accounts,
      selectedAccountId: accounts.length === 1 ? accounts[0].id : undefined,
      tokens: encryptTokens(tokens),
    });
    const response = NextResponse.redirect(dashboard(request, { connected: 'google' }));
    response.cookies.delete(OAUTH_COOKIE);
    return response;
  } catch (callbackError) {
    console.error('Google OAuth callback failed:', callbackError);
    return NextResponse.redirect(dashboard(request, { connection_error: 'google_callback_failed' }));
  }
}
