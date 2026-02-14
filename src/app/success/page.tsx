import Link from 'next/link';
import { getEnv } from '@/lib/env';
import { getStripe } from '@/lib/stripe';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-semibold">Missing session</h1>
        <p className="mt-2">We didn’t receive a checkout session id.</p>
        <Link className="mt-6 inline-block underline" href="/">
          Back to home
        </Link>
      </main>
    );
  }

  const env = getEnv();
  const demoMode = env.DEMO_MODE === 'true';

  let paid = demoMode;
  let idForDisplay = session_id;

  if (!demoMode && session_id !== 'demo') {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === 'paid';
      idForDisplay = session.id;
    } catch {
      // If Stripe env vars are missing in build/preview, render a helpful page.
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">{paid ? "You're in" : 'Almost there'}</h1>
      <p className="mt-2 text-sm text-neutral-600">Session: {idForDisplay}</p>

      {paid ? (
        <div className="mt-6 space-y-4">
          <p>
            Next step: answer a few prompts and we’ll generate your ad starter kit (ad text + video scripts + a simple
            launch plan).
          </p>
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="font-semibold">What happens next</div>
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700 space-y-1">
              <li>You review everything first (nothing publishes without approval).</li>
              <li>You get copy/paste-ready ads and a simple setup checklist.</li>
              <li>In demo mode, this shows the full flow even without payments enabled.</li>
            </ul>
          </div>
          <Link
            className="inline-block rounded-md bg-black px-4 py-2 text-white"
            href={`/generate?session_id=${encodeURIComponent(idForDisplay)}`}
          >
            Generate my ad kit
          </Link>
          <div>
            <Link className="underline text-sm" href="/wizard">
              Back to Wizard
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <p className="mb-4">If you just paid, give it a moment then refresh.</p>
          <Link className="underline" href="/">
            Back to home
          </Link>
        </div>
      )}
    </main>
  );
}
