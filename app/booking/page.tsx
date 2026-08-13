"use client";

import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import BookingForm from "../components/booking/BookingForm";
import BookingSummary from "../components/booking/BookingSummary";
import type {
  BookingErrors,
  BookingFormState,
} from "../components/booking/types";

type AvailableRoom = {
  id: string;
  room_number?: string;
  room_type?: string;
};

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

const validateEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePhone = (value: string) =>
  /^\+?[0-9\s()-]{7,15}$/.test(value.trim());

export default function BookingPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<BookingErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableRoom, setAvailableRoom] =
    useState<AvailableRoom | null>(null);
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
      nextErrors.aircon =
        "Please choose an air-conditioning option.";
    }

    return nextErrors;
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checkbox = event.target as HTMLInputElement;

      setForm((current) => ({
        ...current,
        [name]: checkbox.checked,
      }));
    } else {
      setForm((current) => ({
        ...current,
        [name]: value,
      }));
    }

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setAvailableRoom(null);
    setFeedback(null);
    setSubmitted(false);
  };

  const checkAvailability = async (): Promise<AvailableRoom | null> => {
    setCheckingAvailability(true);

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomType: form.roomType,
          aircon: form.aircon,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        room?: AvailableRoom;
        message?: string;
      };

      if (!response.ok || !result.success || !result.room) {
        setAvailableRoom(null);
        setFeedback(
          result.message ||
            "No rooms are available for the selected dates."
        );

        return null;
      }

      setAvailableRoom(result.room);

      return result.room;
    } catch (error) {
      console.error("Availability check failed:", error);

      setAvailableRoom(null);
      setFeedback(
        "We could not check room availability right now."
      );

      return null;
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      setFeedback(
        "Please complete the highlighted fields before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const room = await checkAvailability();

      if (!room) {
        setSubmitted(false);
        return;
      }

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          adults: form.adults,
          children: form.children,
          roomType: form.roomType,
          aircon: form.aircon,
          breakfast: form.breakfast,
          guestName: form.guestName,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests,
        }),
      });

      const result = (await response.json()) as {
        success?: boolean;
        bookingReference?: string;
        errors?: Record<string, string>;
        message?: string;
      };

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Booking submission failed."
        );
      }

      setSubmitted(true);

      const roomText = room.room_number
        ? ` Room: ${room.room_number}.`
        : "";

      setFeedback(
        `Booking submitted successfully. Reference: ${result.bookingReference}.${roomText}`
      );
    } catch (error) {
      console.error("Booking submission failed:", error);

      setSubmitted(false);

      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not save your booking right now."
      );
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
        `Aircon: ${form.aircon}`,
        `Adults: ${form.adults}`,
        `Children: ${form.children}`,
        `Breakfast: ${form.breakfast ? "Yes" : "No"}`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Special Requests: ${
          form.specialRequests || "None"
        }`,
      ].join("\n");

      const encoded = encodeURIComponent(message);

      window.open(
        `https://wa.me/27790582637?text=${encoded}`,
        "_blank",
        "noopener,noreferrer"
      );

      return;
    }

    setSubmitted(false);

    setFeedback(
      "Please complete the highlighted fields before opening WhatsApp."
    );
  };

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="border-b border-white/10 px-6 py-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.2em] text-[#d4b16f]"
          >
            GODMILL CITY
          </Link>

          <Link
            href="/"
            className="text-sm text-gray-300 transition hover:text-white"
          >
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
              Choose your dates, room and preferences, then review
              your booking before sending your request.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Executive, Standard & Family rooms
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Breakfast R120 per person
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Live room availability
              </span>
            </div>

            {checkingAvailability ? (
              <div className="mt-6 rounded-2xl border border-[#d4b16f]/20 bg-[#d4b16f]/10 px-4 py-3 text-sm text-[#e4c888]">
                Checking live room availability...
              </div>
            ) : null}

            {availableRoom ? (
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Room available
                {availableRoom.room_number
                  ? `: ${availableRoom.room_number}`
                  : "."}
              </div>
            ) : null}
          </div>

          <div className="lg:pl-4">
            <BookingSummary
              form={form}
              errors={errors}
              submitted={submitted}
            />
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-12 lg:px-16">
        <div className="mx-auto max-w-7xl">
          {feedback ? (
            <div
              className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
                feedback.toLowerCase().includes("success")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
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
            isSubmitting={isSubmitting || checkingAvailability}
          />
        </div>
      </section>
    </main>
  );
}