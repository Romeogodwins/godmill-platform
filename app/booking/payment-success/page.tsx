import Link from "next/link";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    booking?: string;
  }>;
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const params = await searchParams;

  const bookingReference =
    params.booking || "Your booking";

  const whatsappMessage = encodeURIComponent(
    `Hello Godmill City Guesthouse. I have completed payment for booking ${bookingReference}.`
  );

  return (
    <main className="min-h-screen bg-[#080808] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.25em] text-[#d4b16f]"
          >
            GODMILL CITY
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#101010] p-8 text-center shadow-2xl md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-10 w-10 text-emerald-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.35em] text-[#d4b16f]">
            Payment successful
          </p>

          <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
            Your stay is secured.
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-gray-300">
            Thank you for choosing Godmill City Guesthouse.
            Your payment has been received and your reservation
            is being confirmed.
          </p>

          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-[#d4b16f]/20 bg-[#d4b16f]/10 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
              Booking reference
            </p>

            <p className="mt-3 text-2xl font-semibold text-[#e4c888]">
              {bookingReference}
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold">
              What happens next?
            </h2>

            <div className="mt-5 space-y-4 text-sm leading-6 text-gray-300">
              <div className="flex gap-3">
                <span className="font-semibold text-emerald-400">
                  ✓
                </span>
                <span>
                  Your payment has been submitted successfully.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-emerald-400">
                  ✓
                </span>
                <span>
                  Keep your booking reference for your records.
                </span>
              </div>

              <div className="flex gap-3">
                <span className="font-semibold text-emerald-400">
                  ✓
                </span>
                <span>
                  Godmill City Guesthouse will have your
                  reservation details available for check-in.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="rounded-full bg-[#d4b16f] px-7 py-3 font-semibold text-black transition hover:bg-[#e4c888]"
            >
              Return to homepage
            </Link>

            <a
              href={`https://wa.me/27790582637?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-7 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              Contact us on WhatsApp
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          Godmill City Guesthouse • Secure online booking
        </p>
      </div>
    </main>
  );
}