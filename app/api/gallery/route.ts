import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("gallery_images")
      .select(`
        id,
        public_url,
        title,
        caption,
        alt_text,
        category,
        is_featured,
        is_cover,
        sort_order,
        created_at
      `)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("PUBLIC GALLERY ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
          images: [],
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images: data ?? [],
    });
  } catch (error) {
    console.error("PUBLIC GALLERY ROUTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load gallery.",
        images: [],
      },
      { status: 500 }
    );
  }
}