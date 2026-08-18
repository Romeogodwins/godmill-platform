"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";
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
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [checkingAvailability, setCheckingAvailability] =
    useState(false);

  const [availableRoom, setAvailableRoom] =
    useState<AvailableRoom | null>(null);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const [createdBooking, setCreatedBooking] =
    useState<{
      id: string;
      reference: string;
      amount: number;
      roomNumber?: string;
    } | null>(null);

  const [proofFile, setProofFile] =
    useState<File | null>(null);

  const [uploadingProof, setUploadingProof] =
    useState(false);

  const [proofUploaded, setProofUploaded] =
    useState(false);

  const [proofMessage, setProofMessage] =
    useState<string | null>(null);
  const validate = (values: BookingFormState) => {
    const nextErrors: BookingErrors = {};

    if (!values.checkIn) {
      nextErrors.checkIn =
        "Please select a check-in date.";
    }

    if (!values.checkOut) {
      nextErrors.checkOut =
        "Please select a check-out date.";
    } else if (
      values.checkIn &&
      values.checkOut <= values.checkIn
    ) {
      nextErrors.checkOut =
        "Check-out must be after check-in.";
    }

    const adults = Number(values.adults);

    if (
      !values.adults ||
      Number.isNaN(adults) ||
      adults < 1
    ) {
      nextErrors.adults =
        "Please enter at least one adult.";
    }

    const children = Number(values.children);

    if (
      Number.isNaN(children) ||
      children < 0
    ) {
      nextErrors.children =
        "Children must be zero or more.";
    }

    if (!values.guestName.trim()) {
      nextErrors.guestName =
        "Please enter the guest name.";
    }

    if (!values.email.trim()) {
      nextErrors.email =
        "Please enter your email address.";
    } else if (
      !validateEmail(values.email.trim())
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!values.phone.trim()) {
      nextErrors.phone =
        "Please enter your contact number.";
    } else if (
      !validatePhone(values.phone.trim())
    ) {
      nextErrors.phone =
        "Please enter a valid phone number.";
    }

    if (
      values.roomType !== "Executive Room" &&
      !values.aircon
    ) {
      nextErrors.aircon =
        "Please choose an air-conditioning option.";
    }

    return nextErrors;
  };

  const handleChange = (
    event: ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checkbox =
        event.target as HTMLInputElement;

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

  const checkAvailability =
    async (): Promise<AvailableRoom | null> => {
      setCheckingAvailability(true);

      try {
        const response = await fetch(
          "/api/availability",
          {
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
          }
        );

        const result =
          (await response.json()) as {
            success?: boolean;
            room?: AvailableRoom;
            message?: string;
          };

        if (
          !response.ok ||
          !result.success ||
          !result.room
        ) {
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
        console.error(
          "Availability check failed:",
          error
        );

        setAvailableRoom(null);

        setFeedback(
          "We could not check room availability right now."
        );

        return null;
      } finally {
        setCheckingAvailability(false);
      }
    };

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      setSubmitted(false);

      setFeedback(
        "Please complete the highlighted fields before submitting."
      );

      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const room =
        await checkAvailability();

      if (!room) {
        setSubmitted(false);
        return;
      }

      // -----------------------------------------
      // CREATE GODMILL BOOKING
      // -----------------------------------------

      const response = await fetch(
        "/api/booking",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
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
            specialRequests:
              form.specialRequests,
          }),
        }
      );

      const result =
        (await response.json()) as {
          success?: boolean;

          bookingReference?: string;

          booking?: {
            id: string;
            booking_reference: string;
            grand_total: number;
          };

          pricing?: {
            grandTotal: number;
          };

          errors?: Record<
            string,
            string
          >;

          message?: string;
        };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Booking submission failed."
        );
      }

      if (
        !result.booking?.id ||
        !result.bookingReference ||
        !result.pricing?.grandTotal
      ) {
        throw new Error(
          "Booking was created, but payment information is incomplete."
        );
      }

      setCreatedBooking({
        id: result.booking.id,
        reference: result.bookingReference,
        amount: Number(result.pricing.grandTotal),
        roomNumber: room.room_number,
      });

      setProofFile(null);
      setProofUploaded(false);
      setProofMessage(null);
      setSubmitted(true);

      const roomText =
        room.room_number
          ? ` Room: ${room.room_number}.`
          : "";

      setFeedback(
        `Booking created successfully. Reference: ${result.bookingReference}.${roomText} Redirecting to secure payment...`
      );

      // -----------------------------------------
      // EFT PAYMENT INSTRUCTIONS
      // -----------------------------------------

      const amountDue =
        Number(result.pricing.grandTotal);

      const eftMessage =
        `Booking created successfully! Reference: ${result.bookingReference}. ` +
        `Amount due: R${amountDue.toLocaleString("en-ZA")}. ` +
        `Please pay by EFT to FNB, Account Name: Godmill, ` +
        `Account Number: 62836688616, Account Type: Current. ` +
        `Use ${result.bookingReference} as your payment reference. ` +
        `Your booking will be confirmed once payment has been verified.`;

      setFeedback(eftMessage);
    } catch (error) {
      console.error(
        "Booking/payment failed:",
        error
      );

      setFeedback(
        error instanceof Error
          ? error.message
          : "We could not complete your booking payment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProofUpload = async () => {
    if (!createdBooking) {
      setProofMessage(
        "Please complete your booking before uploading proof of payment."
      );
      return;
    }

    if (!proofFile) {
      setProofMessage(
        "Please choose your proof of payment first."
      );
      return;
    }

    try {
      setUploadingProof(true);
      setProofMessage(null);

      const formData = new FormData();

      formData.append(
        "bookingId",
        createdBooking.id
      );

      formData.append(
        "bookingReference",
        createdBooking.reference
      );

      formData.append(
        "file",
        proofFile
      );

      const response = await fetch(
        "/api/booking/proof-of-payment",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
        };

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            "Unable to upload proof of payment."
        );
      }

      setProofUploaded(true);

      setProofMessage(
        result.message ||
          "Proof of payment uploaded successfully. Your payment is awaiting verification."
      );
    } catch (error) {
      console.error(
        "Proof upload failed:",
        error
      );

      setProofMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload proof of payment."
      );
    } finally {
      setUploadingProof(false);
    }
  };
  const handleWhatsApp = () => {
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length === 0
    ) {
      const message = [
        `Guest Name: ${form.guestName}`,
        `Check-in: ${form.checkIn}`,
        `Check-out: ${form.checkOut}`,
        `Room Type: ${form.roomType}`,
        `Aircon: ${form.aircon}`,
        `Adults: ${form.adults}`,
        `Children: ${form.children}`,
        `Breakfast: ${
          form.breakfast
            ? "Yes"
            : "No"
        }`,
        `Email: ${form.email}`,
        `Phone: ${form.phone}`,
        `Special Requests: ${
          form.specialRequests ||
          "None"
        }`,
      ].join("\n");

      const encoded =
        encodeURIComponent(message);

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
              Reserve a luxury stay with
              confidence.
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-300">
              Choose your dates, room and
              preferences, then review your
              booking before sending your
              request.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-gray-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Executive, Standard & Family
                rooms
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
                Checking live room
                availability...
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
                feedback
                  .toLowerCase()
                  .includes("success")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              {feedback}
            </div>
          ) : null}

          {createdBooking ? (
            <div className="mb-8 rounded-3xl border border-[#d4b16f]/30 bg-[#111111] p-6 md:p-8">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d4b16f]">
                    Payment Pending
                  </p>

                  <h2 className="mt-2 text-2xl font-bold">
                    Complete your EFT payment
                  </h2>

                  <p className="mt-2 text-sm text-gray-400">
                    Your room has been reserved. Your booking will be confirmed after payment verification.
                  </p>
                </div>

                <div className="rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300">
                  Awaiting Payment
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-semibold text-[#d4b16f]">
                    Booking Details
                  </h3>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Reference</span>
                      <strong>{createdBooking.reference}</strong>
                    </div>

                    {createdBooking.roomNumber ? (
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Room</span>
                        <strong>{createdBooking.roomNumber}</strong>
                      </div>
                    ) : null}

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-400">Amount Due</span>
                      <strong className="text-xl text-[#d4b16f]">
                        R{createdBooking.amount.toLocaleString("en-ZA")}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="font-semibold text-[#d4b16f]">
                    EFT Banking Details
                  </h3>

                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-gray-400">Bank:</span> FNB</p>
                    <p><span className="text-gray-400">Account Name:</span> Godmill</p>
                    <p><span className="text-gray-400">Account Number:</span> 62836688616</p>
                    <p><span className="text-gray-400">Account Type:</span> Current</p>
                    <p>
                      <span className="text-gray-400">Payment Reference:</span>{" "}
                      <strong>{createdBooking.reference}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
                <h3 className="text-lg font-semibold">
                  Upload Proof of Payment
                </h3>

                <p className="mt-2 text-sm text-gray-400">
                  Upload your bank receipt after making the EFT payment. PDF, JPG and PNG files up to 5MB are accepted.
                </p>

                {!proofUploaded ? (
                  <div className="mt-5 flex flex-col gap-4">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={(event) => {
                        const file =
                          event.target.files?.[0] ??
                          null;

                        setProofFile(file);
                        setProofMessage(null);
                      }}
                      className="block w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-gray-300 file:mr-4 file:rounded-full file:border-0 file:bg-[#d4b16f] file:px-4 file:py-2 file:font-semibold file:text-black"
                    />

                    {proofFile ? (
                      <p className="text-sm text-gray-400">
                        Selected: {proofFile.name}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={handleProofUpload}
                      disabled={
                        uploadingProof ||
                        !proofFile
                      }
                      className="w-full rounded-full bg-[#d4b16f] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:w-fit"
                    >
                      {uploadingProof
                        ? "Uploading..."
                        : "Upload Proof of Payment"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
                    ✓ Proof received — awaiting payment verification.
                  </div>
                )}

                {proofMessage ? (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                      proofUploaded
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-300"
                    }`}
                  >
                    {proofMessage}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          <BookingForm
            form={form}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onWhatsApp={handleWhatsApp}
            submitted={submitted}
            isSubmitting={
              isSubmitting ||
              checkingAvailability
            }
          />
        </div>
      </section>
    </main>
  );
}