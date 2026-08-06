import type { BookingErrors, BookingFormState } from "./types";
import PriceCalculator from "./PriceCalculator";

interface BookingSummaryProps {
  form: BookingFormState;
  errors: BookingErrors;
  submitted: boolean;
}

export default function BookingSummary({ form, errors, submitted }: BookingSummaryProps) {
  const hasRequiredFields =
    form.checkIn &&
    form.checkOut &&
    form.adults &&
    form.guestName &&
    form.email &&
    form.phone &&
    !errors.checkIn &&
    !errors.checkOut &&
    !errors.adults &&
    !errors.guestName &&
    !errors.email &&
    !errors.phone;

  return (
    <aside className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#111111] to-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">
            Booking summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            {submitted ? "Request prepared" : "Review your stay"}
          </h2>
        </div>
        <div className="rounded-full border border-[#d4b16f]/40 bg-[#d4b16f]/10 px-3 py-1 text-sm font-semibold text-[#d4b16f]">
          {submitted ? "Confirmed" : "Pending"}
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm text-gray-300">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Guest</p>
          <p className="mt-2 font-semibold text-white">
            {form.guestName || "Your guest name"}
          </p>
          <p className="mt-1">{form.email || "your@email.com"}</p>
          <p>{form.phone || "+27 000 000 000"}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Stay details</p>
          <div className="mt-2 flex justify-between">
            <span>Check-in</span>
            <span className="font-semibold text-white">{form.checkIn || "Select date"}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Check-out</span>
            <span className="font-semibold text-white">{form.checkOut || "Select date"}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span>Guests</span>
            <span className="font-semibold text-white">
              {Number(form.adults || 0)} adult{Number(form.adults || 0) === 1 ? "" : "s"}
              {form.children ? `, ${form.children} child${Number(form.children) === 1 ? "" : "ren"}` : ""}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Room preference</p>
          <p className="mt-2 font-semibold text-white">{form.roomType}</p>
          <p>{form.roomType === "Executive Room" ? "Executive comfort and privacy" : form.aircon}</p>
        </div>
      </div>

      <div className="mt-6">
        <PriceCalculator form={form} />
      </div>

      <div className="mt-6 rounded-2xl border border-[#d4b16f]/20 bg-[#d4b16f]/10 p-4 text-sm text-gray-200">
        {hasRequiredFields ? (
          <p>
            Your reservation request is ready. Confirm it below to share the details with the guesthouse.
          </p>
        ) : (
          <p>
            Complete the highlighted fields to unlock a fully validated booking summary.
          </p>
        )}
      </div>
    </aside>
  );
}
