import { z } from 'zod';

const EnvSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_ID_49: z.string().min(1),
  STRIPE_PRICE_ID_29: z.string().min(1),
  STRIPE_ACTIVE_PRICE: z.enum(['49', '29']).default('29'),
  // Optional: if not set, we derive from request origin (works on Vercel previews/prod).
  APP_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export function getEnv() {
  return EnvSchema.parse({
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    STRIPE_PRICE_ID_49: process.env.STRIPE_PRICE_ID_49,
    STRIPE_PRICE_ID_29: process.env.STRIPE_PRICE_ID_29,
    STRIPE_ACTIVE_PRICE: process.env.STRIPE_ACTIVE_PRICE,
    APP_URL: process.env.APP_URL || undefined,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
}
