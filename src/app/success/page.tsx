import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, PartyPopper, ShieldCheck, Sparkles } from 'lucide-react';
import { getEnv } from '@/lib/env';
import { getStripe } from '@/lib/stripe';
import { SiteFooter } from '@/components/SiteFooter';
import { Logo } from '@/components/Logo';

export const metadata = {
  title: 'Purchase Confirmed',
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  const env = getEnv();
  const demoMode = env.DEMO_MODE === 'true';

  let paid = demoMode || session_id === 'demo';
  let idForDisplay = session_id ?? '';

  if (!paid && session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === 'paid';
      idForDisplay = session.id;
    } catch {
      // If Stripe env vars are missing (build/preview) or the id is invalid,
      // fall through to the "almost there" state instead of crashing.
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 overflow-x-hidden relative flex flex-col">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[40rem] max-w-7xl pointer-events-none">
        <div className="absolute top-0 left-0 md:left-20 w-[40rem] h-[25rem] bg-cyan-500/10 rounded-full blur-[130px] mix-blend-screen" />
        <div className="absolute top-20 right-0 md:right-20 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[130px] mix-blend-screen" />
      </div>

      <header className="container mx-auto px-4 md:px-6 py-8 relative z-10">
        <Logo />
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-3xl relative z-10 flex-1">
        {!session_id ? (
          <StatusCard
            title="Missing checkout session"
            body="We didn't receive a checkout session id. If you just paid, use the link from your receipt email — or head back and try again."
          />
        ) : paid ? (
          <div className="relative group">
            <div className="absolute -inset-1 premium-gradient rounded-3xl blur opacity-25 pointer-events-none" />
            <div className="relative glass-card rounded-3xl p-8 md:p-12 border border-white/10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-8">
                <PartyPopper className="h-4 w-4" /> Payment confirmed
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                You&apos;re in. Let&apos;s build your <span className="premium-text-gradient">Creative Pack</span>.
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                Answer a few prompts about your business and we&apos;ll generate your complete ad starter
                kit — hooks, video scripts, copy variants, and a step-by-step launch plan.
              </p>

              <div className="grid gap-4 mb-10">
                <NextStep icon={<Sparkles className="h-4 w-4 text-cyan-400" />} text="You review everything first — nothing publishes without your approval." />
                <NextStep icon={<FileText className="h-4 w-4 text-violet-400" />} text="Everything is copy/paste-ready for Meta, Google, and TikTok." />
                <NextStep icon={<ShieldCheck className="h-4 w-4 text-orange-400" />} text="Lifetime access — regenerate whenever your offer changes." />
              </div>

              <Link
                href={`/generate?session_id=${encodeURIComponent(idForDisplay)}`}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto premium-gradient hover-glow text-white px-10 py-5 rounded-full font-extrabold text-lg transition-all transform hover:scale-105 shadow-[0_0_40px_rgba(6,182,212,0.4)] border border-white/20"
              >
                Generate my Creative Pack <ArrowRight className="w-5 h-5" />
              </Link>

              <p className="mt-8 text-xs text-slate-500 font-medium">
                Session: <span className="text-slate-400">{idForDisplay}</span>
              </p>
            </div>
          </div>
        ) : (
          <StatusCard
            title="Almost there"
            body="Your payment hasn't been confirmed yet. If you just paid, give it a few seconds and refresh this page. If the problem persists, reply to your Stripe receipt email and we'll sort it out."
          />
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function NextStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 items-center text-sm font-medium text-slate-300">
      <div className="p-1.5 rounded-full bg-white/5 border border-white/10 shrink-0">{icon}</div>
      {text}
    </div>
  );
}

function StatusCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">{title}</h1>
      <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">{body}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 premium-gradient text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 border border-white/20"
        >
          Back to home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/wizard"
          className="inline-flex items-center justify-center gap-2 glass-card border border-white/10 hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold transition-all"
        >
          Try the free Ads Wizard <CheckCircle2 className="w-4 h-4 text-cyan-400" />
        </Link>
      </div>
    </div>
  );
}
