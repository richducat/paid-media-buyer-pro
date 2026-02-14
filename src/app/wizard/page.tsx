'use client';

import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clipboard,
  PhoneCall,
  ShoppingCart,
  BriefcaseBusiness,
  MapPin,
  Clock,
  Globe,
  BadgePercent,
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

type WizardState = {
  template: TemplateKey | null;
  localService: LocalServiceIntake;
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
};

export default function WizardPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>(DEFAULTS);
  const [leadEmail, setLeadEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const plan = useMemo(() => {
    if (state.template !== 'local-service') return '';
    const s = state.localService;

    const keywordThemes = [
      `${s.services.split(',')[0]?.trim() || 'AC repair'} near me`,
      `${s.primaryCity || 'your city'} ${s.services.split(',')[0]?.trim() || 'AC repair'}`,
      `emergency ${s.services.split(',')[0]?.trim() || 'AC repair'}`,
      `24 hour ${s.services.split(',')[0]?.trim() || 'AC repair'}`,
    ];

    const negatives = [
      'jobs',
      'salary',
      'school',
      'training',
      'manual',
      'pdf',
      'youtube',
      'diy',
      'parts',
      'wholesale',
      'free',
    ];

    const headlines = [
      `${s.primaryCity || 'Local'} ${s.services.split(',')[0]?.trim() || 'AC Repair'} — Same Day`,
      `Licensed & Insured • ${s.businessName || 'Local Pros'}`,
      `Call Now For Fast Service`,
      `Free Estimate • Upfront Pricing`,
      `Repair • Install • Maintenance`,
      `Emergency Service Available`,
    ];

    const descriptions = [
      `Need help fast? ${s.businessName || 'We'} provide ${s.services}. ${s.promos}. Call now for availability.`,
      `Local technicians serving ${s.primaryCity || 'your area'} within ${s.serviceRadiusMiles} miles. Book service in minutes.`,
    ];

    return [
      `LOCAL SERVICE (GOOGLE SEARCH) — LAUNCH PLAN (Calls + Form Leads)`,
      `Business: ${s.businessName || '[Business Name]'}
Website: ${s.website || '[Website]'}
Phone: ${s.phone || '[Phone]'}
Primary area: ${s.primaryCity || '[City]'} (${s.serviceRadiusMiles} mi radius)
Hours: ${s.hours || '[Hours]'}`,
      `GOALS`,
      `- Primary: Calls (call extensions + call reporting)
- Secondary: Form leads (website form conversion)` ,
      `CAMPAIGN STRUCTURE`,
      `- Campaign 1: “Emergency / High Intent” (exact + phrase)
- Campaign 2: “Core Services” (exact + phrase)
- Campaign 3: “Brand” (if applicable)
- Ad schedule: match business hours; optional after-hours with call-only off`,
      `TARGETING DEFAULTS`,
      `- Location: ${s.primaryCity || '[City]'} + ${s.serviceRadiusMiles} mi radius
- Presence: “People in or regularly in your targeted locations”
- Devices: start all; monitor mobile call rate`,
      `KEYWORD THEMES (STARTER)`,
      keywordThemes.map((k) => `- ${k}`).join('\n'),
      `NEGATIVE KEYWORDS (STARTER)`,
      negatives.map((n) => `- ${n}`).join('\n'),
      `ADS (STARTER ASSETS)`,
      `Headlines:\n${headlines.map((h) => `- ${h}`).join('\n')}`,
      `Descriptions:\n${descriptions.map((d) => `- ${d}`).join('\n')}`,
      `EXTENSIONS`,
      `- Call extension (use ${s.phone || '[Phone]'})
- Location (connect Google Business Profile)
- Sitelinks: Services, Financing, Reviews, Contact
- Callouts: Same-Day, Licensed & Insured, Financing, Free Estimate`,
      `TRACKING CHECKLIST`,
      `- Calls from ads (call reporting on)
- Calls from website (optional: call tracking number)
- Form submission conversion (thank-you page or event)
- Optional: lead quality tagging (booked job / estimate)`,
      `LAUNCH CHECK`,
      `- Review geo + hours + phone
- Verify landing page has click-to-call + simple form
- Set a starter daily budget and run for 7 days before major changes`,
    ].join('\n\n');
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
      const payload = {
        template: state.template,
        businessName: state.localService.businessName,
        website: state.localService.website,
        city: state.localService.primaryCity,
        radiusMiles: state.localService.serviceRadiusMiles,
        phone: state.localService.phone,
        services: state.localService.services,
        hours: state.localService.hours,
        promos: state.localService.promos,
        email: leadEmail,
      };

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
            Choose a template, answer a handful of questions, then review and approve your launch plan.
          </p>
        </div>

        <Stepper step={step} />

        {step === 1 ? (
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <TemplateCard
              icon={<PhoneCall className="h-6 w-6" />}
              title="Local Service"
              subtitle="Google Search — calls + lead forms"
              bullets={['High-intent “near me” traffic', 'Geo + schedule defaults', 'Calls + forms tracked']}
              onClick={() => selectTemplate('local-service')}
              highlight
            />
            <TemplateCard
              icon={<ShoppingCart className="h-6 w-6" />}
              title="Ecommerce"
              subtitle="Meta — purchases (coming next)"
              bullets={['Prospecting + retargeting', 'Creative testing plan', 'Offer + angle generator']}
              onClick={() => selectTemplate('ecommerce')}
            />
            <TemplateCard
              icon={<BriefcaseBusiness className="h-6 w-6" />}
              title="B2B High-Ticket"
              subtitle="Google Search — book a call (coming next)"
              bullets={['Bottom-funnel intent capture', 'Objection-led ad copy', 'Call booking tracking']}
              onClick={() => selectTemplate('b2b-high-ticket')}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-8">
            {state.template !== 'local-service' ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="text-lg font-bold">This template is next.</div>
                <div className="mt-2 text-slate-400">
                  For now, ship Local Service first. We’ll plug in Ecommerce + B2B right after.
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={back} className="rounded-md border border-slate-700 px-4 py-2 text-sm">
                    Back
                  </button>
                  <button
                    onClick={() => selectTemplate('local-service')}
                    className="rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950"
                  >
                    Use Local Service
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                  <div className="text-lg font-bold">Local Service Intake</div>
                  <div className="mt-1 text-sm text-slate-400">Default plan optimizes for both calls and form leads.</div>

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
                  <div className="text-lg font-bold">Live Preview</div>
                  <div className="mt-2 text-sm text-slate-400">This updates as you type.</div>
                  <pre className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-slate-200 max-h-[520px] overflow-auto rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    {plan}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/30 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-bold">Review & Approve</div>
                  <div className="mt-1 text-sm text-slate-400">Copy this into your build sheet or hand it to a VA.</div>
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
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-slate-200">Email (required — we’ll send updates)</div>
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
              <div className="text-lg font-bold">Next automation</div>
              <div className="mt-2 text-sm text-slate-400">
                After Stripe is enabled, “Approve” will create assets + publish once connected accounts are authorized.
              </div>
              <ul className="mt-4 text-sm text-slate-300 space-y-2">
                <li>• Connect Google Ads + GA4 conversions</li>
                <li>• Create campaigns + ad groups from the plan</li>
                <li>• Push ads + extensions</li>
                <li>• Write conversion tracking checklist to the dashboard</li>
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
            s.n === step
              ? 'border-emerald-500/60 bg-emerald-500/10'
              : 'border-slate-800 bg-slate-950/30'
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
        highlight
          ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15'
          : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/60'
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

function NumberField({ label, value, onChange }: { label: React.ReactNode; value: number; onChange: (v: number) => void }) {
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
