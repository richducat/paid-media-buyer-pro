import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

export const maxDuration = 60;

const ScrapeSchema = z.object({
  url: z.string().url(),
});

const PRIVATE_HOST_PATTERN =
  /^(localhost|127\.|10\.|0\.0\.0\.0|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$)/i;

export async function POST(req: Request) {
  const parsed = ScrapeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid website URL (including https://).' }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(parsed.data.url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL.' }, { status: 400 });
  }

  if (!['http:', 'https:'].includes(target.protocol) || PRIVATE_HOST_PATTERN.test(target.hostname)) {
    return NextResponse.json({ error: 'Only public http(s) websites are supported.' }, { status: 400 });
  }

  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(10_000),
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; MediaBuyerPro/1.0)' },
      redirect: 'follow',
    });
    if (!response.ok) {
      return NextResponse.json({ error: `The website responded with an error (${response.status}). Check the URL and try again.` }, { status: 400 });
    }

    let html = await response.text();
    // Rudimentary cleanup of HTML to save tokens
    html = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .substring(0, 15000);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        name: 'Demo Business',
        services: 'Service A, Service B',
        audience: 'Specific Target',
        usp: 'Quality and Speed',
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert market analyst. Extract business details from the provided HTML to help set up paid ad campaigns. Respond with JSON containing exactly these string keys: name, services, audience, usp.',
        },
        {
          role: 'user',
          content: `Extract the following details in JSON format (name, services, audience, usp) from this website content:\n\n${html}`,
        },
      ],
      response_format: { type: 'json_object' },
    });

    const data = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    return NextResponse.json({
      name: typeof data.name === 'string' ? data.name : '',
      services: typeof data.services === 'string' ? data.services : '',
      audience: typeof data.audience === 'string' ? data.audience : '',
      usp: typeof data.usp === 'string' ? data.usp : '',
    });
  } catch (error) {
    console.error('Scrape error:', error);
    const timedOut = error instanceof Error && error.name === 'TimeoutError';
    return NextResponse.json(
      { error: timedOut ? 'The website took too long to respond — try again or fill the fields manually.' : 'We could not analyze that website — fill the fields manually.' },
      { status: timedOut ? 504 : 500 },
    );
  }
}
