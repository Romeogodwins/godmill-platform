import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("SETTINGS GET ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error) {
    console.error("SETTINGS GET ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load settings.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data: existing, error: lookupError } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    let result;

    if (existing?.id) {
      result = await supabase
        .from("settings")
        .update({
          business_name: payload.business_name,
          phone: payload.phone,
          email: payload.email,
          address: payload.address,
          check_in_time: payload.check_in_time,
          check_out_time: payload.check_out_time,
          breakfast_price: payload.breakfast_price,
          cancellation_policy: payload.cancellation_policy,
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("settings")
        .insert({
          business_name:
            payload.business_name || "Godmill City Guesthouse",
          phone: payload.phone || "",
          email: payload.email || "",
          address: payload.address || "",
          check_in_time: payload.check_in_time || "14:00",
          check_out_time: payload.check_out_time || "10:00",
          breakfast_price: payload.breakfast_price || 120,
          cancellation_policy: payload.cancellation_policy || "",
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("SETTINGS UPDATE ERROR:", result.error);

      return NextResponse.json(
        {
          success: false,
          message: result.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: result.data,
      message: "Settings saved successfully.",
    });
  } catch (error) {
    console.error("SETTINGS PATCH ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to save settings.",
      },
      { status: 500 }
    );
  }
}
