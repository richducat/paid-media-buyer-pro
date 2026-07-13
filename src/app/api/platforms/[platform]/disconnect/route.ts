import { NextResponse } from 'next/server';
import { deleteConnection, type Platform } from '@/lib/runtime-store';

export async function POST(_: Request, context: { params: Promise<{ platform: string }> }) {
  const { platform } = await context.params;
  if (platform !== 'google' && platform !== 'meta') return NextResponse.json({ error: 'Unknown platform.' }, { status: 404 });
  await deleteConnection(platform as Platform);
  return NextResponse.json({ ok: true });
}
