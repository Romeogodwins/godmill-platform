import type { ChangeEvent, FormEvent } from "react";
import DatePicker from "./DatePicker";
import type { BookingErrors, BookingFormState } from "./types";

interface BookingFormProps {
  form: BookingFormState;
  errors: BookingErrors;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onWhatsApp: () => void;
  submitted: boolean;
  isSubmitting?: boolean;
}

export default function BookingForm({
  form,
  errors,
  onChange,
  onSubmit,
  onWhatsApp,
  submitted,
  isSubmitting = false,
}: BookingFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] border border-white/10 bg-[#101010]/90 p-6 shadow-2xl shadow-black/20 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">
            Luxury reservation
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">
            Reserve your stay at Godmill City Guesthouse
          </h1>
        </div>
        <div className="rounded-full border border-[#d4b16f]/30 bg-[#d4b16f]/10 px-4 py-2 text-sm font-semibold text-[#d4b16f]">
          {submitted ? "Request ready" : "Secure your dates"}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <DatePicker
              id="checkIn"
              label="Check-in date"
              name="checkIn"
              value={form.checkIn}
              onChange={onChange}
              error={errors.checkIn}
            />
            <DatePicker
              id="checkOut"
              label="Check-out date"
              name="checkOut"
              value={form.checkOut}
              onChange={onChange}
              min={form.checkIn}
              error={errors.checkOut}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="adults" className="mb-2 block text-sm font-semibold text-gray-200">
                Adults
              </label>
              <input
                id="adults"
                name="adults"
                type="number"
                min="1"
                value={form.adults}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              />
              {errors.adults ? <p className="mt-2 text-sm text-red-400">{errors.adults}</p> : null}
            </div>
            <div>
              <label htmlFor="children" className="mb-2 block text-sm font-semibold text-gray-200">
                Children
              </label>
              <input
                id="children"
                name="children"
                type="number"
                min="0"
                value={form.children}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              />
              {errors.children ? <p className="mt-2 text-sm text-red-400">{errors.children}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="roomType" className="mb-2 block text-sm font-semibold text-gray-200">
              Room type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={form.roomType}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
            >
              <option value="Executive Room">Executive Room</option>
              <option value="Standard Double">Standard Double</option>
              <option value="Family 3 Sleeper">Family 3 Sleeper</option>
            </select>
          </div>

          {form.roomType !== "Executive Room" ? (
            <div>
              <label htmlFor="aircon" className="mb-2 block text-sm font-semibold text-gray-200">
                Air-conditioning preference
              </label>
              <select
                id="aircon"
                name="aircon"
                value={form.aircon}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              >
                <option value="Aircon">Aircon</option>
                <option value="Non-Aircon">Non-Aircon</option>
              </select>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#d4b16f]/20 bg-[#d4b16f]/10 p-4 text-sm text-gray-300">
              Executive rooms are offered with premium climate control and do not require a separate air-conditioning selection.
            </div>
          )}

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm text-gray-200">
            <input
              name="breakfast"
              type="checkbox"
              checked={form.breakfast}
              onChange={onChange}
              className="h-4 w-4 rounded border-white/20 bg-transparent"
            />
            Add breakfast for R120 per person
          </label>
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor="guestName" className="mb-2 block text-sm font-semibold text-gray-200">
              Guest name
            </label>
            <input
              id="guestName"
              name="guestName"
              type="text"
              value={form.guestName}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
            />
            {errors.guestName ? <p className="mt-2 text-sm text-red-400">{errors.guestName}</p> : null}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
            />
            {errors.email ? <p className="mt-2 text-sm text-red-400">{errors.email}</p> : null}
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-200">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
            />
            {errors.phone ? <p className="mt-2 text-sm text-red-400">{errors.phone}</p> : null}
          </div>

          <div>
            <label htmlFor="specialRequests" className="mb-2 block text-sm font-semibold text-gray-200">
              Special requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={form.specialRequests}
              onChange={onChange}
              rows={4}
              className="w-full rounded-2xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-white outline-none transition focus:border-[#d4b16f]"
              placeholder="Late arrival, extra towels, airport transfer, etc."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onWhatsApp}
          className="rounded-full bg-[#25D366] px-6 py-3 text-center font-semibold text-white transition hover:bg-[#1fb75f]"
        >
          Book via WhatsApp
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-[#d4b16f] px-6 py-3 text-center font-semibold text-black transition hover:bg-[#e2c486] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Submit Booking Request"}
        </button>
      </div>
    </form>
  );
}
