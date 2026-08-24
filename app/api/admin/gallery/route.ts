import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "../../../../lib/supabase/admin";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function cleanFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-");
}

// ----------------------------------------------------
// GET ALL GALLERY IMAGES
// ----------------------------------------------------

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      images: data ?? [],
    });
  } catch (error) {
    console.error("GALLERY GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load gallery.",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// UPLOAD IMAGE
// ----------------------------------------------------

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select an image.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WEBP images are allowed.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The image is too large. Maximum size is 10 MB.",
        },
        { status: 400 }
      );
    }

    const title =
      String(formData.get("title") || "").trim() ||
      "Godmill City Guesthouse";

    const caption =
      String(formData.get("caption") || "").trim();

    const altText =
      String(formData.get("altText") || "").trim() ||
      title;

    const category =
      String(formData.get("category") || "general");

    const isFeatured =
      String(formData.get("isFeatured")) === "true";

    const isCover =
      String(formData.get("isCover")) === "true";

    const isPublished =
      String(formData.get("isPublished")) !== "false";

    const sortOrderRaw =
      Number(formData.get("sortOrder") || 0);

    const sortOrder = Number.isFinite(sortOrderRaw)
      ? sortOrderRaw
      : 0;

    const validCategories = [
      "executive",
      "standard-aircon",
      "standard-non-aircon",
      "family-aircon",
      "family-non-aircon",
      "bathroom",
      "pool",
      "courtyard",
      "dining",
      "exterior",
      "general",
    ];

    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid gallery category.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const safeName = cleanFileName(file.name);

    const storagePath =
      `${category}/${Date.now()}-${safeName}`;

    const bytes = await file.arrayBuffer();

    const { error: uploadError } =
      await supabase.storage
        .from("gallery")
        .upload(storagePath, bytes, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error(
        "GALLERY STORAGE UPLOAD ERROR:",
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          message: uploadError.message,
        },
        { status: 500 }
      );
    }

    const { data: publicUrlData } =
      supabase.storage
        .from("gallery")
        .getPublicUrl(storagePath);

    const publicUrl =
      publicUrlData.publicUrl;

    if (isCover) {
      await supabase
        .from("gallery_images")
        .update({
          is_cover: false,
        })
        .eq("category", category);
    }

    const {
      data: image,
      error: insertError,
    } = await supabase
      .from("gallery_images")
      .insert({
        storage_path: storagePath,
        public_url: publicUrl,
        title,
        caption: caption || null,
        alt_text: altText,
        category,
        is_featured: isFeatured,
        is_cover: isCover,
        is_published: isPublished,
        sort_order: sortOrder,
      })
      .select("*")
      .single();

    if (insertError) {
      await supabase.storage
        .from("gallery")
        .remove([storagePath]);

      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Photo uploaded successfully.",
      image,
    });
  } catch (error) {
    console.error("GALLERY POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to upload photo.",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// UPDATE IMAGE
// ----------------------------------------------------

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const {
      data: current,
      error: currentError,
    } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("id", payload.id)
      .single();

    if (currentError || !current) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image not found.",
        },
        { status: 404 }
      );
    }

    const category =
      payload.category ?? current.category;

    if (payload.isCover === true) {
      await supabase
        .from("gallery_images")
        .update({
          is_cover: false,
        })
        .eq("category", category)
        .neq("id", payload.id);
    }

    const updates = {
      title:
        payload.title ?? current.title,

      caption:
        payload.caption !== undefined
          ? payload.caption || null
          : current.caption,

      alt_text:
        payload.altText ?? current.alt_text,

      category,

      is_featured:
        payload.isFeatured ??
        current.is_featured,

      is_cover:
        payload.isCover ??
        current.is_cover,

      is_published:
        payload.isPublished ??
        current.is_published,

      sort_order:
        payload.sortOrder !== undefined
          ? Number(payload.sortOrder)
          : current.sort_order,

      updated_at: new Date().toISOString(),
    };

    const {
      data: image,
      error,
    } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", payload.id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Gallery photo updated.",
      image,
    });
  } catch (error) {
    console.error("GALLERY PATCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update gallery photo.",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// DELETE IMAGE
// ----------------------------------------------------

export async function DELETE(request: Request) {
  try {
    const payload = await request.json();

    if (!payload.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image ID is required.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const {
      data: image,
      error: lookupError,
    } = await supabase
      .from("gallery_images")
      .select("id, storage_path")
      .eq("id", payload.id)
      .single();

    if (lookupError || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery image not found.",
        },
        { status: 404 }
      );
    }

    const { error: storageError } =
      await supabase.storage
        .from("gallery")
        .remove([image.storage_path]);

    if (storageError) {
      throw storageError;
    }

    const { error: deleteError } =
      await supabase
        .from("gallery_images")
        .delete()
        .eq("id", payload.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Gallery photo deleted.",
    });
  } catch (error) {
    console.error("GALLERY DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete gallery photo.",
      },
      { status: 500 }
    );
  }
}
