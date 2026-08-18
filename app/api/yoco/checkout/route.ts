import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface CheckoutPayload {
  bookingId: string;
  bookingReference: string;
  amount: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;

    if (
      !body.bookingId ||
      !body.bookingReference ||
      !body.amount ||
      body.amount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment information.",
        },
        { status: 400 }
      );
    }

    const secretKey = process.env.YOCO_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Yoco secret key is not configured.",
        },
        { status: 500 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      new URL(request.url).origin;

    // Yoco expects the amount in cents.
    const amountInCents = Math.round(body.amount * 100);

    const yocoResponse = await fetch(
      "https://payments.yoco.com/api/checkouts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `godmill-${body.bookingId}`,
        },
        body: JSON.stringify({
          amount: amountInCents,
          currency: "ZAR",

          successUrl: `${origin}/booking/payment-success?booking=${encodeURIComponent(
            body.bookingReference
          )}`,

          cancelUrl: `${origin}/booking/payment-cancelled?booking=${encodeURIComponent(
            body.bookingReference
          )}`,

          failureUrl: `${origin}/booking/payment-failed?booking=${encodeURIComponent(
            body.bookingReference
          )}`,

          metadata: {
            bookingId: body.bookingId,
            bookingReference: body.bookingReference,
            source: "Godmill City Guesthouse",
          },
        }),
      }
    );

    const yocoData = await yocoResponse.json();

    if (!yocoResponse.ok) {
      console.error("YOCO CHECKOUT ERROR:", yocoData);

      return NextResponse.json(
        {
          success: false,
          message:
            yocoData?.message ||
            "Unable to create Yoco checkout.",
        },
        { status: yocoResponse.status }
      );
    }

    if (!yocoData.redirectUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Yoco did not return a payment URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutId: yocoData.id,
      redirectUrl: yocoData.redirectUrl,
      status: yocoData.status,
    });
  } catch (error) {
    console.error("YOCO CHECKOUT ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to start payment.",
      },
      { status: 500 }
    );
  }
}