import { createSign } from "node:crypto";

import {
  getSearchConsoleBaseline,
} from "./rankings";

import type {
  SeoRanking,
  SeoRankingAction,
  SeoSeverity,
} from "./types";

const SEARCH_CONSOLE_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";

const TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const SEARCH_ANALYTICS_BASE =
  "https://searchconsole.googleapis.com/webmasters/v3/sites";

type GoogleRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export interface SearchConsoleLiveRow extends SeoRanking {
  ctr: number;
  baselinePosition: number | null;
  positionChange: number | null;
  movement:
    | "improved"
    | "declined"
    | "stable"
    | "new";
}

export interface SearchConsoleGrowthData {
  configured: boolean;
  source:
    | "google-search-console-live"
    | "search-console-baseline";
  siteUrl: string;
  periodStart: string;
  periodEnd: string;
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  rows: SearchConsoleLiveRow[];
  generatedAt: string;
  message: string;
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function actionForPosition(
  position: number
): SeoRankingAction {
  if (position <= 3) return "protect";
  if (position <= 10) return "improve";
  return "opportunity";
}

function priorityForPosition(
  position: number,
  impressions: number
): SeoSeverity {
  if (position <= 3) {
    return impressions >= 10
      ? "critical"
      : "high";
  }

  if (position <= 10) {
    return "high";
  }

  return "medium";
}

function targetForPosition(
  position: number
): number {
  if (position <= 3) return 3;
  if (position <= 10) return 3;
  return 10;
}

function targetPageForQuery(
  query: string
): string {
  const normalized = query
    .trim()
    .toLowerCase();

  const baseline = getSearchConsoleBaseline()
    .find(
      (row) =>
        row.query.toLowerCase() === normalized
    );

  if (baseline) {
    return baseline.targetPage;
  }

  if (
    normalized.includes("price") ||
    normalized.includes("affordable")
  ) {
    return "/affordable-accommodation-taung";
  }

  if (
    normalized.includes("family")
  ) {
    return "/family-accommodation-taung";
  }

  if (
    normalized.includes("business") ||
    normalized.includes("contractor")
  ) {
    return "/business-accommodation-taung";
  }

  if (
    normalized.includes("room")
  ) {
    return "/rooms-taung";
  }

  if (
    normalized.includes("guesthouse") ||
    normalized.includes("guest house")
  ) {
    return "/guesthouse-taung";
  }

  return "/accommodation-taung";
}

function noteForRow(
  query: string,
  position: number,
  clicks: number,
  impressions: number
): string {
  if (
    position <= 3 &&
    impressions > 0 &&
    clicks === 0
  ) {
    return "Protect this strong ranking and improve click-through rate with a clearer search snippet, current photos and strong Google Business Profile signals.";
  }

  if (position <= 3) {
    return "Protect the ranking. Avoid aggressive rewrites; focus on reviews, fresh property photos, local authority and conversion.";
  }

  if (position <= 10) {
    return "Page-one opportunity. Improve internal links, title/snippet relevance, useful local content and supporting authority.";
  }

  return `Expansion opportunity for "${query}". Build genuine relevance and authority before targeting aggressive ranking gains.`;
}

function baselineMap() {
  return new Map(
    getSearchConsoleBaseline().map(
      (row) => [
        row.query.toLowerCase(),
        row.position,
      ]
    )
  );
}

function movementFor(
  baselinePosition: number | null,
  currentPosition: number
): {
  positionChange: number | null;
  movement:
    | "improved"
    | "declined"
    | "stable"
    | "new";
} {
  if (baselinePosition === null) {
    return {
      positionChange: null,
      movement: "new",
    };
  }

  const change =
    Math.round(
      (baselinePosition - currentPosition) *
        10
    ) / 10;

  if (change >= 0.5) {
    return {
      positionChange: change,
      movement: "improved",
    };
  }

  if (change <= -0.5) {
    return {
      positionChange: change,
      movement: "declined",
    };
  }

  return {
    positionChange: change,
    movement: "stable",
  };
}

function formatDate(
  date: Date
): string {
  return date
    .toISOString()
    .slice(0, 10);
}

function getPeriod() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 1);

  const start = new Date(end);
  start.setUTCDate(
    start.getUTCDate() - 27
  );

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

function configuredCredentials() {
  const clientEmail =
    process.env
      .GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL
      ?.trim();

  const privateKey =
    process.env
      .GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY
      ?.replace(/\\n/g, "\n")
      .trim();

  const siteUrl =
    process.env
      .GOOGLE_SEARCH_CONSOLE_SITE_URL
      ?.trim() ||
    "sc-domain:godmillcityguesthouse.com";

  return {
    clientEmail,
    privateKey,
    siteUrl,
    configured:
      Boolean(clientEmail) &&
      Boolean(privateKey),
  };
}

async function getAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string> {
  const now = Math.floor(
    Date.now() / 1000
  );

  const header = base64Url(
    JSON.stringify({
      alg: "RS256",
      typ: "JWT",
    })
  );

  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: SEARCH_CONSOLE_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );

  const unsigned =
    `${header}.${claim}`;

  const signer = createSign(
    "RSA-SHA256"
  );

  signer.update(unsigned);
  signer.end();

  const signature = base64Url(
    signer.sign(privateKey)
  );

  const assertion =
    `${unsigned}.${signature}`;

  const body =
    new URLSearchParams({
      grant_type:
        "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    });

  const response = await fetch(
    TOKEN_URL,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  const payload =
    await response.json();

  if (
    !response.ok ||
    !payload.access_token
  ) {
    throw new Error(
      payload.error_description ||
        payload.error ||
        "Unable to authenticate with Google Search Console."
    );
  }

  return String(
    payload.access_token
  );
}

function baselineFallback():
  SearchConsoleGrowthData {
  const rows =
    getSearchConsoleBaseline().map(
      (row) => ({
        ...row,
        ctr:
          row.impressions > 0
            ? row.clicks /
              row.impressions
            : 0,
        baselinePosition:
          row.position,
        positionChange: 0,
        movement:
          "stable" as const,
      })
    );

  const totalClicks =
    rows.reduce(
      (sum, row) =>
        sum + row.clicks,
      0
    );

  const totalImpressions =
    rows.reduce(
      (sum, row) =>
        sum + row.impressions,
      0
    );

  const weightedPosition =
    totalImpressions > 0
      ? rows.reduce(
          (sum, row) =>
            sum +
            row.position *
              row.impressions,
          0
        ) / totalImpressions
      : 0;

  const measuredAt =
    rows[0]?.measuredAt ||
    "2026-08-24";

  return {
    configured: false,
    source:
      "search-console-baseline",
    siteUrl:
      "sc-domain:godmillcityguesthouse.com",
    periodStart: measuredAt,
    periodEnd: measuredAt,
    totalClicks,
    totalImpressions,
    averageCtr:
      totalImpressions > 0
        ? totalClicks /
          totalImpressions
        : 0,
    averagePosition:
      Math.round(
        weightedPosition * 10
      ) / 10,
    rows,
    generatedAt:
      new Date().toISOString(),
    message:
      "Google Search Console API is not connected yet. Showing the saved Search Console baseline.",
  };
}

export async function getSearchConsoleGrowthData():
  Promise<SearchConsoleGrowthData> {
  const credentials =
    configuredCredentials();

  if (
    !credentials.configured ||
    !credentials.clientEmail ||
    !credentials.privateKey
  ) {
    return baselineFallback();
  }

  const {
    startDate,
    endDate,
  } = getPeriod();

  try {
    const accessToken =
      await getAccessToken(
        credentials.clientEmail,
        credentials.privateKey
      );

    const endpoint =
      `${SEARCH_ANALYTICS_BASE}/` +
      `${encodeURIComponent(
        credentials.siteUrl
      )}/searchAnalytics/query`;

    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["query"],
          rowLimit: 100,
          type: "web",
          dataState: "final",
        }),
        cache: "no-store",
      }
    );

    const payload =
      await response.json();

    if (!response.ok) {
      throw new Error(
        payload?.error?.message ||
          "Google Search Console query failed."
      );
    }

    const baseline =
      baselineMap();

    const rows:
      SearchConsoleLiveRow[] =
      ((payload.rows ||
        []) as GoogleRow[])
        .map((row): SearchConsoleLiveRow => {
          const query =
            row.keys?.[0]?.trim() ||
            "Unknown query";

          const position =
            Number(
              row.position || 0
            );

          const impressions =
            Number(
              row.impressions || 0
            );

          const clicks =
            Number(
              row.clicks || 0
            );

          const baselinePosition =
            baseline.get(
              query.toLowerCase()
            ) ?? null;

          const movement =
            movementFor(
              baselinePosition,
              position
            );

          return {
            query,
            clicks,
            impressions,
            ctr:
              Number(row.ctr || 0),
            position:
              Math.round(
                position * 10
              ) / 10,
            targetPosition:
              targetForPosition(
                position
              ),
            targetPage:
              targetPageForQuery(
                query
              ),
            action:
              actionForPosition(
                position
              ),
            priority:
              priorityForPosition(
                position,
                impressions
              ),
            note:
              noteForRow(
                query,
                position,
                clicks,
                impressions
              ),
            source:
              "search-console-baseline",
            measuredAt:
              endDate,
            baselinePosition,
            positionChange:
              movement.positionChange,
            movement:
              movement.movement,
          };
        })
        .sort(
          (a, b) =>
            b.impressions -
            a.impressions
        );

    const totalClicks =
      rows.reduce(
        (sum, row) =>
          sum + row.clicks,
        0
      );

    const totalImpressions =
      rows.reduce(
        (sum, row) =>
          sum + row.impressions,
        0
      );

    const averageCtr =
      totalImpressions > 0
        ? totalClicks /
          totalImpressions
        : 0;

    const weightedPosition =
      totalImpressions > 0
        ? rows.reduce(
            (sum, row) =>
              sum +
              row.position *
                row.impressions,
            0
          ) / totalImpressions
        : 0;

    return {
      configured: true,
      source:
        "google-search-console-live",
      siteUrl:
        credentials.siteUrl,
      periodStart: startDate,
      periodEnd: endDate,
      totalClicks,
      totalImpressions,
      averageCtr,
      averagePosition:
        Math.round(
          weightedPosition * 10
        ) / 10,
      rows,
      generatedAt:
        new Date().toISOString(),
      message:
        "Live 28-day Google Search Console data loaded successfully.",
    };
  } catch (error) {
    const fallback =
      baselineFallback();

    return {
      ...fallback,
      configured: true,
      message:
        error instanceof Error
          ? `Google Search Console connection error: ${error.message}. Showing saved baseline instead.`
          : "Google Search Console connection error. Showing saved baseline instead.",
    };
  }
}


