import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

const ScrapeSchema = z.object({
  url: z.string().url(),
});

export async function POST(req: Request) {
  try {
    const { url } = ScrapeSchema.parse(await req.json());
    
    // Fetch the URL content (simple fetch)
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the website' }, { status: 400 });
    }
    
    let html = await response.text();
    // Rudimentary cleanup of HTML to save tokens
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
              .substring(0, 15000); // Limit to ~15k chars for basic extraction

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        name: "Demo Business", 
        services: "Service A, Service B", 
        audience: "Specific Target", 
        usp: "Quality and Speed" 
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert market analyst. Extract business details from the provided HTML to help set up Google Ads.' 
        },
        { 
          role: 'user', 
          content: `Extract the following details in JSON format (name, services, audience, usp) from this website content:\n\n${html}` 
        },
      ],
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Scrape error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
