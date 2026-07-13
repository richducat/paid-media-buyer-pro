import { NextResponse } from 'next/server';
import { z } from 'zod';
import { selectPlatformAccount } from '@/lib/runtime-store';

const Body = z.object({ platform: z.enum(['google', 'meta']), accountId: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid account selection.' }, { status: 400 });
  try {
    const connection = await selectPlatformAccount(parsed.data.platform, parsed.data.accountId);
    return NextResponse.json({ ok: true, selectedAccountId: connection.selectedAccountId });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to select account.' }, { status: 400 });
  }
}
