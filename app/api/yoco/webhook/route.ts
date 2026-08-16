import crypto from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export const dynamic = "force-dynamic";

const MAX_TIMESTAMP_AGE_SECONDS = 180;

function verifyYocoWebhook(
  rawBody: string,
  webhookId: string,
  webhookTimestamp: string,
  webhookSignature: string,
  webhookSecret: string
) {
  // --------------------------------------------------
  // 1. Prevent replay attacks
  // --------------------------------------------------

  const timestamp = Number(webhookTimestamp);

  if (!Number.isFinite(timestamp)) {
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (
    Math.abs(currentTimestamp - timestamp) >
    MAX_TIMESTAMP_AGE_SECONDS
  ) {
    return false;
  }

  // --------------------------------------------------
  // 2. Construct Yoco signed content
  // --------------------------------------------------

  const signedContent =
    `${webhookId}.${webhookTimestamp}.${rawBody}`;

  // --------------------------------------------------
  // 3. Decode Yoco webhook secret
  // --------------------------------------------------

  const encodedSecret = webhookSecret.startsWith("whsec_")
    ? webhookSecret.slice("whsec_".length)
    : webhookSecret;

  let secretBytes: Buffer;

  try {
    secretBytes = Buffer.from(encodedSecret, "base64");
  } catch {
    return false;
  }

  // --------------------------------------------------
  // 4. Calculate expected HMAC SHA256 signature
  // --------------------------------------------------

  const expectedSignature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  // --------------------------------------------------
  // 5. Yoco can send multiple signatures.
  //    Check all v1 signatures.
  // --------------------------------------------------

    // Yoco webhook-signature can contain one or more
  // space-separated version/signature pairs, for example:
  // v1,<signature> v1,<signature>

  const signatures = webhookSignature
    .split(/\s+/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const entry of signatures) {
    const [version, ...signatureParts] = entry.split(",");
    const signature = signatureParts.join(",");

    if (version !== "v1" || !signature) {
      continue;
    }

    try {
      const expectedBuffer = Buffer.from(expectedSignature, "utf8");
      const receivedBuffer = Buffer.from(signature, "utf8");

      if (expectedBuffer.length !== receivedBuffer.length) {
        continue;
      }

      if (crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;}

export async function POST(request: Request) {
  try {
    // IMPORTANT:
    // Yoco requires the RAW request body for signature verification.
    const rawBody = await request.text();

    const webhookId =
      request.headers.get("webhook-id");

    const webhookTimestamp =
      request.headers.get("webhook-timestamp");

    const webhookSignature =
      request.headers.get("webhook-signature");

    const webhookSecret =
      process.env.YOCO_WEBHOOK_SECRET;

    if (
      !webhookId ||
      !webhookTimestamp ||
      !webhookSignature
    ) {
      console.error(
        "YOCO WEBHOOK: Required headers missing."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Required webhook headers missing.",
        },
        { status: 400 }
      );
    }

    if (!webhookSecret) {
      console.error(
        "YOCO WEBHOOK: YOCO_WEBHOOK_SECRET is not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Webhook secret is not configured.",
        },
        { status: 500 }
      );
    }

    const validSignature = verifyYocoWebhook(
      rawBody,
      webhookId,
      webhookTimestamp,
      webhookSignature,
      webhookSecret
    );

    if (!validSignature) {
      console.error(
        "YOCO WEBHOOK: Invalid signature."
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid webhook signature.",
        },
        { status: 403 }
      );
    }

    // --------------------------------------------------
    // Signature verified.
    // We can now safely parse the body.
    // --------------------------------------------------

    const event = JSON.parse(rawBody) as {
      id?: string;
      type?: string;
      payload?: {
        id?: string;
        amount?: number;
        currency?: string;
        status?: string;
        type?: string;
        metadata?: {
          checkoutId?: string;
          bookingId?: string;
          bookingReference?: string;
          [key: string]: unknown;
        };
      };
    };

    console.log(
      "YOCO WEBHOOK VERIFIED:",
      event.id,
      event.type
    );

    // We only process successful payments here.
    if (event.type !== "payment.succeeded") {
      return NextResponse.json({
        success: true,
        received: true,
        ignored: true,
      });
    }

    const payload = event.payload;

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Webhook payload missing.",
        },
        { status: 400 }
      );
    }

    const bookingId =
      typeof payload.metadata?.bookingId === "string"
        ? payload.metadata.bookingId
        : null;

    const bookingReference =
      typeof payload.metadata?.bookingReference === "string"
        ? payload.metadata.bookingReference
        : null;

    if (!bookingId) {
      console.error(
        "YOCO WEBHOOK: bookingId missing from metadata.",
        payload.metadata
      );

      return NextResponse.json(
        {
          success: false,
          message: "Booking ID missing from payment metadata.",
        },
        { status: 400 }
      );
    }

    const supabase =
      await createSupabaseServerClient();

    // --------------------------------------------------
    // Find booking
    // --------------------------------------------------

    const {
      data: booking,
      error: bookingError,
    } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_reference,
        grand_total
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error(
        "YOCO WEBHOOK BOOKING ERROR:",
        bookingError
      );

      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // Convert Yoco cents to rands
    // --------------------------------------------------

    const amountInCents = Number(payload.amount || 0);

    if (
      !Number.isFinite(amountInCents) ||
      amountInCents <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment amount.",
        },
        { status: 400 }
      );
    }

    const amountInRands =
      amountInCents / 100;

    // --------------------------------------------------
    // Prevent duplicate payment recording
    // --------------------------------------------------

    const paymentReference =
      payload.id ||
      event.id ||
      webhookId;

    const {
      data: existingPayment,
      error: existingPaymentError,
    } = await supabase
      .from("payments")
      .select("id")
      .eq(
        "payment_reference",
        paymentReference
      )
      .maybeSingle();

    if (existingPaymentError) {
      console.error(
        "YOCO DUPLICATE CHECK ERROR:",
        existingPaymentError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to verify existing payment.",
        },
        { status: 500 }
      );
    }

    if (existingPayment) {
      return NextResponse.json({
        success: true,
        received: true,
        duplicate: true,
      });
    }

    // --------------------------------------------------
    // Record payment
    // --------------------------------------------------

    const {
      data: payment,
      error: paymentError,
    } = await supabase
      .from("payments")
      .insert({
        booking_id: booking.id,
        amount: amountInRands,
        payment_method: "Yoco Online",
        payment_reference: paymentReference,
        notes: `Yoco online payment${
          bookingReference
            ? ` for ${bookingReference}`
            : ""
        }`,
      })
      .select()
      .single();

    if (paymentError) {
      console.error(
        "YOCO PAYMENT INSERT ERROR:",
        paymentError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment received but could not be recorded.",
        },
        { status: 500 }
      );
    }

    console.log(
      "YOCO PAYMENT RECORDED:",
      paymentReference,
      amountInRands
    );

    return NextResponse.json({
      success: true,
      received: true,
      paymentRecorded: true,
      payment,
    });
  } catch (error) {
    console.error(
      "YOCO WEBHOOK ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to process Yoco webhook.",
      },
      { status: 500 }
    );
  }
}