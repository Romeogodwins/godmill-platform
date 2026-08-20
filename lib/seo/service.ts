import {
  auditAllSeoPages,
  auditSeoPage,
} from "./auditor";

import {
  seoPages,
} from "./config";

import {
  getSeoKeywords,
  getSeoTasks,
  saveAuditSnapshot,
} from "./repository";

import {
  overallSeoScore,
} from "./scoring";

import type {
  SeoOverview,
} from "./types";

export async function runFullSeoAudit() {
  const audits = await auditAllSeoPages();

  await saveAuditSnapshot(audits);

  return audits;
}

export async function runSeoAuditForRoute(
  route: string
) {
  const page = seoPages.find(
    (item) => item.route === route
  );

  if (!page) {
    return null;
  }

  return auditSeoPage(page);
}

export async function getSeoOverview(): Promise<
  SeoOverview
> {
  const [audits, keywords, tasks] =
    await Promise.all([
      auditAllSeoPages(),
      getSeoKeywords(),
      getSeoTasks(),
    ]);

  const allChecks = audits.flatMap(
    (audit) => audit.checks
  );

  return {
    score: overallSeoScore(audits),
    pagesAudited: audits.length,
    passedChecks: allChecks.filter(
      (check) => check.passed
    ).length,
    totalChecks: allChecks.length,
    criticalIssues: allChecks.filter(
      (check) =>
        !check.passed &&
        check.severity === "critical"
    ).length,
    highIssues: allChecks.filter(
      (check) =>
        !check.passed &&
        check.severity === "high"
    ).length,
    keywords,
    audits,
    tasks,
    generatedAt: new Date().toISOString(),
  };
}
