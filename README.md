# MediaBuyerPro (Paid Creative Pack)

One-time purchase → gated AI generator that produces a full **Creative Pack**: scroll-stopper hooks, UGC video scripts, ad copy variants, keyword lists, and a 4-week launch/test plan — plus live ad mockups for Meta, Instagram, and Google.

## Product flow

1. **Landing page** (`/`) — sells the pack, Stripe checkout ($29 limited / $49 normal).
2. **Ads Wizard** (`/wizard`) — free 3-step preview funnel (choose objective → intake with AI website auto-fill → draft strategy). Finalizing captures the lead and hands off to Stripe checkout.
3. **Success** (`/success`) — verifies payment and links into the generator.
4. **Generator** (`/generate`) — the paid product. Full campaign inputs → AI strategy pack rendered as styled markdown with copy + download (.md), plus platform ad previews.

Legal pages at `/terms` and `/privacy`.

## Local setup

```bash
cp .env.example .env.local   # or create .env.local with the vars below
pnpm install
pnpm dev
```

Open http://localhost:3000

### Demo mode (no keys needed)

Set `DEMO_MODE=true` to exercise the entire flow without Stripe or OpenAI:
checkout redirects straight to `/success?session_id=demo`, and the generator returns a sample pack.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DEMO_MODE` | no | `true` bypasses payments + AI for testing the full UX |
| `STRIPE_SECRET_KEY` | prod | Stripe API key (Live mode) |
| `STRIPE_PRICE_ID_49` | prod | One-time $49 price |
| `STRIPE_PRICE_ID_29` | prod | One-time $29 (limited-time) price |
| `STRIPE_ACTIVE_PRICE` | no | `29` (default) or `49` — which price checkout uses |
| `OPENAI_API_KEY` | prod | Enables real generation + website auto-fill |
| `OPENAI_MODEL` | no | Override the model (default `gpt-4o`) |
| `APP_URL` | no | Canonical URL; otherwise derived from request origin |
| `LEADS_APPS_SCRIPT_URL` | no | Google Apps Script web-app URL for lead capture |
| `LEADS_SHEET_ID` | no | Target Google Sheet for leads |

## Stripe setup

1. In Stripe dashboard (Live mode) create **2 Prices** on the same Product: $49 and $29 one-time.
2. Copy the price IDs into `STRIPE_PRICE_ID_49` / `STRIPE_PRICE_ID_29`.
3. Set `STRIPE_ACTIVE_PRICE=29` for the launch promo; flip to `49` later.
4. Add `STRIPE_SECRET_KEY`.

Access is gated by retrieving the Checkout Session on `/success` and `/api/generate` — no webhook required. If you add webhooks later, create `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.

## Quality checks

```bash
npx tsc --noEmit     # type-check
npx eslint src       # lint
pnpm build           # production build
```

(`next build` intentionally skips type-checking to stay within Vercel build memory — run `tsc` separately.)

## Deploy

Vercel → import GitHub repo → set env vars → deploy.
