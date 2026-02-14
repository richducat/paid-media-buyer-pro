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
      const demoContent = `# Demo Creative Pack\n\n## 1) 50 Hooks\n1) ${parsed.data.productName}: the one change that made ${parsed.data.audience} finally stick with it\n2) If you're ${parsed.data.audience}, stop doing this before you waste another month\n3) The "3-second" test for whether ${parsed.data.offer} will work for you\n\n## 2) 20 UGC Scripts\n### Script 1 — "Before/After"\n- 15s: Quick problem → quick proof → CTA\n- 30s: Add objection handling + proof\n- 45s: Add story + specificity\n- On-screen text: "I tried everything until this…"\n\n## 3) 10 Primary Texts\n- ${parsed.data.offer} without the usual headaches.\n\n## 4) 10 Headlines\n- The fastest way to get ${parsed.data.offer}\n\n## 5) 10 Thumbnail/Overlay ideas\n- "This fixed it"\n\n## 6) 10 Next Tests\n- Test 3 angles: proof, contrarian, objection-buster\n\n(Enable OPENAI_API_KEY to generate the full pack.)`;
      return NextResponse.json({ content: demoContent, demo: true });
    }
    return NextResponse.json(
      {
        error:
          'OPENAI_API_KEY not set. Add it to your environment to enable generation (or wire in another model provider).',
      },
      { status: 500 },
    );
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `You are a senior paid media buyer and creative strategist.

Generate a “Creative Pack” for Meta/TikTok.

Inputs:
- Product name: ${parsed.data.productName}
- Offer: ${parsed.data.offer}
- Audience: ${parsed.data.audience}
- Proof / credibility: ${parsed.data.proof ?? 'N/A'}
- Constraints: ${parsed.data.constraints ?? 'N/A'}
- CTA: ${parsed.data.cta ?? 'N/A'}

Output MUST be in markdown with these sections:
1) 50 Hooks (numbered)
2) 20 UGC Scripts (each: Title, 15s version, 30s version, 45s version, On-screen text)
3) 10 Primary Texts
4) 10 Headlines
5) 10 Thumbnail/Overlay Text ideas
6) 10 Next Tests (audience/angle/creative format ideas)

Make it punchy, varied, and practical for direct response.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      { role: 'system', content: 'You write direct-response ad creative that converts.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.8,
  });

  const content = completion.choices[0]?.message?.content ?? '';

  return NextResponse.json({ content });
}
