import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for MediaBuyerPro.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-50">
      <main className="container mx-auto px-4 md:px-6 py-16 max-w-3xl">
        <Link
          href="/"
          className="group text-sm font-semibold text-slate-400 hover:text-white inline-flex items-center gap-2 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-white/10 mb-10"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to home
        </Link>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 font-medium mb-12">Last updated: July 2026</p>

        <div className="space-y-10 text-slate-300 leading-relaxed font-medium">
          <Section title="1. What we collect">
            We collect the information you type into the product: your email address (if provided),
            business details you enter in the wizard or generator (business name, website, services,
            offers), and the website URL you ask us to analyze.
          </Section>
          <Section title="2. How we use it">
            Business details are sent to our AI provider solely to generate your strategy and creative
            content. Your email is used to deliver receipts and, if you opt in, product updates. We do
            not sell your data.
          </Section>
          <Section title="3. Payments">
            Payments are processed by Stripe. Your card details go directly to Stripe and never touch
            our servers. See Stripe&apos;s privacy policy for how they handle payment data.
          </Section>
          <Section title="4. Third-party services">
            We use OpenAI to generate content and Stripe to process payments. Inputs you provide may be
            processed by these providers under their respective data-processing terms.
          </Section>
          <Section title="5. Data retention">
            Generated content is returned to you and not stored on our servers. Lead information you
            submit is stored so we can follow up with your results.
          </Section>
          <Section title="6. Your rights">
            You can request deletion of any data we hold about you by contacting us at the email on
            your receipt.
          </Section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-black text-white mb-3">{title}</h2>
      <p className="text-slate-400">{children}</p>
    </section>
  );
}
