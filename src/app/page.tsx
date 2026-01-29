'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const canceled = params?.get('canceled') === '1';

  async function onBuy() {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Checkout failed');
      window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="flex flex-col gap-8">
        <header>
          <div className="text-sm font-medium text-neutral-600">Paid Media Buyer Pro</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Instant Creative Packs that convert.</h1>
          <p className="mt-4 text-lg text-neutral-700">
            Enter your offer + audience. Get <span className="font-semibold">50 hooks</span>, <span className="font-semibold">20 UGC scripts</span>,
            and a complete set of ad copy variants in under a minute.
          </p>
        </header>

        <section className="rounded-xl border p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-2xl font-semibold">$29 limited time</div>
              <div className="text-sm text-neutral-600">Normally $49 • One-time payment • Includes promotion codes</div>
            </div>

            <div className="flex w-full flex-col gap-2 md:w-[420px]">
              <label className="text-sm font-medium">Email (optional — for receipt)</label>
              <input
                className="rounded-md border p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
              <button
                className="mt-2 rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                disabled={loading}
                onClick={onBuy}
              >
                {loading ? 'Redirecting…' : 'Get my Creative Pack'}
              </button>
              {canceled ? <p className="text-sm text-red-600">Checkout canceled.</p> : null}
            </div>
          </div>

          <ul className="mt-6 grid list-disc gap-2 pl-5 text-sm text-neutral-700">
            <li>Built for Meta + TikTok direct response</li>
            <li>Multiple angles: problem/solution, proof, objection handling, contrarian, urgency</li>
            <li>Designed to hand off to editors + UGC creators immediately</li>
          </ul>
        </section>

        <section className="grid gap-3">
          <h2 className="text-xl font-semibold">What you get</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="font-medium">50 hooks</div>
              <div className="text-sm text-neutral-600">Scroll-stoppers to test angles fast.</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">20 UGC scripts</div>
              <div className="text-sm text-neutral-600">15s/30s/45s versions + on-screen text.</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">Ad copy set</div>
              <div className="text-sm text-neutral-600">Primary text + headlines + overlays.</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="font-medium">Next tests</div>
              <div className="text-sm text-neutral-600">A concrete plan for the next 10 experiments.</div>
            </div>
          </div>
        </section>

        <footer className="text-xs text-neutral-500">
          Disclaimer: results depend on offer, funnel, and execution. No refunds for “didn’t run ads”.
        </footer>
      </div>
    </main>
  );
}
