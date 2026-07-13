import { decryptTokens, type PlatformAccount, type StoredConnection } from '@/lib/runtime-store';
import type { NormalizedCampaign } from '@/lib/google-ads';

type MetaTokens = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  obtainedAt: number;
};

function version() {
  return process.env.META_GRAPH_VERSION || 'v23.0';
}

export function metaRedirectUri() {
  return `${process.env.APP_URL || 'https://paidmediapro.eb28.co'}/api/oauth/meta/callback`;
}

export async function exchangeMetaCode(code: string) {
  const tokenUrl = new URL(`https://graph.facebook.com/${version()}/oauth/access_token`);
  tokenUrl.search = new URLSearchParams({
    client_id: process.env.META_APP_ID || '',
    client_secret: process.env.META_APP_SECRET || '',
    redirect_uri: metaRedirectUri(),
    code,
  }).toString();
  const shortResponse = await fetch(tokenUrl, { cache: 'no-store' });
  const shortBody = await shortResponse.json() as Record<string, unknown>;
  if (!shortResponse.ok || typeof shortBody.access_token !== 'string') throw new Error('Meta token exchange failed.');

  const longUrl = new URL(`https://graph.facebook.com/${version()}/oauth/access_token`);
  longUrl.search = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: process.env.META_APP_ID || '',
    client_secret: process.env.META_APP_SECRET || '',
    fb_exchange_token: shortBody.access_token,
  }).toString();
  const longResponse = await fetch(longUrl, { cache: 'no-store' });
  const longBody = await longResponse.json() as Record<string, unknown>;
  const finalBody = longResponse.ok && typeof longBody.access_token === 'string' ? longBody : shortBody;
  return { ...(finalBody as Omit<MetaTokens, 'obtainedAt'>), obtainedAt: Date.now() } as MetaTokens;
}

export async function getMetaProfile(tokens: MetaTokens) {
  const url = new URL(`https://graph.facebook.com/${version()}/me`);
  url.search = new URLSearchParams({ fields: 'id,name,email', access_token: tokens.access_token }).toString();
  const response = await fetch(url, { cache: 'no-store' });
  const body = await response.json() as { id?: string; name?: string; email?: string; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || 'Meta profile lookup failed.');
  return body;
}

export async function listMetaAccounts(tokens: MetaTokens): Promise<PlatformAccount[]> {
  const url = new URL(`https://graph.facebook.com/${version()}/me/adaccounts`);
  url.search = new URLSearchParams({
    fields: 'id,account_id,name,currency,timezone_name,account_status',
    limit: '100',
    access_token: tokens.access_token,
  }).toString();
  const response = await fetch(url, { cache: 'no-store' });
  const body = await response.json() as { data?: Array<{ id: string; account_id?: string; name?: string; currency?: string; timezone_name?: string }>; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || 'Meta ad account discovery failed.');
  return (body.data || []).map((account) => ({
    id: account.id,
    name: account.name || `Meta Ads ${account.account_id || account.id}`,
    currency: account.currency,
    timezone: account.timezone_name,
  }));
}

function actionValue(actions: Array<{ action_type?: string; value?: string }> | undefined) {
  if (!actions) return 0;
  const preferred = ['purchase', 'lead', 'onsite_conversion.lead_grouped', 'offsite_conversion.fb_pixel_purchase'];
  for (const type of preferred) {
    const match = actions.find((action) => action.action_type === type);
    if (match) return Number(match.value || 0);
  }
  return 0;
}

export async function getMetaCampaigns(connection: StoredConnection): Promise<NormalizedCampaign[]> {
  const accountId = connection.selectedAccountId || connection.accounts[0]?.id;
  if (!accountId) return [];
  const tokens = decryptTokens<MetaTokens>(connection.tokens);
  const url = new URL(`https://graph.facebook.com/${version()}/${accountId}/insights`);
  url.search = new URLSearchParams({
    fields: 'campaign_id,campaign_name,spend,impressions,clicks,actions,action_values',
    level: 'campaign',
    date_preset: 'last_30d',
    limit: '100',
    access_token: tokens.access_token,
  }).toString();
  const response = await fetch(url, { cache: 'no-store' });
  const body = await response.json() as { data?: Array<Record<string, unknown>>; error?: { message?: string } };
  if (!response.ok) throw new Error(body.error?.message || 'Meta Ads reporting failed.');
  return (body.data || []).map((row) => ({
    id: String(row.campaign_id || 'unknown'),
    name: String(row.campaign_name || 'Unnamed campaign'),
    platform: 'Meta Ads' as const,
    status: 'ACTIVE',
    spend: Number(row.spend || 0),
    results: actionValue(row.actions as Array<{ action_type?: string; value?: string }> | undefined),
    revenue: actionValue(row.action_values as Array<{ action_type?: string; value?: string }> | undefined),
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
  }));
}
