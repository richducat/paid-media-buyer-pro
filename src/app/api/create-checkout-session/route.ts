import { NextResponse } from 'next/server';
import { z } from 'zod';
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
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: parsed.data.email,
    allow_promotion_codes: true,
    success_url: `${env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
