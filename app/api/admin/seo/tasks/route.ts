import {
  NextResponse,
} from "next/server";

import {
  getSeoTasks,
} from "../../../../../lib/seo/repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tasks = await getSeoTasks();

    return NextResponse.json({
      tasks,
    });
  } catch (error) {
    console.error(
      "SEO tasks failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to load SEO tasks.",
      },
      { status: 500 }
    );
  }
}
