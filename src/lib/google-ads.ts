import { createHash, randomBytes } from 'node:crypto';
import { decryptTokens, type PlatformAccount, type StoredConnection } from '@/lib/runtime-store';

type GoogleTokens = {
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  obtainedAt: number;
};

export type NormalizedCampaign = {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta Ads';
  status: string;
  spend: number;
  results: number;
  revenue: number;
  clicks: number;
  impressions: number;
};

export function googlePkce() {
  const verifier = randomBytes(48).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

export function googleRedirectUri() {
  return `${process.env.APP_URL || 'https://paidmediapro.eb28.co'}/api/oauth/google/callback`;
}

export async function exchangeGoogleCode(code: string, verifier: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      redirect_uri: googleRedirectUri(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
    }),
    cache: 'no-store',
  });
  const body = await response.json() as Record<string, unknown>;
  if (!response.ok || typeof body.access_token !== 'string') {
    throw new Error(typeof body.error_description === 'string' ? body.error_description : 'Google token exchange failed.');
  }
  return { ...(body as Omit<GoogleTokens, 'obtainedAt'>), obtainedAt: Date.now() } as GoogleTokens;
}

export async function refreshGoogleTokens(connection: StoredConnection) {
  const tokens = decryptTokens<GoogleTokens>(connection.tokens);
  if (tokens.expires_in && Date.now() < tokens.obtainedAt + (tokens.expires_in - 300) * 1000) return tokens;
  if (!tokens.refresh_token) throw new Error('Google did not return an offline refresh token. Reconnect Google Ads.');
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
      refresh_token: tokens.refresh_token,
      grant_type: 'refresh_token',
    }),
    cache: 'no-store',
  });
  const body = await response.json() as Record<string, unknown>;
  if (!response.ok || typeof body.access_token !== 'string') throw new Error('Google access token refresh failed.');
  return { ...tokens, ...body, refresh_token: tokens.refresh_token, obtainedAt: Date.now() } as GoogleTokens;
}

function googleHeaders(accessToken: string, loginCustomerId?: string) {
  return {
    authorization: `Bearer ${accessToken}`,
    'developer-token': process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    ...(loginCustomerId ? { 'login-customer-id': loginCustomerId.replaceAll('-', '') } : {}),
  };
}

export async function listGoogleAccounts(tokens: GoogleTokens): Promise<PlatformAccount[]> {
  const version = process.env.GOOGLE_ADS_API_VERSION || 'v24';
  const response = await fetch(`https://googleads.googleapis.com/${version}/customers:listAccessibleCustomers`, {
    headers: googleHeaders(tokens.access_token),
    cache: 'no-store',
  });
  const body = await response.json() as { resourceNames?: string[]; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || 'Google Ads account discovery failed.');
  return (body.resourceNames || []).map((resourceName) => {
    const id = resourceName.replace('customers/', '');
    return { id, name: `Google Ads ${id}` };
  });
}

export async function getGoogleCampaigns(connection: StoredConnection): Promise<NormalizedCampaign[]> {
  const accountId = connection.selectedAccountId || connection.accounts[0]?.id;
  if (!accountId) return [];
  const tokens = await refreshGoogleTokens(connection);
  const version = process.env.GOOGLE_ADS_API_VERSION || 'v24';
  const query = `SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, metrics.cost_micros, metrics.conversions, metrics.conversions_value, metrics.clicks, metrics.impressions FROM campaign WHERE segments.date DURING LAST_30_DAYS ORDER BY metrics.cost_micros DESC LIMIT 100`;
  const response = await fetch(`https://googleads.googleapis.com/${version}/customers/${accountId}/googleAds:searchStream`, {
    method: 'POST',
    headers: {
      ...googleHeaders(tokens.access_token, process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID),
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  });
  const body = await response.json() as Array<{ results?: Array<Record<string, unknown>> }> | { error?: { message?: string } };
  if (!response.ok || !Array.isArray(body)) {
    throw new Error(!Array.isArray(body) ? body.error?.message || 'Google Ads reporting failed.' : 'Google Ads reporting failed.');
  }
  return body.flatMap((batch) => batch.results || []).map((row) => {
    const campaign = row.campaign as { id?: string; name?: string; status?: string } | undefined;
    const metrics = row.metrics as Record<string, string | number> | undefined;
    return {
      id: campaign?.id || 'unknown',
      name: campaign?.name || 'Unnamed campaign',
      platform: 'Google Ads' as const,
      status: campaign?.status || 'UNKNOWN',
      spend: Number(metrics?.costMicros || 0) / 1_000_000,
      results: Number(metrics?.conversions || 0),
      revenue: Number(metrics?.conversionsValue || 0),
      clicks: Number(metrics?.clicks || 0),
      impressions: Number(metrics?.impressions || 0),
    };
  });
}
