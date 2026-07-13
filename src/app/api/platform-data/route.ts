import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/runtime-store';
import { getGoogleCampaigns, type NormalizedCampaign } from '@/lib/google-ads';
import { getMetaCampaigns } from '@/lib/meta-ads';

export const dynamic = 'force-dynamic';

function summary(campaigns: NormalizedCampaign[]) {
  const spend = campaigns.reduce((total, campaign) => total + campaign.spend, 0);
  const results = campaigns.reduce((total, campaign) => total + campaign.results, 0);
  const revenue = campaigns.reduce((total, campaign) => total + campaign.revenue, 0);
  const clicks = campaigns.reduce((total, campaign) => total + campaign.clicks, 0);
  const impressions = campaigns.reduce((total, campaign) => total + campaign.impressions, 0);
  return {
    spend,
    results,
    revenue,
    clicks,
    impressions,
    costPerResult: results > 0 ? spend / results : null,
    roas: spend > 0 ? revenue / spend : null,
  };
}

export async function GET() {
  const [google, meta] = await Promise.all([getConnection('google'), getConnection('meta')]);
  const errors: Partial<Record<'google' | 'meta', string>> = {};
  const campaigns: NormalizedCampaign[] = [];
  if (google?.selectedAccountId || google?.accounts.length === 1) {
    try { campaigns.push(...await getGoogleCampaigns(google)); } catch (error) { errors.google = error instanceof Error ? error.message : 'Google reporting failed.'; }
  }
  if (meta?.selectedAccountId || meta?.accounts.length === 1) {
    try { campaigns.push(...await getMetaCampaigns(meta)); } catch (error) { errors.meta = error instanceof Error ? error.message : 'Meta reporting failed.'; }
  }
  return NextResponse.json({
    live: Boolean(google || meta),
    fetchedAt: new Date().toISOString(),
    summary: summary(campaigns),
    campaigns,
    errors,
  });
}
