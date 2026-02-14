'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  BriefcaseBusiness,
  CheckCircle2,
  Clipboard,
  Clock,
  Globe,
  MapPin,
  PhoneCall,
  ShoppingCart,
} from 'lucide-react';

type TemplateKey = 'local-service' | 'ecommerce' | 'b2b-high-ticket';

type LocalServiceIntake = {
  businessName: string;
  website: string;
  phone: string;
  primaryCity: string;
  serviceRadiusMiles: number;
  services: string;
  hours: string;
  promos: string;
};

type EcommerceIntake = {
  brandName: string;
  website: string;
  heroProduct: string;
  pricePoint: string;
  geo: string;
  offer: string;
  proof: string;
};

type B2BIntake = {
  companyName: string;
  website: string;
  service: string;
  geo: string;
  targetCustomer: string;
  proof: string;
  bookingLink: string;
};

type WizardState = {
  template: TemplateKey | null;
  localService: LocalServiceIntake;
  ecommerce: EcommerceIntake;
  b2b: B2BIntake;
};

const DEFAULTS: WizardState = {
  template: null,
  localService: {
    businessName: '',
    website: '',
    phone: '',
    primaryCity: '',
    serviceRadiusMiles: 20,
    services: 'AC repair, AC install, HVAC maintenance',
    hours: 'Mon–Fri 8am–6pm, Sat 9am–2pm',
    promos: 'Free estimate • Same-day service • Financing available',
  },
  ecommerce: {
    brandName: '',
    website: '',
    heroProduct: '',
    pricePoint: '$',
    geo: 'United States',
    offer: 'Free shipping • Limited-time discount',
    proof: '⭐ 4.7/5 rating • 1,000+ customers',
  },
  b2b: {
    companyName: '',
    website: '',
    service: '',
    geo: 'United States',
    targetCustomer: 'small business owners',
    proof: 'Case study: reduced CPL by 35% in 30 days',
    bookingLink: '',
  },
};

export default function WizardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>(DEFAULTS);
  const [leadEmail, setLeadEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const plan = useMemo(() => {
    if (!state.template) return '';

    if (state.template === 'local-service') {
      const s = state.localService;
      const service0 = s.services.split(',')[0]?.trim() || 'AC repair';

      const keywordThemes = [
        `${service0} near me`,
        `${s.primaryCity || 'your city'} ${service0}`,
        `emergency ${service0}`,
        `same day ${service0}`,
      ];

      const negatives = ['jobs', 'salary', 'school', 'training', 'manual', 'pdf', 'youtube', 'diy', 'parts', 'wholesale', 'free'];

      const headlines = [
        `${s.primaryCity || 'Local'} ${service0} — Same Day`,
        `Call Now • ${s.businessName || 'Local Pros'}`,
        `Free Estimate • Upfront Pricing`,
        `Licensed & Insured`,
        `Fast Scheduling`,
      ];

      const descriptions = [
        `Need help fast? ${s.businessName || 'We'} do ${s.services}. ${s.promos}. Call now for availability.`,
        `Serving ${s.primaryCity || 'your area'} within ${s.serviceRadiusMiles} miles. Book service in minutes.`,
      ];

      return [
        `TEMPLATE: LOCAL SERVICE — GOOGLE SEARCH`,
        `GOAL: Calls + website form leads (both)`,
        `\nBUSINESS`,
        `- Name: ${s.businessName || '[Business Name]'}`,
        `- Website: ${s.website || '[Website]'}`,
        `- Phone: ${s.phone || '[Phone]'}`,
        `- Area: ${s.primaryCity || '[City]'} (${s.serviceRadiusMiles} mi radius)`,
        `- Hours: ${s.hours || '[Hours]'}`,
        `\nCAMPAIGN SETUP (simple + high intent)`,
        `- Campaign 1: Emergency / “Near me” searches (Exact + Phrase)`,
        `- Campaign 2: Core services (Exact + Phrase)`,
        `- Campaign 3: Brand (optional)`,
        `- Ad schedule: match hours`,
        `\nKEYWORDS (starter themes)`,
        ...keywordThemes.map((k) => `- ${k}`),
        `\nNEGATIVES (starter)`,
        ...negatives.map((n) => `- ${n}`),
        `\nAD TEXT (copy/paste starters)`,
        `Headlines:`,
        ...headlines.map((h) => `- ${h}`),
        `Descriptions:`,
        ...descriptions.map((d) => `- ${d}`),
        `\nTRACKING CHECKLIST`,
        `- Calls from ads enabled`,
        `- Website form submit conversion`,
        `- Optional: call tracking number on site`,
      ].join('\n');
    }

    if (state.template === 'ecommerce') {
      const s = state.ecommerce;
      return [
        `TEMPLATE: ECOMMERCE — META ADS`,
        `GOAL: Purchases`,
        `\nBRAND`,
        `- Brand: ${s.brandName || '[Brand Name]'}`,
        `- Website: ${s.website || '[Website]'}`,
        `- Hero product: ${s.heroProduct || '[Product]'}`,
        `- Price point: ${s.pricePoint || '$'}`,
        `- Geo: ${s.geo || 'United States'}`,
        `\nOFFER + PROOF`,
        `- Offer: ${s.offer || '[Offer]'}`,
        `- Proof: ${s.proof || '[Reviews/results]'}`,
        `\nCAMPAIGN SETUP (simple)`,
        `- Campaign A: Prospecting (broad + interest test)`,
        `- Campaign B: Retargeting (7–30 day site visitors)`,
        `- Budget split (starter): 80% prospecting / 20% retargeting`,
        `\nCREATIVE STARTERS (plain English)`,
        `- 10 attention-grabbing first lines`,
        `- 5 short video scripts (what to say on camera)`,
        `- 10 ad text variations (short + long)`,
        `\nTRACKING CHECKLIST`,
        `- Pixel installed`,
        `- Purchase event firing`,
        `- Verify checkout conversion tracking`,
      ].join('\n');
    }

    // b2b-high-ticket
    const s = state.b2b;
    return [
      `TEMPLATE: B2B / HIGH-TICKET — GOOGLE SEARCH`,
      `GOAL: Booked calls + qualified leads`,
      `\nBUSINESS`,
      `- Company: ${s.companyName || '[Company]'}`,
      `- Website: ${s.website || '[Website]'}`,
      `- Service: ${s.service || '[Service]'}`,
      `- Geo: ${s.geo || 'United States'}`,
      `- Target customer: ${s.targetCustomer || '[Who buys]'}`,
      `\nPROOF`,
      `- ${s.proof || '[Case study / results / years in business]'}`,
      `\nCAMPAIGN SETUP (simple)`,
      `- Campaign 1: High-intent keywords ("service + city", "service pricing", "hire")`,
      `- Campaign 2: Competitor (optional)`,
      `- Extensions: callouts, sitelinks, structured snippets`,
      `\nLANDING PAGE CHECKLIST`,
      `- Clear headline + 3 bullets`,
      `- Proof (logos/reviews/case study)`,
      `- One CTA: Book a call`,
      `Booking link: ${s.bookingLink || '[Link]'}`,
      `\nTRACKING CHECKLIST`,
      `- Call conversion`,
      `- Form conversion`,
      `- Calendar booking conversion (if possible)`,
    ].join('\n');
  }, [state]);

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
      const payload: any = { template: state.template, email: leadEmail };
      if (state.template === 'local-service') {
        payload.businessName = state.localService.businessName;
        payload.website = state.localService.website;
        payload.city = state.localService.primaryCity;
        payload.radiusMiles = state.localService.serviceRadiusMiles;
        payload.phone = state.localService.phone;
        payload.services = state.localService.services;
        payload.hours = state.localService.hours;
        payload.promos = state.localService.promos;
      } else if (state.template === 'ecommerce') {
        payload.businessName = state.ecommerce.brandName;
        payload.website = state.ecommerce.website;
        payload.services = state.ecommerce.heroProduct;
        payload.promos = `${state.ecommerce.offer} • ${state.ecommerce.proof}`;
      } else {
        payload.businessName = state.b2b.companyName;
        payload.website = state.b2b.website;
        payload.services = state.b2b.service;
        payload.promos = `${state.b2b.targetCustomer} • ${state.b2b.proof}`;
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error ?? 'Lead capture failed');

      window.location.href = '/success?session_id=demo';
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Lead capture failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="mb-8">
          <a href="/" className="text-sm text-slate-400 hover:text-slate-200 inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </a>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">Launch Ads Wizard</h1>
          <p className="mt-2 text-slate-400 max-w-2xl">
            Pick your business type, answer a few questions, then review and approve a ready-to-use launch plan.
          </p>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <TemplateCard
              icon={<PhoneCall className="h-6 w-6" />}
              title="Local Service"
              subtitle="Google Search — calls + form leads"
              bullets={['Best for plumbers, HVAC, dental, roofing', 'High-intent traffic', 'Tracks calls + forms']}
              onClick={() => selectTemplate('local-service')}
              highlight
            />
            <TemplateCard
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Online Store"
              subtitle="Meta Ads — purchases"
              bullets={['Simple prospecting + retargeting', 'Ad text + video script starters', 'Tracking checklist']}
              onClick={() => selectTemplate('ecommerce')}
            />
            <TemplateCard
              icon={<BriefcaseBusiness className="h-6 w-6" />}
              title="B2B / High-Ticket"
              subtitle="Google Search — booked calls"
              bullets={['Bottom-funnel intent', 'Landing page checklist', 'Track calls + forms']}
              onClick={() => selectTemplate('b2b-high-ticket')}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-8">
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="text-lg font-bold">Quick questions</div>
                <div className="mt-1 text-sm text-slate-400">We keep this short on purpose.</div>

                {state.template === 'local-service' ? (
                  <div className="mt-6 grid gap-4">
                    <Field label="Business name" value={state.localService.businessName} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, businessName: v } }))} placeholder="Roanoke AC Pros" />
                    <Field label={<span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Website</span>} value={state.localService.website} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, website: v } }))} placeholder="https://yourbusiness.com" />
                    <Field label={<span className="inline-flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Phone</span>} value={state.localService.phone} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, phone: v } }))} placeholder="(555) 555-5555" />
                    <Field label={<span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Primary city</span>} value={state.localService.primaryCity} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, primaryCity: v } }))} placeholder="Roanoke, VA" />
                    <NumberField label="Service radius (miles)" value={state.localService.serviceRadiusMiles} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, serviceRadiusMiles: v } }))} />
                    <TextArea label="Top services" value={state.localService.services} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, services: v } }))} placeholder="AC repair, HVAC install, maintenance" />
                    <Field label={<span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> Hours</span>} value={state.localService.hours} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, hours: v } }))} placeholder="Mon–Fri 8–6" />
                    <TextArea label={<span className="inline-flex items-center gap-2"><BadgePercent className="h-4 w-4" /> Promos / differentiators</span>} value={state.localService.promos} onChange={(v) => setState((p) => ({ ...p, localService: { ...p.localService, promos: v } }))} placeholder="Free estimate • Same-day service" />
                  </div>
                ) : null}

                {state.template === 'ecommerce' ? (
                  <div className="mt-6 grid gap-4">
                    <Field label="Brand name" value={state.ecommerce.brandName} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, brandName: v } }))} placeholder="GlowSkin" />
                    <Field label={<span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Website</span>} value={state.ecommerce.website} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, website: v } }))} placeholder="https://yourstore.com" />
                    <Field label="Main product" value={state.ecommerce.heroProduct} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, heroProduct: v } }))} placeholder="Vitamin C Serum" />
                    <Field label="Typical price" value={state.ecommerce.pricePoint} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, pricePoint: v } }))} placeholder="$29" />
                    <Field label={<span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Where do you sell?</span>} value={state.ecommerce.geo} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, geo: v } }))} placeholder="United States" />
                    <TextArea label={<span className="inline-flex items-center gap-2"><BadgePercent className="h-4 w-4" /> Offer</span>} value={state.ecommerce.offer} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, offer: v } }))} placeholder="Free shipping • 20% off" />
                    <TextArea label="Proof (reviews/results)" value={state.ecommerce.proof} onChange={(v) => setState((p) => ({ ...p, ecommerce: { ...p.ecommerce, proof: v } }))} placeholder="4.8 stars • 2,000+ customers" />
                  </div>
                ) : null}

                {state.template === 'b2b-high-ticket' ? (
                  <div className="mt-6 grid gap-4">
                    <Field label="Company name" value={state.b2b.companyName} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, companyName: v } }))} placeholder="Acme Growth" />
                    <Field label={<span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Website</span>} value={state.b2b.website} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, website: v } }))} placeholder="https://acme.com" />
                    <Field label="What do you sell?" value={state.b2b.service} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, service: v } }))} placeholder="Google Ads management" />
                    <Field label={<span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> Geo</span>} value={state.b2b.geo} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, geo: v } }))} placeholder="United States" />
                    <Field label="Ideal customer" value={state.b2b.targetCustomer} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, targetCustomer: v } }))} placeholder="HVAC companies doing $30k+/mo" />
                    <TextArea label="Proof (case study/results)" value={state.b2b.proof} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, proof: v } }))} placeholder="Reduced CPA from $120 → $65" />
                    <Field label="Booking link (optional)" value={state.b2b.bookingLink} onChange={(v) => setState((p) => ({ ...p, b2b: { ...p.b2b, bookingLink: v } }))} placeholder="https://calendly.com/..." />
                  </div>
                ) : null}

                <div className="mt-6 flex gap-3">
                  <button onClick={back} className="rounded-md border border-slate-700 px-4 py-2 text-sm">
                    Back
                  </button>
                  <button
                    onClick={next}
                    className="rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 inline-flex items-center gap-2"
                  >
                    Review plan <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
                <div className="text-lg font-bold">Preview</div>
                <div className="mt-2 text-sm text-slate-400">This updates as you type.</div>
                <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-200 max-h-[520px] overflow-auto rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  {plan}
                </pre>
              </div>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold">Review & Approve</div>
                  <div className="mt-1 text-sm text-slate-400">
                    Copy/paste this plan or approve to save it to your lead record.
                  </div>
                </div>
                <button
                  onClick={() => void copy(plan)}
                  className="rounded-md border border-slate-700 px-3 py-2 text-sm inline-flex items-center gap-2"
                >
                  <Clipboard className="h-4 w-4" /> Copy
                </button>
              </div>

              <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-200 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                {plan}
              </pre>

              <div className="mt-6 flex gap-3">
                <button onClick={back} className="rounded-md border border-slate-700 px-4 py-2 text-sm">
                  Back
                </button>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="text-sm font-medium text-slate-200">Email (required)</div>
                  <input
                    className="w-full rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-50 placeholder:text-slate-600"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                  {submitError ? <div className="text-sm text-red-300">{submitError}</div> : null}
                  <button
                    onClick={() => void submitLead()}
                    disabled={submitting || !leadEmail}
                    className="rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 px-4 py-2 text-sm font-bold text-slate-950 inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting…' : 'Approve (demo)'} <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
              <div className="text-lg font-bold">What happens next</div>
              <div className="mt-2 text-sm text-slate-400">
                In demo mode, we save your info and show you the generator. When payments are enabled, “Approve” will also
                publish the setup after you connect your accounts.
              </div>
              <ul className="mt-4 text-sm text-slate-300 space-y-2">
                <li>• You’ll get a copy of the plan + next steps</li>
                <li>• Connect Google Ads / Meta when prompted</li>
                <li>• Review everything before it goes live</li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Choose template' },
    { n: 2, label: 'Answer questions' },
    { n: 3, label: 'Review & approve' },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4">
      {steps.map((s) => (
        <div
          key={s.n}
          className={`flex-1 rounded-xl border px-4 py-3 ${
            s.n === step ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/30'
          }`}
        >
          <div className="text-xs font-semibold tracking-wide uppercase text-slate-400">Step {s.n}</div>
          <div className="mt-1 font-bold">{s.label}</div>
        </div>
      ))}
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
      className={`text-left rounded-2xl border p-6 transition-colors ${
        highlight ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-950/50 border border-slate-800 flex items-center justify-center text-emerald-400">
          {icon}
        </div>
        <div>
          <div className="font-bold text-lg">{title}</div>
          <div className="text-sm text-slate-400">{subtitle}</div>
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-400" /> {b}
          </li>
        ))}
      </ul>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-md">
        Start <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-200">{label}</div>
      <input
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-50 placeholder:text-slate-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: React.ReactNode;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-200">{label}</div>
      <input
        type="number"
        className="mt-2 w-full rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-50"
        value={value}
        min={1}
        max={250}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div className="text-sm font-medium text-slate-200">{label}</div>
      <textarea
        className="mt-2 w-full min-h-[92px] rounded-md border border-slate-700 bg-slate-950/60 p-2 text-slate-50 placeholder:text-slate-600"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
