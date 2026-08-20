import type {
  SeoAuditResult,
  SeoCheck,
  SeoSeverity,
} from "./types";

export function severityWeight(
  severity: SeoSeverity
): number {
  switch (severity) {
    case "critical":
      return 15;
    case "high":
      return 10;
    case "medium":
      return 6;
    case "low":
      return 3;
  }
}

export function calculateSeoScore(
  checks: SeoCheck[]
): number {
  const possible = checks.reduce(
    (sum, check) => sum + check.weight,
    0
  );

  if (possible === 0) {
    return 0;
  }

  const earned = checks.reduce(
    (sum, check) =>
      sum + (check.passed ? check.weight : 0),
    0
  );

  return Math.round((earned / possible) * 100);
}

export function recommendationsFromChecks(
  checks: SeoCheck[]
): string[] {
  return checks
    .filter((check) => !check.passed)
    .sort((a, b) => b.weight - a.weight)
    .map((check) => check.message);
}

export function overallSeoScore(
  audits: SeoAuditResult[]
): number {
  if (!audits.length) {
    return 0;
  }

  const total = audits.reduce(
    (sum, audit) => sum + audit.score,
    0
  );

  return Math.round(total / audits.length);
}
