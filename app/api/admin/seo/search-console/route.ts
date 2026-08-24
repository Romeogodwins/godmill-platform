import {
  NextResponse,
} from "next/server";

import {
  getSearchConsoleGrowthData,
} from "../../../../../lib/seo/search-console";

export const dynamic =
  "force-dynamic";

export async function GET() {
  const data =
    await getSearchConsoleGrowthData();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control":
        "no-store, max-age=0",
    },
  });
}

