import Link from 'next/link';
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

  let paid = false;
  let idForDisplay = session_id;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);
    paid = session.payment_status === 'paid';
    idForDisplay = session.id;
  } catch {
    // If Stripe env vars are missing in build/preview, render a helpful page.
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-3xl font-semibold">Payment {paid ? 'confirmed' : 'pending'}</h1>
      <p className="mt-2 text-sm text-neutral-600">Session: {idForDisplay}</p>

      {paid ? (
        <div className="mt-6">
          <p className="mb-4">You’re in. Generate your Creative Pack now.</p>
          <Link
            className="rounded-md bg-black px-4 py-2 text-white"
            href={`/generate?session_id=${encodeURIComponent(idForDisplay)}`}
          >
            Go to generator
          </Link>
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
