'use client';

import { useMemo, useState } from 'react';

export default function GeneratePage() {
  const sessionId = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    // Allow demo/testing flows even if session_id is missing from the URL.
    return url.searchParams.get('session_id') ?? 'demo';
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');

  const [productName, setProductName] = useState('');
  const [offer, setOffer] = useState('');
  const [audience, setAudience] = useState('');
  const [proof, setProof] = useState('');
  const [constraints, setConstraints] = useState('');
  const [cta, setCta] = useState('');

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setContent('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productName,
          offer,
          audience,
          proof,
          constraints,
          cta,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Failed');

      setContent(json.content);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-semibold">Paid Media Buyer Pro — Creative Pack</h1>
      <p className="mt-2 text-neutral-600">Session gate: {sessionId || '(missing)'}</p>

      <div className="mt-8 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Product name</span>
          <input className="rounded-md border p-2" value={productName} onChange={(e) => setProductName(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Offer</span>
          <input className="rounded-md border p-2" value={offer} onChange={(e) => setOffer(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Audience</span>
          <input className="rounded-md border p-2" value={audience} onChange={(e) => setAudience(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Proof / credibility (optional)</span>
          <input className="rounded-md border p-2" value={proof} onChange={(e) => setProof(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Constraints (optional)</span>
          <input className="rounded-md border p-2" value={constraints} onChange={(e) => setConstraints(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">CTA (optional)</span>
          <input className="rounded-md border p-2" value={cta} onChange={(e) => setCta(e.target.value)} />
        </label>

        <button
          className="mt-2 w-fit rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          disabled={loading || !sessionId || !productName || !offer || !audience}
          onClick={onGenerate}
        >
          {loading ? 'Generating…' : 'Generate Creative Pack'}
        </button>

        {error ? <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        {content ? (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Output</h2>
              <button
                className="rounded-md border px-3 py-1 text-sm"
                onClick={() => navigator.clipboard.writeText(content)}
              >
                Copy
              </button>
            </div>
            <textarea className="h-[520px] w-full rounded-md border p-3 font-mono text-sm" value={content} readOnly />
          </div>
        ) : null}
      </div>
    </main>
  );
}
