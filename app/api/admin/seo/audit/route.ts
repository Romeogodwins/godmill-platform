import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  runFullSeoAudit,
  runSeoAuditForRoute,
} from "../../../../../lib/seo/service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest
) {
  try {
    const route =
      request.nextUrl.searchParams.get(
        "route"
      );

    if (route) {
      const audit =
        await runSeoAuditForRoute(route);

      if (!audit) {
        return NextResponse.json(
          {
            error:
              "SEO page configuration not found.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        audit,
      });
    }

    const audits = await runFullSeoAudit();

    return NextResponse.json({
      audits,
      auditedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(
      "SEO audit failed:",
      error
    );

    return NextResponse.json(
      {
        error: "SEO audit failed.",
      },
      { status: 500 }
    );
  }
}
