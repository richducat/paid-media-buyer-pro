import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function platform(config: {
  required: string[];
  connectedFlag: string;
  connectPath: string;
}) {
  const missing = config.required.filter((key) => !process.env[key]);
  return {
    configured: missing.length === 0,
    connected: process.env[config.connectedFlag] === 'true' && missing.length === 0,
    missing,
    connectPath: config.connectPath,
  };
}

export async function GET() {
  const google = platform({
    required: ['GOOGLE_ADS_CLIENT_ID', 'GOOGLE_ADS_CLIENT_SECRET', 'GOOGLE_ADS_DEVELOPER_TOKEN', 'TOKEN_ENCRYPTION_KEY'],
    connectedFlag: 'GOOGLE_ADS_CONNECTED',
    connectPath: '/api/oauth/google',
  });
  const meta = platform({
    required: ['META_APP_ID', 'META_APP_SECRET', 'TOKEN_ENCRYPTION_KEY'],
    connectedFlag: 'META_ADS_CONNECTED',
    connectPath: '/api/oauth/meta',
  });

  return NextResponse.json({
    mode: google.connected || meta.connected ? 'live' : 'demo',
    google,
    meta,
  });
}
