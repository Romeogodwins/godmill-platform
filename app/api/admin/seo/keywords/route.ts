import {
  NextResponse,
} from "next/server";

import {
  getSeoKeywords,
} from "../../../../../lib/seo/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const keywords =
      await getSeoKeywords();

    return NextResponse.json({
      keywords,
    });
  } catch (error) {
    console.error(
      "SEO keywords failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load SEO keywords.",
      },
      { status: 500 }
    );
  }
}
