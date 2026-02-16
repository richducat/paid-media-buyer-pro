import { NextResponse } from 'next/server';

const SHEET_ID = process.env.LEADS_SHEET_ID;
const GOOGLE_APPS_SCRIPT_URL = process.env.LEADS_APPS_SCRIPT_URL;

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

// We support two backends:
// 1) Preferred: Google Apps Script Web App URL (simple + no service account)
// 2) Fallback: not implemented here (would require server-side Google auth)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      template,
      businessName,
      website,
      city,
      radiusMiles,
      phone,
      services,
      hours,
      promos,
      email,
    } = body ?? {};

    if (!email || typeof email !== 'string') return badRequest('Email is required');

    const row = {
      created_at: new Date().toISOString(),
      template: String(template ?? ''),
      business_name: String(businessName ?? ''),
      website: String(website ?? ''),
      city: String(city ?? ''),
      radius_miles: Number(radiusMiles ?? 0),
      phone: String(phone ?? ''),
      services: String(services ?? ''),
      hours: String(hours ?? ''),
      promos: String(promos ?? ''),
      email: String(email ?? ''),
    };

    // For now we wire to Apps Script because it’s the quickest way to append rows
    // without managing Google credentials inside Vercel.
    if (!GOOGLE_APPS_SCRIPT_URL) {
      return badRequest(
        'Lead capture backend not configured (missing LEADS_APPS_SCRIPT_URL).'
      );
    }

    const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sheetId: SHEET_ID, row }),
      // Ensure no caching/proxy weirdness
      cache: 'no-store',
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `Apps Script error: ${text}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, result: text });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
