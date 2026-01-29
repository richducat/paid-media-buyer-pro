# Paid Media Buyer Pro (Paid Creative Pack)

One-time purchase → gated generator that produces a full “Creative Pack” (hooks, UGC scripts, copy variants).

## Local setup

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Then open: http://localhost:3000

## Stripe setup (Richard runs this)

1) In Stripe dashboard (Live mode): create **2 Prices** for the same Product:
   - $49 one-time
   - $29 one-time (limited-time)

2) Copy the two price IDs into `.env.local`:
   - `STRIPE_PRICE_ID_49`
   - `STRIPE_PRICE_ID_29`

3) Choose active price:
   - `STRIPE_ACTIVE_PRICE=29` (limited time)
   - later flip to `49`

4) Add `STRIPE_SECRET_KEY` from your Stripe account.

## Webhook (optional but recommended)

This app currently gates access by retrieving the Checkout Session on `/success` and `/api/generate`. You *can* run without webhooks.

If you want webhooks later:
- add `/api/stripe/webhook` route
- set `STRIPE_WEBHOOK_SECRET`

## OpenAI

Set `OPENAI_API_KEY` to enable generation.

## Deploy

Fast path: Vercel → import GitHub repo → set env vars → deploy.

