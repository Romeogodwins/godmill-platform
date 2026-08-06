"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import BookingForm from "../components/booking/BookingForm";
import BookingSummary from "../components/booking/BookingSummary";
import type { BookingErrors, BookingFormState } from "../components/booking/types";
import { supabase } from "../../lib/supabase";

const initialForm: BookingFormState = {
  checkIn: "",
  checkOut: "",
  adults: "2",
  children: "0",
  roomType: "Executive Room",
  aircon: "Aircon",
  breakfast: false,
  guestName: "",
  email: "",
  phone: "",
  specialRequests: "",
};

const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validatePhone = (value: string) => /^\+?[0-9\s()-]{7,15}$/.test(value.replace(/\s/g, ""));

export default function BookingPage() {
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const validate = (values: BookingFormState) => {
    const nextErrors: BookingErrors = {};

    if (!values.checkIn) {
      nextErrors.checkIn = "Please select a check-in date.";
    }

    if (!values.checkOut) {
      nextErrors.checkOut = "Please select a check-out date.";
    } else if (values.checkIn && values.checkOut <= values.checkIn) {
      nextErrors.checkOut = "Check-out must be after check-in.";
    }

    const adults = Number(values.adults);
    if (!values.adults || Number.isNaN(adults) || adults < 1) {
      nextErrors.adults = "Please enter at least one adult.";
    }

    const children = Number(values.children);
    if (Number.isNaN(children) || children < 0) {
      nextErrors.children = "Children must be zero or more.";
    }

    if (!values.guestName.trim()) {
      nextErrors.guestName = "Please enter the guest name.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Please enter your email address.";
    } else if (!validateEmail(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone = "Please enter your contact number.";
    } else if (!validatePhone(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }

    if (values.roomType !== "Executive Room" && !values.aircon) {
      nextErrors.aircon = "Please choose an air-conditioning option.";
    }

    return nextErrors;
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checkbox = event.target as HTMLInputElement;
      setForm((current) => ({ ...current, [name]: checkbox.checked }));
    } else {
      setForm((current) => ({ ...current, [name]: value }));
    }

    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      setFeedback("Please complete the highlighted fields before submitting.");
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const adults = Number(form.adults);
      const children = Number(form.children || 0);
      const checkIn = new Date(form.checkIn);
      const checkOut = new Date(form.checkOut);
      const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

      const roomRate =
        form.roomType === "Standard Double" || form.roomType === "Family 3 Sleeper"
          ? form.aircon === "Non-Aircon"
            ? form.roomType === "Standard Double"
              ? 500
              : 750
            : form.roomType === "Standard Double"
              ? 600
              : 850
          : 750;

      const roomTotal = nights * roomRate;
      const breakfastTotal = form.breakfast ? (adults + children) * 120 : 0;
      const grandTotal = roomTotal + breakfastTotal;
      const bookingReference = `GMC-${Date.now().toString().slice(-6)}`;

      const { error } = await supabase.from("Bookings").insert({
        booking_reference: bookingReference,
        guest_name: form.guestName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        room_type: form.roomType,
        aircon: form.roomType === "Executive Room" ? "Aircon" : form.aircon,
        adults,
        children,
        breakfast: form.breakfast,
        check_in: form.checkIn,
        check_out: form.checkOut,
        nights,
        room_total: roomTotal,
        breakfast_total: breakfastTotal,
        grand_total: grandTotal,
        status: "Pending",
      });

      if (error) {
        throw error;
      }

      setSubmitted(true);
      setFeedback(`Booking submitted successfully. Reference: ${bookingReference}`);
    } catch (error) {
      console.error(error);
      setSubmitted(false);
      setFeedback("We could not save your booking right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      const message = [
        `Guest Name: ${form.guestName}`,
        `Check-in: ${form.checkIn}`,
        `Check-out: ${form.checkOut}`,
        `Room Type: ${form.roomType}`,
        `Adults: ${form.adults}`,
        `Children: ${form.children}`,
        `Breakfast: ${form.breakfast ? "Yes" : "No"}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Special Requests: ${form.specialRequests || "None"}`,
      ].join("\n");

      const encoded = encodeURIComponent(message);
      window.open(`https://wa.me/27790582637?text=${encoded}`, "_blank", "noopener,noreferrer");
      setSubmitted(true);
      return;
    }

    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_rgba(212,177,111,0.16),_transparent_55%)] px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-[0.3em] text-[#d4b16f]">
            GODMILL CITY
          </Link>
          <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10">
            Back to homepage
          </Link>
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="max-w-3xl rounded-[2rem] border border-white/10 bg-[#101010]/90 p-8 shadow-2xl shadow-black/20 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-[#d4b16f]">
              Booking engine
            </p>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Reserve a luxury stay with confidence.
            </h1>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              Choose your dates, room and preferences, then review the live price and booking summary before sending your request.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Executive, Standard & Family rooms</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Breakfast from R120 per person</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Instant WhatsApp booking</span>
            </div>
          </div>

          <div className="lg:pl-4">
            <BookingSummary form={form} errors={errors} submitted={submitted} />
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {feedback ? (
            <div className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${feedback.includes("success") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
              {feedback}
            </div>
          ) : null}

          <BookingForm
            form={form}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onWhatsApp={handleWhatsApp}
            submitted={submitted}
            isSubmitting={isSubmitting}
          />
        </div>
      </section>
    </main>
  );
}
