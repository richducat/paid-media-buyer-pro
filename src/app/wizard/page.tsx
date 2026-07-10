'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Loader2,
  PhoneCall,
  Search,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';

type TemplateKey = 'local-service' | 'ecommerce' | 'b2b-high-ticket';

// ... (types remain same, just adding a few fields if needed or keeping as is for now)

export default function WizardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>(DEFAULTS);
  const [leadEmail, setLeadEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scraper state
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const plan = useMemo(() => {
    if (!state.template) return '';

    // Expert Frameworks for Draft Preview
    const structureLine = "STRUCTURE: CBO (Campaign Budget Optimization) for maximum efficiency.";
    const launchStrategy = "LAUNCH STRATEGY: Start with 'Broad' targeting on Meta or 'Exact/Phrase' mix on Google.";

    if (state.template === 'local-service') {
      const s = state.localService;
      const service0 = s.services.split(',')[0]?.trim() || 'Service';

      return [
        `MASTERCLASS STRATEGY: LOCAL SERVICE (GOOGLE SEARCH)`,
        `BUSINESS: ${s.businessName || '[Business]'}`,
        `TARGET AREA: ${s.primaryCity || '[City]'} (+${s.serviceRadiusMiles}mi)`,
        `\n${structureLine}`,
        launchStrategy,
        `1. ALPHA CAMPAIGN (Exact Match): Focus on high-intent "${service0}" terms.`,
        `2. BETA CAMPAIGN (Phrase Match): Capture long-tail "near me" and "emergency" searches.`,
        `\nEXPERT KEYWORDS:`,
        `- "${service0} ${s.primaryCity}" [Exact]`,
        `- "${service0} near me" [Phrase]`,
        `- "emergency ${service0}" [Phrase]`,
        `\nTHE SHIELD (Negative Keywords):`,
        `- free, jobs, manual, pdf, youtube, training, parts`,
        `\nAD EXTENSIONS: Sitelinks (Pricing, Feedback), Callouts (24/7, Local), Call Extension.`,
      ].join('\n');
    }

    if (state.template === 'ecommerce') {
      const s = state.ecommerce;
      return [
        `MASTERCLASS STRATEGY: E-COMMERCE (META/TIKTOK)`,
        `BRAND: ${s.brandName || '[Brand]'}`,
        `HERO PRODUCT: ${s.heroProduct || '[Product]'}`,
        `\n${structureLine}`,
        `1. PROSPECTING (Broad): Let the pixel find buyers for ${s.heroProduct}.`,
        `2. RETARGETING: Re-engage 7-day cart abandoners with "${s.offer || 'special offer'}".`,
        `\nCREATIVE ANGLES (PAS Framework):`,
        `- Angle 1: Focus on the ${s.heroProduct} solution to user's pain.`,
        `- Angle 2: Social proof of ${s.proof || 'results'}.`,
        `\nKPI TARGET: Goal ROAS should be 2.5x+ given the ${s.pricePoint} price point.`,
      ].join('\n');
    }

    const s = state.b2b;
    return [
      `MASTERCLASS STRATEGY: B2B / HIGH-TICKET (GOOGLE SEARCH)`,
      `COMPANY: ${s.companyName || '[Company]'}`,
      `CORE SERVICE: ${s.service || '[Service]'}`,
      `\n${structureLine}`,
      `1. SEARCH ALPHA: Targeted keywords for "${s.targetCustomer || 'Decision Makers'}".`,
      `2. COMPETITOR CONQUEST: Bid on competitor brand terms with ${s.proof || 'better USPs'}.`,
      `\nCONVERSION FOCUS: BOOKED CALLS`,
      `- Destination: ${s.bookingLink || 'High-converting landing page'}`,
      `- Form: 3-5 qualifying questions before the booking link.`,
    ].join('\n');
  }, [state]);

  async function handleAutoIntake() {
    if (!websiteUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Auto-fill based on template (or pick a default template)
      if (!state.template) {
        // If no template chosen, default to local-service for demo
        setState(prev => ({
          ...prev,
          template: 'local-service',
          localService: {
            ...prev.localService,
            businessName: data.name || '',
            website: websiteUrl,
            services: data.services || '',
            promos: data.usp || '',
          }
        }));
        setStep(2);
      } else {
        // Update current selected template state
        setState(prev => {
          const newState = { ...prev };
          if (newState.template === 'local-service') {
            newState.localService = { ...newState.localService, businessName: data.name || '', website: websiteUrl, services: data.services || '', promos: data.usp || '' };
          } else if (newState.template === 'ecommerce') {
            newState.ecommerce = { ...newState.ecommerce, brandName: data.name || '', website: websiteUrl, heroProduct: data.services || '', offer: data.usp || '' };
          } else if (newState.template === 'b2b-high-ticket') {
            newState.b2b = { ...newState.b2b, companyName: data.name || '', website: websiteUrl, service: data.services || '', proof: data.usp || '' };
          }
          return newState;
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScraping(false);
    }
  }

  function selectTemplate(t: TemplateKey) {
    setState((prev) => ({ ...prev, template: t }));
    setStep(2);
  }

  function next() {
    setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 3));
  }

  function back() {
    setStep((s) => (s === 3 ? 2 : s === 2 ? 1 : 1));
  }

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function submitLead() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (!state.template) throw new Error('Missing template');

      const payload: Record<string, unknown> = { template: state.template, email: leadEmail };
      if (state.template === 'local-service') {
        const s = state.localService;
        Object.assign(payload, {
          businessName: s.businessName,
          website: s.website,
          phone: s.phone,
          city: s.primaryCity,
          radiusMiles: s.serviceRadiusMiles,
          services: s.services,
          hours: s.hours,
          promos: s.promos,
        });
      } else if (state.template === 'ecommerce') {
        const s = state.ecommerce;
        Object.assign(payload, {
          businessName: s.brandName,
          website: s.website,
          services: s.heroProduct,
          promos: s.offer,
          proof: s.proof,
          geo: s.geo,
        });
      } else {
        const s = state.b2b;
        Object.assign(payload, {
          businessName: s.companyName,
          website: s.website,
          services: s.service,
          proof: s.proof,
          geo: s.geo,
          bookingLink: s.bookingLink,
        });
      }

      // Best-effort lead capture — an unconfigured backend shouldn't block checkout.
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // ignore — checkout is the priority
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: leadEmail || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Checkout failed');
      window.location.href = json.url;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong — please try again';
      setSubmitError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 selection:bg-cyan-500/30 overflow-x-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50rem] max-w-7xl pointer-events-none -z-10">
          <div className="absolute top-0 left-0 md:left-20 w-[60rem] h-[30rem] bg-cyan-500/5 rounded-full blur-[150px] mix-blend-screen" />
          <div className="absolute top-40 right-0 md:right-20 w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl relative z-10">
        <div className="mb-12">
          <Link href="/" className="group text-sm font-semibold text-slate-400 hover:text-white inline-flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-full backdrop-blur-md border border-white/5 hover:border-white/10">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to home
          </Link>
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter premium-text-gradient drop-shadow-lg pb-1">
                Ads Generator
              </h1>
              <p className="mt-3 text-lg font-medium text-slate-400 max-w-2xl">
                The fastest way to professional ads. Paste your URL and let the AI do the heavy lifting.
              </p>
            </div>

            {/* Auto-Intake Quick Bar */}
            <div className={`relative flex items-center p-1 rounded-full border transition-all duration-500 w-full md:w-[450px] shadow-2xl ${
              websiteUrl ? 'border-cyan-500/50 bg-cyan-950/30' : 'border-white/10 glass-card'
              }`}>
              <Search className={`absolute left-5 h-5 w-5 transition-colors ${websiteUrl ? 'text-cyan-400' : 'text-slate-500'}`} />
              <input
                type="url"
                placeholder="Paste your website URL to auto-fill..."
                className="w-full bg-transparent border-none focus:ring-0 pl-14 pr-3 py-3 text-sm text-white placeholder:text-slate-600 outline-none"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <button
                onClick={handleAutoIntake}
                disabled={isScraping || !websiteUrl}
                className="flex items-center gap-2 premium-gradient hover-glow border border-white/20 disabled:opacity-50 text-white px-5 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-cyan-900/40"
              >
                {isScraping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Auto-Fill
              </button>
            </div>
          </div>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <div className="mt-14 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl font-black flex items-center gap-3 justify-center md:justify-start">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Sparkles className="h-6 w-6 text-cyan-400" />
                </div>
                Step 1: Choose Your Objective
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <TemplateCard
                icon={<PhoneCall className="h-7 w-7" />}
                title="Local Service"
                subtitle="Google Search — calls + form leads"
                bullets={['Plumbers, HVAC, Legal', 'High-intent location traffic', 'Direct call tracking']}
                onClick={() => selectTemplate('local-service')}
                highlight={state.template === 'local-service'}
              />
              <TemplateCard
                icon={<ShoppingCart className="h-7 w-7" />}
                title="Online Store"
                subtitle="Meta Ads — sales & ROAS"
                bullets={['Product prospecting', 'Visual UGC strategies', 'Conversion pixel tracking']}
                onClick={() => selectTemplate('ecommerce')}
                highlight={state.template === 'ecommerce'}
              />
              <TemplateCard
                icon={<BriefcaseBusiness className="h-7 w-7" />}
                title="B2B / SaaS"
                subtitle="Google Search — demo calls"
                bullets={['High-ticket lead gen', 'Intent-based keyword sets', 'Demo booking focus']}
                onClick={() => selectTemplate('b2b-high-ticket')}
                highlight={state.template === 'b2b-high-ticket'}
              />
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-14 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid lg:grid-cols-[1fr_420px] gap-8">
              <div className="glass-card rounded-3xl p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/5">
                  <div>
                    <h2 className="text-3xl font-black text-white">Campaign Details</h2>
                    <p className="text-slate-400 mt-2 font-medium">Refine what the AI extracted or fill manually.</p>
                  </div>
                  <div className="bg-violet-500/10 text-violet-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 border border-violet-500/20 uppercase shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                    <Sparkles className="h-4 w-4" /> Expert Mode: {state.template?.replace('-', ' ')}
                  </div>
                </div>

                <div className="grid gap-6">
                  {state.template === 'local-service' ? (
                    <>
                      <Field label="Business Name" value={state.localService.businessName} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, businessName: v } }))} placeholder="Roanoke AC Pros" />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="Website" value={state.localService.website} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, website: v } }))} placeholder="https://..." hint="We'll scan this for your services" />
                        <Field label="Phone" value={state.localService.phone} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, phone: v } }))} placeholder="(555) 555-5555" hint="For 'Click-to-Call' ads" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Field label="Primary City" value={state.localService.primaryCity} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, primaryCity: v } }))} placeholder="Roanoke, VA" />
                        <NumberField label="Radius (mi)" value={state.localService.serviceRadiusMiles} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, serviceRadiusMiles: v } }))} />
                      </div>
                      <TextArea label="Top Services Extraction" value={state.localService.services} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, services: v } }))} placeholder="AC repair, HVAC install..." />
                      <TextArea label="USP / Differentiators" value={state.localService.promos} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, promos: v } }))} placeholder="Free estimate • Same-day..." />
                    </>
                  ) : null}

                  {state.template === 'ecommerce' && (
                    <div className="grid gap-6">
                      <Field label="Brand Name" value={state.ecommerce.brandName} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, brandName: v } }))} placeholder="GlowSkin" hint="Your public-facing brand" />
                      <Field label="Hero Product" value={state.ecommerce.heroProduct} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, heroProduct: v } }))} placeholder="Vitamin C Serum" hint="The product we'll build the campaign around" />
                      <TextArea label="Offer / Hook" value={state.ecommerce.offer} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, offer: v } }))} placeholder="Free shipping • 20% off" />
                      <TextArea label="Social Proof/Proof" value={state.ecommerce.proof} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, proof: v } }))} placeholder="4.8 stars • 2,000+ customers" />
                    </div>
                  )}

                  {state.template === 'b2b-high-ticket' && (
                    <div className="grid gap-6">
                      <Field label="Company Name" value={state.b2b.companyName} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, companyName: v } }))} placeholder="Acme Growth" hint="Formal company name" />
                      <Field label="What do you sell?" value={state.b2b.service} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, service: v } }))} placeholder="Google Ads management" hint="Describe your core B2B service" />
                      <TextArea label="Target Outcome" value={state.b2b.proof} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, proof: v } }))} placeholder="Reduced CPA from $120 → $65" />
                    </div>
                  )}
                </div>

                <div className="mt-10 flex gap-4 pt-8 border-t border-white/5">
                  <button onClick={back} className="rounded-xl border border-white/10 px-6 py-4 text-sm font-bold hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={next}
                    className="flex-1 rounded-xl premium-gradient text-white px-6 py-4 text-base font-extrabold inline-flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-cyan-900/30 hover-glow border border-white/20"
                  >
                    Build Expert Plan <ArrowRight className="h-5 w-5 animate-pulse-slow" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-8 h-full flex flex-col">
                  <h3 className="text-xl font-black flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <Search className="h-5 w-5 text-cyan-400" />
                    </div>
                    Draft Outcome
                  </h3>
                  <div className="relative group flex-1 flex flex-col">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <pre className="relative flex-1 bg-[#02040A] rounded-2xl border border-white/10 p-6 font-mono text-xs leading-loose overflow-auto text-cyan-50/70 shadow-inner">
                      {plan}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-14 lg:grid lg:grid-cols-[1fr_400px] gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="glass-card rounded-3xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                <div>
                  <h2 className="text-3xl font-black text-white">Expert Strategy Pack</h2>
                  <p className="text-base font-medium text-slate-400 mt-2">Ready for copy/paste or direct launch.</p>
                </div>
                <button
                  onClick={() => void copy(plan)}
                  className="rounded-xl glass-card border border-white/10 px-5 py-3 text-sm font-bold inline-flex items-center gap-2 hover:bg-white/10 transition-colors shadow-sm"
                >
                  <Clipboard className="h-4 w-4 text-cyan-400" /> Copy Plan
                </button>
              </div>

              <div className="bg-[#02040A] rounded-2xl border border-white/5 p-8 font-mono text-sm leading-loose text-slate-300 shadow-inner">
                {plan.split('\n').map((line, i) => (
                  <div key={i} className={`${line.startsWith('-') ? 'text-cyan-400 font-medium' : line.startsWith('MASTERCLASS') ? 'text-white font-black text-base mb-6 tracking-wide' : 'text-slate-400'}`}>
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-col md:flex-row gap-4 pt-8 border-t border-white/5">
                <button onClick={back} className="rounded-xl border border-white/10 px-6 py-4 text-sm font-bold hover:bg-white/5 transition-colors">
                  Edit Details
                </button>
                <div className="flex-1 flex flex-col gap-4">
                  <div className="relative">
                    <input
                      className="w-full glass-input rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Send expert results to..."
                    />
                  </div>
                  {submitError ? <div className="text-xs font-bold text-rose-400 px-2">{submitError}</div> : null}
                  <button
                    onClick={() => void submitLead()}
                    disabled={submitting || !leadEmail}
                    className="w-full rounded-xl premium-gradient disabled:opacity-50 px-6 py-5 text-base font-extrabold text-white inline-flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover-glow border border-white/20 transform hover:-translate-y-1 active:scale-[0.98] transition-all"
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                    {submitting ? 'Preparing Campaign...' : 'Unlock Full Creative Pack'}
                  </button>
                  <p className="text-[11px] text-slate-500 font-medium text-center">
                    One-time purchase · Instant access · Secure Stripe checkout
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 space-y-6">
              <div className="glass-card rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-[#0A0F1E] to-cyan-950/20 shadow-2xl">
                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white">
                  <Sparkles className="h-5 w-5 text-orange-400" /> Expert Bonus
                </h3>
                <ul className="space-y-6">
                  <li className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white block text-sm mb-1">Negative Keyword List</span>
                      <span className="text-xs font-medium text-slate-400 leading-relaxed block">Automatically filtered to save you 30%+ on wasted spend immediately.</span>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white block text-sm mb-1">Expert Ad Scheduling</span>
                      <span className="text-xs font-medium text-slate-400 leading-relaxed block">Match your traffic to when your business is actually open and converting.</span>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <span className="font-extrabold text-white block text-sm mb-1">Masterclass Guide</span>
                      <span className="text-xs font-medium text-slate-400 leading-relaxed block">The exact hidden settings to toggle in Google Ads for max ROI.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Objective', icon: <Sparkles className="h-5 w-5" /> },
    { n: 2, label: 'Intake', icon: <Search className="h-5 w-5" /> },
    { n: 3, label: 'Strategy', icon: <BriefcaseBusiness className="h-5 w-5" /> },
  ] as const;

  return (
    <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide py-2">
      {steps.map((s) => {
        const active = s.n === step;
        const past = s.n < step;
        return (
          <div
            key={s.n}
            className={`flex-1 min-w-[160px] rounded-3xl border px-6 py-5 transition-all duration-500 relative overflow-hidden group ${
              active ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.15)] transform scale-[1.02]' 
              : past ? 'border-white/10 glass-card opacity-80' 
              : 'border-white/5 bg-[#030712]/50'
            }`}
          >
            {active && <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />}
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-cyan-400' : 'text-slate-500'}`}>0{s.n}</span>
              {active && <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] animate-pulse" />}
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-500 bg-white/5 border border-white/5'}`}>{s.icon}</div>
              <div className={`font-extrabold text-base tracking-tight ${active ? 'text-white' : 'text-slate-400'}`}>{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TemplateCard({
  icon,
  title,
  subtitle,
  bullets,
  onClick,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  bullets: string[];
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-3xl border p-8 transition-all duration-300 group ${highlight
        ? 'border-cyan-500/50 bg-cyan-950/20 ring-1 ring-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)] scale-[1.02]'
        : 'border-white/10 glass-card hover:bg-white/5 hover:border-white/20'
        }`}
    >
      <div className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 shadow-lg ${highlight ? 'premium-gradient text-white shadow-cyan-900/40' : 'bg-[#030712] text-cyan-400 border border-white/10'
        }`}>
        {icon}
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-black mb-2 text-white">{title}</h3>
        <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{subtitle}</p>
      </div>

      <ul className="space-y-4 mb-10">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
            <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 transition-colors ${highlight ? 'text-cyan-400' : 'text-slate-600'}`} /> {b}
          </li>
        ))}
      </ul>

      <div className={`inline-flex items-center justify-center w-full gap-2 text-sm font-bold px-6 py-4 rounded-xl transition-all ${highlight ? 'bg-white text-slate-950 shadow-md' : 'glass-card border border-white/10 text-white group-hover:bg-white/10'
        }`}>
        Select Format <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, hint }: { label: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[10px] text-cyan-400 font-bold italic">{hint}</span>}
      </div>
      <input
        className="glass-input w-full rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-600 font-medium"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: React.ReactNode; value: number; onChange: (v: number) => void; }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</label>
      <input
        type="number"
        className="glass-input w-full rounded-xl px-5 py-4 text-sm text-white font-medium"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</label>
      <textarea
        className="glass-input w-full min-h-[120px] rounded-xl px-5 py-4 text-sm text-white placeholder:text-slate-600 leading-relaxed font-medium resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

const DEFAULTS: WizardState = {
  template: null,
  localService: { businessName: '', website: '', phone: '', primaryCity: '', serviceRadiusMiles: 20, services: '', hours: 'Mon–Fri 8am–6pm', promos: '' },
  ecommerce: { brandName: '', website: '', heroProduct: '', pricePoint: '$', geo: 'United States', offer: '', proof: '' },
  b2b: { companyName: '', website: '', service: '', geo: 'United States', targetCustomer: '', proof: '', bookingLink: '' },
};

type WizardState = {
  template: TemplateKey | null;
  localService: { businessName: string; website: string; phone: string; primaryCity: string; serviceRadiusMiles: number; services: string; hours: string; promos: string; };
  ecommerce: { brandName: string; website: string; heroProduct: string; pricePoint: string; geo: string; offer: string; proof: string; };
  b2b: { companyName: string; website: string; service: string; geo: string; targetCustomer: string; proof: string; bookingLink: string; };
};
