import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getStripe } from '@/lib/stripe';
import OpenAI from 'openai';

const BodySchema = z.object({
  sessionId: z.string().min(1),
  offer: z.string().min(1),
  audience: z.string().min(1),
  productName: z.string().min(1),
  proof: z.string().optional(),
  constraints: z.string().optional(),
  cta: z.string().optional(),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const demoMode = process.env.DEMO_MODE === 'true';

  if (!demoMode) {
    // Gate by paid Stripe session
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(parsed.data.sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (demoMode) {
      const demoContent = `# Masterclass Expert Strategy — DEMO MODE\n\n## 1) High-Intent Keywords\n- ${parsed.data.productName} near me [Exact]\n- Best ${parsed.data.productName} for ${parsed.data.audience} [Phrase]\n\n## 2) The Negative Keyword Shield\n- free, jobs, manual, pdf, cheap, discount\n\n## 3) 50 Scroll-Stopper Hooks\n1) The one thing ${parsed.data.audience} get wrong about ${parsed.data.productName}...\n\n(Enable OPENAI_API_KEY for the full Masterclass pack.)`;
      return NextResponse.json({ content: demoContent, demo: true });
    }
    return NextResponse.json(
      { error: 'OPENAI_API_KEY not set.' },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `You are a World-Class Paid Media Buyer and Creative Strategist with "Masterclass" level skills.
Your task is to generate a comprehensive "Expert Ad Buying Strategy & Creative Pack" that allows someone with zero experience to launch like a pro.

Inputs:
- Business/Product Name: ${parsed.data.productName}
- Main Offer: ${parsed.data.offer}
- Target Audience: ${parsed.data.audience}
- Proof / Credibility: ${parsed.data.proof ?? 'N/A'}
- Constraints: ${parsed.data.constraints ?? 'N/A'}
- Call to Action (CTA): ${parsed.data.cta ?? 'N/A'}

Strategy & Creative Output Requirements (Markdown format):

# 1. THE "MASTERCLASS" STRATEGY
### A. The Launch Structure
Describe the specific campaign structure (e.g., CBO vs ABO, Broad vs Interested) optimal for this business.
### B. High-Intent Keywords (Google Search)
Provide 20+ expert-level keywords with match type recommendations (e.g., "Service + City [Exact]", "How to fix [Problem] [Phrase]").
### C. The Negative Keyword Shield
List 30+ keywords to exclude immediately to prevent wasted spend (e.g., "free", "jobs", "manual").
### D. Ad Extensions Strategy
Define Sitelinks, Callouts, and Structured Snippets that will increase CTR.

# 2. THE CREATIVE PACK (META/TIKTOK/GOOGLE)
### A. 50 "Scroll-Stopper" Hooks
Numbered list. Focus on varied angles: Contrarian, Curiosity, Proof-heavy, Problem-first (PAS), and Result-first.
### B. 10 UGC Expert Scripts
For each script provide:
- **Hook (0-3s)**: High-energy opening.
- **Body (PAS Framework)**: Define the Problem, Agitate it, then show the Solution.
- **CTA**: Direct and urgent.
- **On-Screen Text**: Specific captions to overlay.
### C. 10 High-Conversion Primary Texts
Vary between short punchy copy and long-form story-driven copy using the AIDA framework.
### D. 10 "Click-Magnet" Headlines
Optimized for high CTR.

# 3. THE "PRO" TEST PLAN
Outline the first 4 weeks of testing: what creative angles to test, which audiences to pivot to, and how to scale winning ads.

Tone: Professional, authoritative, yet simple to follow. Deliver ONLY the highest quality, conversion-focused content.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a senior media buyer. You write high-converting, expert-level ad strategy and copy.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content ?? '';

  return NextResponse.json({ content });
}
