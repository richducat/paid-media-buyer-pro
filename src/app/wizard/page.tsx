'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Clock,
  Globe,
  Loader2,
  MapPin,
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
        payload.businessName = state.localService.businessName;
        // ... rest of payload mapping
      }
      // ... fetch call
      window.location.href = '/success?session_id=demo';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Lead capture failed';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-emerald-500/30">
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl">
        <div className="mb-12">
          <Link href="/" className="group text-sm text-slate-400 hover:text-white inline-flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to home
          </Link>
          <div className="mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Ad Campaign Wizard
              </h1>
              <p className="mt-3 text-lg text-slate-400 max-w-2xl">
                The fastest way to professional ads. Paste your URL and we'll do the heavy lifting.
              </p>
            </div>

            {/* Auto-Intake Quick Bar */}
            <div className={`relative flex items-center p-1 rounded-full border transition-all duration-300 w-full md:w-[400px] ${websiteUrl ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-800 bg-slate-900/40'
              }`}>
              <Search className="absolute left-4 h-4 w-4 text-slate-500" />
              <input
                type="url"
                placeholder="Scale with your URL..."
                className="w-full bg-transparent border-none focus:ring-0 pl-11 pr-3 py-2 text-sm text-white placeholder:text-slate-600"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <button
                onClick={handleAutoIntake}
                disabled={isScraping || !websiteUrl}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 px-4 py-2 rounded-full text-xs font-bold transition-all"
              >
                {isScraping ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Auto-Fill
              </button>
            </div>
          </div>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <div className="mt-12">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                Step 1: Choose Your Objective
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <TemplateCard
                icon={<PhoneCall className="h-6 w-6" />}
                title="Local Service"
                subtitle="Google Search — calls + form leads"
                bullets={['Plumbers, HVAC, Legal', 'High-intent location traffic', 'Direct call tracking']}
                onClick={() => selectTemplate('local-service')}
                highlight={state.template === 'local-service'}
              />
              <TemplateCard
                icon={<ShoppingCart className="h-6 w-6" />}
                title="Online Store"
                subtitle="Meta Ads — sales & ROAS"
                bullets={['Product prospecting', 'Visual UGC strategies', 'Conversion pixel tracking']}
                onClick={() => selectTemplate('ecommerce')}
                highlight={state.template === 'ecommerce'}
              />
              <TemplateCard
                icon={<BriefcaseBusiness className="h-6 w-6" />}
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
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-emerald-950/20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">Campaign Details</h2>
                    <p className="text-sm text-slate-400 mt-1">Refine what the AI extracted or fill manually.</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest flex items-center gap-1.5 border border-emerald-500/20 uppercase">
                    <Sparkles className="h-3 w-3" /> Expert Mode: {state.template?.replace('-', ' ')}
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

                  {/* ... other template cases similar structure with premium fields */}
                  {state.template === 'ecommerce' && (
                    <div className="grid gap-4">
                      <Field label="Brand Name" value={state.ecommerce.brandName} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, brandName: v } }))} placeholder="GlowSkin" hint="Your public-facing brand" />
                      <Field label="Hero Product" value={state.ecommerce.heroProduct} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, heroProduct: v } }))} placeholder="Vitamin C Serum" hint="The product we'll build the campaign around" />
                      <TextArea label="Offer / Hook" value={state.ecommerce.offer} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, offer: v } }))} placeholder="Free shipping • 20% off" />
                      <TextArea label="Social Proof/Proof" value={state.ecommerce.proof} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, proof: v } }))} placeholder="4.8 stars • 2,000+ customers" />
                    </div>
                  )}

                  {state.template === 'b2b-high-ticket' && (
                    <div className="grid gap-4">
                      <Field label="Company Name" value={state.b2b.companyName} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, companyName: v } }))} placeholder="Acme Growth" hint="Formal company name" />
                      <Field label="What do you sell?" value={state.b2b.service} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, service: v } }))} placeholder="Google Ads management" hint="Describe your core B2B service" />
                      <TextArea label="Target Outcome" value={state.b2b.proof} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, proof: v } }))} placeholder="Reduced CPA from $120 → $65" />
                    </div>
                  )}
                </div>

                <div className="mt-10 flex gap-4 pt-6 border-t border-white/5">
                  <button onClick={back} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <button
                    onClick={next}
                    className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-3 text-sm font-bold text-slate-950 inline-flex items-center justify-center gap-2 transform active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Build Expert Plan <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <Search className="h-4 w-4 text-emerald-400" />
                    Draft Outcome
                  </h3>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <pre className="relative h-[480px] w-full bg-slate-950/80 rounded-xl border border-white/5 p-4 font-mono text-[10px] leading-relaxed overflow-auto scrollbar-hide text-emerald-50/70">
                      {plan}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-12 lg:grid lg:grid-cols-[1fr_380px] gap-8">
            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Expert Strategy Pack</h2>
                  <p className="text-sm text-slate-400 mt-1">Ready for copy/paste or direct launch.</p>
                </div>
                <button
                  onClick={() => void copy(plan)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold inline-flex items-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <Clipboard className="h-3.5 w-3.5" /> Copy Plan
                </button>
              </div>

              <div className="bg-slate-950/50 rounded-2xl border border-white/5 p-6 font-mono text-xs leading-relaxed text-slate-300">
                {plan.split('\n').map((line, i) => (
                  <div key={i} className={`${line.startsWith('-') ? 'text-emerald-400' : line.startsWith('TEMPLATE') ? 'text-white font-bold text-sm mb-4' : 'text-slate-400'}`}>
                    {line}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <button onClick={back} className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium hover:bg-white/5 transition-colors">
                  Edit Details
                </button>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="relative">
                    <input
                      className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-emerald-500 transition-all"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Expert results sent to..."
                    />
                  </div>
                  {submitError ? <div className="text-xs text-red-400">{submitError}</div> : null}
                  <button
                    onClick={() => void submitLead()}
                    disabled={submitting || !leadEmail}
                    className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-6 py-4 text-sm font-bold text-slate-950 inline-flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transform active:scale-[0.98] transition-all"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    {submitting ? 'Preparing Campaign...' : 'Finalize & Access'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:mt-0 space-y-6">
              <div className="glass-card rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-slate-900/60 to-emerald-950/20">
                <h3 className="text-lg font-bold mb-4">Expert Bonus</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-white block">Negative Keyword List</span>
                      Automatically filtered to save you 30%+ on wasted spend.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-blue-400" />
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-white block">Expert Ad Schedulilng</span>
                      Match your traffic to when your business is actually open.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="h-5 w-5 rounded bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-purple-400" />
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-white block">Masterclass Guide</span>
                      The exact settings to toggle in Google Ads for max ROI.
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
    { n: 1, label: 'Objective', icon: <Sparkles className="h-4 w-4" /> },
    { n: 2, label: 'Intake', icon: <Search className="h-4 w-4" /> },
    { n: 3, label: 'Strategy', icon: <BriefcaseBusiness className="h-4 w-4" /> },
  ] as const;

  return (
    <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
      {steps.map((s) => {
        const active = s.n === step;
        const past = s.n < step;
        return (
          <div
            key={s.n}
            className={`flex-1 min-w-[140px] rounded-2xl border px-5 py-4 transition-all duration-300 ${active ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' : past ? 'border-slate-700 bg-slate-900/40 opacity-70' : 'border-slate-800 bg-slate-900/20'
              }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-emerald-400' : 'text-slate-500'}`}>0{s.n}</span>
              {active && <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
            </div>
            <div className="flex items-center gap-3">
              <div className={`${active ? 'text-emerald-400' : 'text-slate-500'}`}>{s.icon}</div>
              <div className={`font-bold text-sm ${active ? 'text-white' : 'text-slate-400'}`}>{s.label}</div>
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
        ? 'border-emerald-500/50 bg-emerald-500/5 ring-1 ring-emerald-500/20'
        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
        }`}
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${highlight ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-emerald-400'
        }`}>
        {icon}
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400/60 shrink-0" /> {b}
          </li>
        ))}
      </ul>

      <div className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all ${highlight ? 'bg-white text-slate-950 translate-x-1' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'
        }`}>
        Select Format <ArrowRight className="h-3 w-3" />
      </div>
    </button>
  );
}

function Field({ label, value, onChange, placeholder, hint }: { label: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[10px] text-emerald-500/60 font-medium italic">{hint}</span>}
      </div>
      <input
        className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: React.ReactNode; value: number; onChange: (v: number) => void; }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input
        type="number"
        className="glass-input w-full rounded-xl px-4 py-3 text-sm text-white"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: React.ReactNode; value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <textarea
        className="glass-input w-full min-h-[100px] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-700 leading-relaxed"
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
