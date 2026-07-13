'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Bot, Check, ChevronRight, Menu, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const visible = true;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#19231f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#244036]/10 bg-[#f4f0e8]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[15px] bg-[#f2a66f] shadow-[0_8px_24px_rgba(242,166,111,.22)]"><TrendingUp className="h-5 w-5" strokeWidth={2.5} /></span>
            <span><b className="block text-[15px] tracking-[-.02em]">Paid Media Pro</b><span className="block text-[9px] font-bold uppercase tracking-[.18em] text-[#6f7c74]">AI media buyer</span></span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            <a href="#how" className="text-xs font-bold text-[#59665f] hover:text-[#1c3026]">How it works</a>
            <a href="#control" className="text-xs font-bold text-[#59665f] hover:text-[#1c3026]">You stay in control</a>
            <Link href="/dashboard" className="rounded-xl bg-[#1d3228] px-5 py-3 text-xs font-black text-white shadow-[0_8px_20px_rgba(29,50,40,.16)]">Open workspace</Link>
          </nav>
          <button onClick={() => setMenuOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-xl border border-[#d6d1c6] md:hidden" aria-label="Menu">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
        {menuOpen && <div className="border-t border-[#d9d4c9] bg-[#f8f4ec] p-5 md:hidden"><div className="flex flex-col gap-4"><a href="#how" onClick={() => setMenuOpen(false)} className="text-sm font-bold">How it works</a><a href="#control" onClick={() => setMenuOpen(false)} className="text-sm font-bold">You stay in control</a><Link href="/dashboard" className="rounded-xl bg-[#1d3228] px-5 py-3 text-center text-sm font-black text-white">Open workspace</Link></div></div>}
      </header>

      <section className="relative min-h-[800px] pt-[76px] lg:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(242,166,111,.28),transparent_28%),radial-gradient(circle_at_12%_70%,rgba(102,137,111,.17),transparent_30%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1440px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:px-12">
          <div className={`max-w-2xl transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9b894] bg-[#fff7eb] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.15em] text-[#77502d]"><Sparkles className="h-3.5 w-3.5" /> Built by a real media buyer</div>
            <h1 className="text-[48px] font-black leading-[.98] tracking-[-.06em] sm:text-[64px] lg:text-[78px]">Your ads,<br /><span className="text-[#bd6e3c]">finally explained.</span></h1>
            <p className="mt-7 max-w-xl text-base font-medium leading-7 text-[#5f6c65] sm:text-lg">Connect Google and Meta. Paid Media Pro finds waste, builds campaigns, and improves performance—then tells you exactly what it wants to do in language anyone can understand.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard" className="group flex items-center justify-center gap-3 rounded-2xl bg-[#1d3228] px-7 py-4 text-sm font-black text-white shadow-[0_14px_35px_rgba(29,50,40,.18)] transition hover:-translate-y-0.5">Explore the workspace <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></Link><a href="#how" className="flex items-center justify-center gap-2 rounded-2xl border border-[#cec8bb] bg-white/45 px-7 py-4 text-sm font-black">See how it works <ChevronRight className="h-4 w-4" /></a></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-bold text-[#66736b]"><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#4c765b]" /> Starts read-only</span><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#4c765b]" /> No passwords stored</span><span className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-[#4c765b]" /> Hard budget limits</span></div>
          </div>

          <div className={`relative mx-auto w-full max-w-[670px] transition-all delay-150 duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="absolute -inset-10 rounded-full bg-[#f2a66f]/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-[#c9c5ba] bg-[#fbf9f4] shadow-[0_35px_100px_rgba(38,53,44,.18)]">
              <div className="flex items-center justify-between border-b border-[#dfdad0] px-5 py-4"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#e59666]" /><span className="h-2.5 w-2.5 rounded-full bg-[#dac99c]" /><span className="h-2.5 w-2.5 rounded-full bg-[#8eaa92]" /></div><span className="rounded-full bg-[#fff0dd] px-3 py-1 text-[8px] font-black uppercase tracking-[.13em] text-[#7f562c]">Sample workspace</span></div>
              <div className="grid sm:grid-cols-[170px_1fr]"><div className="hidden bg-[#1b2b24] p-5 text-white sm:block"><div className="flex items-center gap-2 text-xs font-black"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f2a66f] text-[#1b2b24]"><TrendingUp className="h-3.5 w-3.5" /></span> Paid Media Pro</div><div className="mt-8 space-y-2">{['Overview', 'AI media buyer', 'Campaigns', 'Connections'].map((label, index) => <div key={label} className={`rounded-lg px-3 py-2.5 text-[10px] font-bold ${index === 0 ? 'bg-[#f2a66f] text-[#1b2b24]' : 'text-[#aebdb1]'}`}>{label}</div>)}</div><div className="mt-28 rounded-xl border border-white/10 bg-white/5 p-3"><div className="text-[8px] font-black uppercase tracking-wider text-[#8ea294]">Buyer mode</div><div className="mt-2 flex items-center gap-2 text-[10px] font-bold"><ShieldCheck className="h-3.5 w-3.5 text-[#f2a66f]" /> Ask me first</div></div></div><div className="p-5 sm:p-6"><div className="flex items-center justify-between"><div><div className="text-[8px] font-black uppercase tracking-[.15em] text-[#7b857e]">Last 30 days</div><div className="mt-1 text-lg font-black">Performance at a glance</div></div><span className="text-[8px] font-black text-[#4e765b]">UPDATED 4M AGO</span></div><div className="mt-5 grid grid-cols-2 gap-2.5">{[['Ad spend', '$12,480'], ['Qualified leads', '326'], ['Cost per lead', '$38.28'], ['ROAS', '4.18×']].map(([label, value]) => <div key={label} className="rounded-xl border border-[#ded9ce] bg-white/45 p-3"><div className="text-[8px] font-bold text-[#78817b]">{label}</div><div className="mt-1 text-lg font-black tracking-tight">{value}</div><div className="mt-1 text-[7px] font-black text-[#4b7759]">IMPROVING</div></div>)}</div><div className="mt-3 rounded-xl bg-[#1d3027] p-4 text-white"><div className="flex items-center gap-2 text-[10px] font-black"><Bot className="h-4 w-4 text-[#f2a66f]" /> Today&apos;s buyer brief</div><p className="mt-2 text-[9px] leading-4 text-[#b7c5ba]">Lead volume is up while cost per lead is down. Two low-risk improvements are ready for review.</p><div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] font-black text-[#f2b58a]">Review proposed actions <ArrowRight className="h-3 w-3" /></div></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-[#1b2d24] py-24 text-white sm:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8"><div className="max-w-2xl"><span className="text-[10px] font-black uppercase tracking-[.18em] text-[#e9a777]">From login to clarity</span><h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">Three steps. One of them is yours.</h2></div><div className="mt-14 grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 md:grid-cols-3">{[
          ['01', 'Connect', 'Sign in to Google or Meta with the accounts you already own. We begin read-only.'],
          ['02', 'Understand', 'The agent audits tracking, campaigns, creative, spend, and real business results.'],
          ['03', 'Approve', 'Review the exact plan in plain English. Approve each action or set safe autopilot limits.'],
        ].map(([number, title, copy]) => <div key={number} className="bg-[#1b2d24] p-8 sm:p-10"><span className="text-xs font-black text-[#efa873]">{number}</span><h3 className="mt-16 text-2xl font-black">{title}</h3><p className="mt-3 text-sm leading-6 text-[#adbbb0]">{copy}</p></div>)}</div></div>
      </section>

      <section id="control" className="py-24 sm:py-32"><div className="mx-auto grid max-w-[1280px] gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:items-center"><div><span className="text-[10px] font-black uppercase tracking-[.18em] text-[#a56238]">Autonomy without anxiety</span><h2 className="mt-4 text-4xl font-black tracking-[-.05em] sm:text-6xl">You decide how much the AI can do.</h2><p className="mt-6 max-w-xl text-base leading-7 text-[#626f67]">Start with observation. Move to approvals. Turn on bounded autopilot only when you are ready. Budget caps, anomaly stops, conversion checks, and a full audit trail remain on in every mode.</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#d8814b] px-6 py-4 text-sm font-black text-white">Try the control center <ArrowRight className="h-4 w-4" /></Link></div><div className="space-y-3">{[
          ['Watch only', 'Analysis and recommendations. No account changes.'],
          ['Ask me first', 'Exact changes are prepared for your approval.'],
          ['Bounded autopilot', 'Low-risk actions inside hard limits you define.'],
        ].map(([title, copy], index) => <div key={title} className={`flex items-center gap-4 rounded-[22px] border p-5 ${index === 1 ? 'border-[#78927e] bg-[#e6eee5]' : 'border-[#d6d1c6] bg-[#fbf9f4]'}`}><span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 1 ? 'bg-[#31543f] text-white' : 'bg-[#ebe6db]'}`}>{index === 0 ? <Target className="h-5 w-5" /> : index === 1 ? <ShieldCheck className="h-5 w-5" /> : <Zap className="h-5 w-5" />}</span><span><b className="block text-sm">{title}</b><span className="mt-1 block text-xs text-[#69746d]">{copy}</span></span>{index === 1 && <span className="ml-auto text-[9px] font-black uppercase tracking-wider text-[#42644e]">Recommended</span>}</div>)}</div></div></section>

      <footer className="border-t border-[#d7d2c7] px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-[1280px] flex-col gap-3 text-xs text-[#717a74] sm:flex-row sm:items-center sm:justify-between"><b className="text-[#29372f]">Paid Media Pro</b><span>Built for clarity, control, and measurable performance.</span></div></footer>
    </main>
  );
}

