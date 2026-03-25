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
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 border-b ${
          scrolled ? 'bg-[#030712]/80 backdrop-blur-xl border-white/5 py-4 shadow-2xl shadow-cyan-900/10' : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="#top" className="flex items-center gap-3 font-bold text-xl tracking-tighter group">
            <div className="premium-gradient p-2 rounded-xl group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span>
              MediaBuyer<span className="text-cyan-400">Pro</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">
              How it works
            </a>
            <a href="#included" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">
              What you get
            </a>
            <a href="#faq" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">
              FAQ
            </a>
            <button
              onClick={onBuy}
              className="premium-gradient text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover-glow border border-white/10"
            >
              Get Instant Access
            </button>
          </div>

          {/* Mobile Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-slate-300 focus:outline-none" aria-label="Menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full glass-card border-b border-white/5 p-4 flex flex-col gap-4 md:hidden">
            <a href="#how" onClick={toggleMenu} className="text-slate-300 font-semibold py-2">
              How it works
            </a>
            <a href="#included" onClick={toggleMenu} className="text-slate-300 font-semibold py-2">
              What you get
            </a>
            <a href="#faq" onClick={toggleMenu} className="text-slate-300 font-semibold py-2">
              FAQ
            </a>
            <button onClick={() => { toggleMenu(); void onBuy(); }} className="premium-gradient text-white text-center py-3 rounded-xl font-bold border border-white/10 shadow-lg shadow-cyan-900/40">
              Get Instant Access
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="top" className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-10 left-0 md:left-20 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-10 right-0 md:right-20 w-[35rem] h-[35rem] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] bg-orange-500/5 rounded-full blur-[140px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            One-time purchase • Instant access
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.05] drop-shadow-2xl">
            Tell us what your business does.
            <br className="hidden md:block" />
            <span className="premium-text-gradient">
              We’ll write your ads and a simple launch plan.
            </span>
          </h1>

          <p className="text-slate-400 font-medium text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Answer a few questions and get an ad starter kit: attention-grabbing first lines, short video scripts, ad text, and a step-by-step setup plan.
            <span className="text-white font-semibold"> No ad experience needed.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={onBuy}
              disabled={loading}
              className="w-full sm:w-auto premium-gradient hover-glow disabled:opacity-50 text-white px-10 py-5 rounded-full font-extrabold text-lg transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 border border-white/20"
            >
              {loading ? 'Redirecting…' : 'Get Instant Access'} <ArrowRight className="w-5 h-5 animate-pulse-slow" />
            </button>
            <a
              href="/wizard"
              className="w-full sm:w-auto glass-card border border-white/10 hover:bg-white/5 hover:border-white/20 text-white px-10 py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group"
            >
              Launch Ads Wizard <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            </a>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 text-sm text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Chip icon={<Zap className="w-4 h-4" />} label="Instant delivery" />
              <Chip icon={<ShieldCheck className="w-4 h-4" />} label="One-time purchase" />
              <Chip icon={<Sparkles className="w-4 h-4" />} label="Beginner-friendly" />
            </div>
            {canceled ? <div className="text-rose-400 font-bold mt-2">Checkout canceled.</div> : null}
          </div>

          {/* Purchase card */}
          <div className="mx-auto mt-20 max-w-4xl text-left relative group">
            <div className="absolute -inset-1 premium-gradient rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass-card rounded-3xl p-8 md:p-10 border border-white/10">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-2">$29 <span className="text-xl font-bold text-cyan-400">limited time</span></div>
                  <div className="text-sm font-medium text-slate-400">Normally $49 • One-time payment • Promo codes supported</div>
                </div>

                <div className="flex w-full flex-col gap-3 md:w-[420px]">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Email (optional — for receipt)</label>
                  <input
                    className="glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-cyan-500 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                  <button
                    className="mt-2 rounded-xl premium-gradient text-white px-4 py-3 font-bold shadow-lg shadow-cyan-900/30 hover-glow disabled:opacity-50 transition-all active:scale-[0.98]"
                    disabled={loading}
                    onClick={onBuy}
                  >
                    {loading ? 'Redirecting…' : 'Get my Creative Pack'}
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/10 grid md:grid-cols-2 gap-4 text-sm font-medium text-slate-300">
                <div className="flex gap-3 items-center">
                  <div className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  Written in plain English (no jargon)
                </div>
                <div className="flex gap-3 items-center">
                  <div className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  Copy/paste ad text + short video scripts
                </div>
                <div className="flex gap-3 items-center md:col-span-2">
                  <div className="p-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                  </div>
                  Simple launch plan (what to set up first + what to test next)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-28 relative">
        <div className="absolute inset-0 bg-[#060B18] skew-y-1 origin-top-left -z-10 border-y border-white/5 shadow-2xl"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">How it <span className="text-cyan-400">works</span></h2>
            <p className="text-slate-400 text-lg font-medium">You don’t need to be an ads expert to launch high-converting campaigns.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card
              step="01"
              icon={<Target className="w-8 h-8 text-cyan-400" />}
              title="Tell us about your business"
              desc="Paste your website and answer a few questions (who you help, what you sell, where you serve)."
            />
            <Card
              step="02"
              icon={<FileText className="w-8 h-8 text-violet-400" />}
              title="Get your ad starter kit"
              desc="We generate your ad text + video scripts + a simple setup plan aligned with best practices."
            />
            <Card
              step="03"
              icon={<Sparkles className="w-8 h-8 text-orange-400" />}
              title="Review & launch"
              desc="You approve everything first. Then you launch and start getting calls, leads, and sales."
            />
          </div>
        </div>
      </section>

      {/* What you get */}
      <section id="included" className="py-28 bg-[#030712] relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">What you <span className="text-violet-400">get</span></h2>
            <p className="text-slate-400 text-lg font-medium">A complete Creative Pack you can actually use.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Included icon={<Zap className="w-6 h-6 text-cyan-400"/>} title="Attention-grabbing first lines" desc="Multiple opening lines to stop the scroll and hook your ideal customers immediately." />
            <Included icon={<TrendingUp className="w-6 h-6 text-violet-400"/>} title="Short video scripts" desc="Exactly what to say on camera + on-screen text instructions for high engagement." />
            <Included icon={<FileText className="w-6 h-6 text-orange-400"/>} title="Ad text variations" desc="Ready to copy/paste directly into Meta or Google Ads platform." />
            <Included icon={<Target className="w-6 h-6 text-cyan-400"/>} title="Simple launch plan" desc="A prioritized roadmap: what to set up first + exactly what to test next." />
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={onBuy}
              disabled={loading}
              className="inline-flex items-center justify-center premium-gradient text-white font-extrabold text-lg px-12 py-6 rounded-full transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover-glow border border-white/20"
            >
              {loading ? 'Redirecting…' : 'Access Your Creative Pack'}
              <ArrowRight className="ml-3 w-6 h-6 animate-pulse-slow" />
            </button>
            <p className="mt-4 text-sm font-semibold text-slate-500 uppercase tracking-widest">One-time purchase • Instant delivery</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-28 relative">
        <div className="absolute inset-0 bg-[#060B18] -skew-y-1 origin-bottom-right -z-10 border-y border-white/5"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">F.A.Q.</h2>
            <p className="text-slate-400 text-lg font-medium">Quick answers to the only questions that matter.</p>
          </div>

          <div className="max-w-4xl mx-auto grid gap-6">
            <Faq q="What exactly am I buying?" a="A one-time purchase Creative Pack generator. You answer a few questions about your offer and audience, and it outputs a highly structured ad pack containing hooks, scripts, copy variants, and an execution roadmap." />
            <Faq q="Is this a recurring subscription?" a="No — it is a single, one-time payment for lifetime access to the generation tool." />
            <Faq q="How soon do I get access?" a="Instantly. After checkout, you’ll be redirected to a success page where you can start generating your packs immediately." />
            <Faq q="Does it work for my specific niche?" a="Yes, for almost all niches. The AI tailors the output to your specific inputs. The more precise you are with your offer, audience, and proof, the higher the quality of the generated output." />
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={onBuy}
              disabled={loading}
              className="inline-flex items-center justify-center premium-gradient text-white font-extrabold text-lg px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover-glow border border-white/20"
            >
              {loading ? 'Redirecting…' : 'Get Instant Access For $29'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

        </div>
      </section>
      
      <footer className="py-10 bg-[#030712] text-center border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-6 opacity-50 block">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-xl tracking-tighter">MediaBuyer<span className="text-cyan-400">Pro</span></span>
          </div>
          <p className="text-xs text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Disclaimer: Results depend heavily on your specific offer, sales funnel, and market execution. We do not provide refunds for simply &quot;not running the ads&quot;. 
            <br className="mt-2" /> © {new Date().getFullYear()} MediaBuyerPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full glass-card border-white/10 px-4 py-1.5 text-xs font-bold text-slate-200 shadow-sm">
      <span className="text-cyan-400">{icon}</span>
      {label}
    </span>
  );
}

function Card({ step, icon, title, desc }: { step: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card p-10 rounded-3xl group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/[0.03] group-hover:text-cyan-500/[0.05] transition-colors duration-500 pointer-events-none">
        {step}
      </div>
      <div className="bg-[#030712] border border-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all duration-300 shadow-inner relative z-10">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white group-hover:text-cyan-400 transition-colors relative z-10">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed relative z-10">{desc}</p>
    </div>
  );
}

function Included({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-[#030712] border border-white/10 p-3 rounded-xl shadow-inner">
          {icon}
        </div>
        <div className="text-xl font-bold text-white tracking-tight">{title}</div>
      </div>
      <div className="text-slate-400 font-medium leading-relaxed pl-1">{desc}</div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="font-bold text-lg text-white mb-3">{q}</div>
      <div className="text-slate-400 font-medium leading-relaxed">{a}</div>
    </div>
  );
}

