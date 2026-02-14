import { NextResponse } from 'next/server';
import { z } from 'zod';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { getEnv } from '@/lib/env';

const BodySchema = z.object({
  email: z.string().email().optional(),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const env = getEnv();
  const priceId = env.STRIPE_ACTIVE_PRICE === '29' ? env.STRIPE_PRICE_ID_29 : env.STRIPE_PRICE_ID_49;

  const stripe = getStripe();

  const h = await headers();
  const origin = h.get('origin');
  const xfProto = h.get('x-forwarded-proto');
  const xfHost = h.get('x-forwarded-host');
  const derivedBaseUrl = origin || (xfProto && xfHost ? `${xfProto}://${xfHost}` : null);
  const baseUrl = env.APP_URL || derivedBaseUrl;
  if (!baseUrl) {
    return NextResponse.json({ error: 'Unable to determine APP_URL (missing APP_URL and request origin)' }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: parsed.data.email,
    allow_promotion_codes: true,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
