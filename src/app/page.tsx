'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const canceled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('canceled') === '1';
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

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
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-slate-950/90 backdrop-blur-md border-slate-800 py-4' : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="#top" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className="bg-emerald-500 p-1.5 rounded-lg">
              <TrendingUp className="w-5 h-5 text-slate-950" />
            </div>
            <span>
              MediaBuyer<span className="text-emerald-500">Pro</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#included" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              What you get
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              FAQ
            </a>
            <button
              onClick={onBuy}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              Get Instant Access
            </button>
          </div>

          {/* Mobile Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-slate-300" aria-label="Menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-4 flex flex-col gap-4 md:hidden">
            <a href="#how" onClick={toggleMenu} className="text-slate-300 py-2">
              How it works
            </a>
            <a href="#included" onClick={toggleMenu} className="text-slate-300 py-2">
              What you get
            </a>
            <a href="#faq" onClick={toggleMenu} className="text-slate-300 py-2">
              FAQ
            </a>
            <button onClick={() => { toggleMenu(); void onBuy(); }} className="bg-emerald-500 text-slate-950 text-center py-3 rounded-lg font-bold">
              Get Instant Access
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="top" className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            One-time purchase • Instant access
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Stop staring at a blank page.
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Generate ad-ready Creative Packs in minutes.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter your offer + audience once. Get hooks, UGC scripts, and copy variants you can test today.
            Built for Meta + TikTok direct response.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onBuy}
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
            >
              {loading ? 'Redirecting…' : 'Get Instant Access'} <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#included"
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 hover:border-slate-600 text-white px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2"
            >
              See what you get
            </a>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Chip icon={<Zap className="w-4 h-4" />} label="Instant delivery" />
              <Chip icon={<ShieldCheck className="w-4 h-4" />} label="One-time purchase" />
              <Chip icon={<Sparkles className="w-4 h-4" />} label="Built for DR ads" />
            </div>
            {canceled ? <div className="text-red-300">Checkout canceled.</div> : null}
          </div>

          {/* Purchase card */}
          <div className="mx-auto mt-12 max-w-3xl text-left">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">$29 limited time</div>
                  <div className="text-sm text-slate-400">Normally $49 • One-time payment • Promotion codes supported</div>
                </div>

                <div className="flex w-full flex-col gap-2 md:w-[420px]">
                  <label className="text-sm font-medium text-slate-200">Email (optional — for receipt)</label>
                  <input
                    className="rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-50 placeholder:text-slate-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                  <button
                    className="mt-2 rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-50"
                    disabled={loading}
                    onClick={onBuy}
                  >
                    {loading ? 'Redirecting…' : 'Get my Creative Pack'}
                  </button>
                </div>
              </div>

              <ul className="mt-6 grid gap-2 text-sm text-slate-300">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  Multiple angles: problem/solution, proof, objection handling, contrarian, urgency
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  Designed to hand off to editors + UGC creators immediately
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" />
                  Output is copy/paste ready and structured so it’s usable
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 bg-slate-900 border-y border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-slate-400">Three steps. No fluff.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              icon={<Target className="w-8 h-8 text-emerald-400" />}
              title="1) Describe the offer"
              desc="Drop in your product name, offer, audience, and any proof. That’s it."
            />
            <Card
              icon={<FileText className="w-8 h-8 text-blue-400" />}
              title="2) Generate a pack"
              desc="Get hooks, UGC scripts, headlines, overlays, and next tests in one output."
            />
            <Card
              icon={<Sparkles className="w-8 h-8 text-purple-400" />}
              title="3) Launch tests"
              desc="Paste into your briefs, creators, and ads manager. Start testing variations today."
            />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section id="included" className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What you get</h2>
            <p className="text-slate-400">A complete Creative Pack you can actually use.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Included title="50 hooks" desc="Scroll-stoppers to test angles fast." />
            <Included title="20 UGC scripts" desc="15s/30s/45s versions + on-screen text." />
            <Included title="Ad copy set" desc="Primary text + headlines + overlays." />
            <Included title="Next tests" desc="A concrete plan for the next 10 experiments." />
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={onBuy}
              disabled={loading}
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-lg px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/50"
            >
              {loading ? 'Redirecting…' : 'Get Instant Access'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <p className="mt-3 text-sm text-slate-500">One-time purchase • Instant delivery</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">FAQ</h2>
            <p className="text-slate-400">Quick answers to the only questions that matter.</p>
          </div>

          <div className="max-w-3xl mx-auto grid gap-4">
            <Faq q="What am I buying?" a="A one-time purchase Creative Pack generator. You enter your offer + audience and it outputs a structured pack (hooks, scripts, copy variants, and next tests)." />
            <Faq q="Is this a subscription?" a="No — one-time purchase." />
            <Faq q="How do I get it?" a="Instant access after checkout. You’ll land on a success page and can generate immediately." />
            <Faq q="Does it work for my niche?" a="Yes for most niches. The more specific your offer/audience/proof, the better the output." />
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={onBuy}
              disabled={loading}
              className="inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-lg px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/50"
            >
              {loading ? 'Redirecting…' : 'Get Instant Access'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <footer className="mt-12 text-center text-xs text-slate-500">
            Disclaimer: results depend on offer, funnel, and execution. No refunds for “didn’t run ads”.
          </footer>
        </div>
      </section>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">
      <span className="text-emerald-400">{icon}</span>
      {label}
    </span>
  );
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-slate-800/30 p-8 rounded-2xl border border-slate-800 hover:bg-slate-800/50 transition-colors group">
      <div className="bg-slate-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

function Included({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-emerald-500/15 p-2 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-lg font-bold text-white">{title}</div>
      </div>
      <div className="text-sm text-slate-400">{desc}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
      <div className="font-bold text-white">{q}</div>
      <div className="mt-2 text-sm text-slate-400 leading-relaxed">{a}</div>
    </div>
  );
}
