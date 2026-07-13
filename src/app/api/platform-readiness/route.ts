import { NextResponse } from 'next/server';
import { getConnection, type Platform } from '@/lib/runtime-store';

export const dynamic = 'force-dynamic';

async function platform(config: {
  platform: Platform;
  required: string[];
  connectPath: string;
}) {
  const missing = config.required.filter((key) => !process.env[key]);
  const connection = missing.length === 0 ? await getConnection(config.platform) : null;
  return {
    configured: missing.length === 0,
    connected: Boolean(connection),
    missing,
    connectPath: config.connectPath,
    connectedAt: connection?.connectedAt,
    accounts: connection?.accounts || [],
    selectedAccountId: connection?.selectedAccountId,
  };
}

export async function GET() {
  const google = await platform({
    platform: 'google',
    required: ['GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'TOKEN_ENCRYPTION_KEY'],
    connectPath: '/api/oauth/google',
  });
  const meta = await platform({
    platform: 'meta',
    required: ['META_APP_ID', 'META_APP_SECRET', 'TOKEN_ENCRYPTION_KEY'],
    connectPath: '/api/oauth/meta',
  });

  return NextResponse.json({
    mode: google.connected || meta.connected ? 'live' : 'demo',
    google,
    meta,
  });
}
