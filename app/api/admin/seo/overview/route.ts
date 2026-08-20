import {
  NextResponse,
} from "next/server";

import {
  getSeoOverview,
} from "../../../../../lib/seo/service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const overview =
      await getSeoOverview();

    return NextResponse.json(overview);
  } catch (error) {
    console.error(
      "SEO overview failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to generate SEO overview.",
      },
      { status: 500 }
    );
  }
}
