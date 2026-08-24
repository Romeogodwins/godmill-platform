export type SeoSeverity =
  | "critical"
  | "high"
  | "medium"
  | "low";

export type SeoCheckKey =
  | "title"
  | "description"
  | "canonical"
  | "h1"
  | "keyword"
  | "openGraph"
  | "schema"
  | "internalLinks"
  | "bookingCta"
  | "imageAlt"
  | "sitemap"
  | "indexable"
  | "contentDepth"
  | "localRelevance"
  | "responsive";

export type SeoRankingAction =
  | "protect"
  | "improve"
  | "opportunity";

export interface SeoKeyword {
  keyword: string;
  targetPage: string;
  intent:
    | "brand"
    | "transactional"
    | "commercial"
    | "informational";
  priority: SeoSeverity;
  cluster: string;
  active: boolean;
}

export interface SeoRanking {
  query: string;
  clicks: number;
  impressions: number;
  position: number;
  targetPosition: number;
  targetPage: string;
  action: SeoRankingAction;
  priority: SeoSeverity;
  note: string;
  source: "search-console-baseline";
  measuredAt: string;
}

export interface SeoRankingSummary {
  totalQueries: number;
  protect: number;
  improve: number;
  opportunity: number;
  totalClicks: number;
  totalImpressions: number;
  averagePosition: number;
  measuredAt: string;
}

export interface SeoPageConfig {
  name: string;
  route: string;
  sourceFile: string;
  metadataFile?: string;
  primaryKeyword: string;
  purpose: string;
  seoTarget: boolean;
}

export interface SeoCheck {
  key: SeoCheckKey;
  label: string;
  passed: boolean;
  severity: SeoSeverity;
  weight: number;
  message: string;
}

export interface SeoAuditResult {
  route: string;
  pageName: string;
  primaryKeyword: string;
  purpose: string;
  score: number;
  passedChecks: number;
  totalChecks: number;
  auditedAt: string;
  checks: SeoCheck[];
  recommendations: string[];
}

export interface SeoTask {
  id: string;
  title: string;
  description: string;
  priority: SeoSeverity;
  category:
    | "technical"
    | "content"
    | "local"
    | "reviews"
    | "authority"
    | "conversion";
  status:
    | "todo"
    | "in_progress"
    | "done"
    | "blocked";
}

export interface SeoOverview {
  score: number;
  pagesAudited: number;
  passedChecks: number;
  totalChecks: number;
  criticalIssues: number;
  highIssues: number;
  keywords: SeoKeyword[];
  audits: SeoAuditResult[];
  tasks: SeoTask[];
  rankings: SeoRanking[];
  rankingSummary: SeoRankingSummary;
  generatedAt: string;
}
