import type {
  SeoRanking,
  SeoRankingAction,
  SeoRankingSummary,
  SeoSeverity,
} from "./types";

const MEASURED_AT = "2026-08-24";

interface RankingBaselineRow {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  targetPosition: number;
  targetPage: string;
  priority: SeoSeverity;
  note: string;
}

const baseline: RankingBaselineRow[] = [
  {
    query: "godmill city guest house",
    clicks: 0,
    impressions: 17,
    position: 5.2,
    targetPosition: 3,
    targetPage: "/",
    priority: "critical",
    note:
      "Strong branded visibility but no clicks yet. Improve title/snippet appeal while protecting brand relevance.",
  },
  {
    query: "taung guest house",
    clicks: 0,
    impressions: 5,
    position: 1.2,
    targetPosition: 3,
    targetPage: "/guesthouse-taung",
    priority: "critical",
    note:
      "Excellent early ranking. Protect the page and grow impressions rather than rewriting it aggressively.",
  },
  {
    query: "godmill city guesthouse taung",
    clicks: 0,
    impressions: 2,
    position: 1.0,
    targetPosition: 1,
    targetPage: "/",
    priority: "critical",
    note:
      "Brand + location query is already at the top. Protect consistency across website and Google Business Profile.",
  },
  {
    query: "taung guest house prices",
    clicks: 0,
    impressions: 2,
    position: 1.0,
    targetPosition: 3,
    targetPage: "/affordable-accommodation-taung",
    priority: "high",
    note:
      "High buying intent. Keep pricing and direct-booking information clear and current.",
  },
  {
    query: "taung guesthouse",
    clicks: 0,
    impressions: 1,
    position: 8.0,
    targetPosition: 3,
    targetPage: "/guesthouse-taung",
    priority: "high",
    note:
      "Page-one opportunity. Strengthen internal links, local relevance and supporting authority without keyword stuffing.",
  },
  {
    query: "local guest house near me",
    clicks: 0,
    impressions: 1,
    position: 10.0,
    targetPosition: 5,
    targetPage: "/guesthouse-taung",
    priority: "high",
    note:
      "Local-intent query. Google Business Profile quality, reviews, photos and location consistency matter heavily.",
  },
  {
    query: "hotels in taung",
    clicks: 0,
    impressions: 1,
    position: 52.0,
    targetPosition: 10,
    targetPage: "/accommodation-taung",
    priority: "high",
    note:
      "Large growth opportunity. Build relevance naturally around accommodation/hotel alternatives in Taung and earn local authority.",
  },
];

function actionForPosition(position: number): SeoRankingAction {
  if (position <= 3) return "protect";
  if (position <= 10) return "improve";
  return "opportunity";
}

export function getSearchConsoleBaseline(): SeoRanking[] {
  return baseline.map((row) => ({
    ...row,
    action: actionForPosition(row.position),
    source: "search-console-baseline",
    measuredAt: MEASURED_AT,
  }));
}

export function getRankingSummary(
  rankings: SeoRanking[]
): SeoRankingSummary {
  const totalImpressions = rankings.reduce(
    (sum, row) => sum + row.impressions,
    0
  );

  const weightedPosition =
    totalImpressions > 0
      ? rankings.reduce(
          (sum, row) =>
            sum + row.position * row.impressions,
          0
        ) / totalImpressions
      : 0;

  return {
    totalQueries: rankings.length,
    protect: rankings.filter(
      (row) => row.action === "protect"
    ).length,
    improve: rankings.filter(
      (row) => row.action === "improve"
    ).length,
    opportunity: rankings.filter(
      (row) => row.action === "opportunity"
    ).length,
    totalClicks: rankings.reduce(
      (sum, row) => sum + row.clicks,
      0
    ),
    totalImpressions,
    averagePosition:
      Math.round(weightedPosition * 10) / 10,
    measuredAt: MEASURED_AT,
  };
}
