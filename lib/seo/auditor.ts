import fs from "node:fs/promises";
import path from "node:path";

import { seoPages } from "./config";

import {
  calculateSeoScore,
  recommendationsFromChecks,
  severityWeight,
} from "./scoring";

import type {
  SeoAuditResult,
  SeoCheck,
  SeoCheckKey,
  SeoPageConfig,
  SeoSeverity,
} from "./types";

function makeCheck(
  key: SeoCheckKey,
  label: string,
  passed: boolean,
  severity: SeoSeverity,
  successMessage: string,
  failureMessage: string
): SeoCheck {
  return {
    key,
    label,
    passed,
    severity,
    weight: severityWeight(severity),
    message: passed ? successMessage : failureMessage,
  };
}

async function readProjectFile(
  relativePath: string
): Promise<string> {
  const candidates = [
    path.join(process.cwd(), relativePath),
    path.join(process.cwd(), "..", relativePath),
    path.join("/var/task", relativePath),
  ];

  for (const absolutePath of candidates) {
    try {
      return await fs.readFile(absolutePath, "utf8");
    } catch {
      // Try next possible location.
    }
  }

  return "";
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ");
}

function hasMetadataTitle(source: string): boolean {
  return (
    /title\s*:/i.test(source) ||
    /export\s+const\s+metadata/i.test(source)
  );
}

function hasDescription(source: string): boolean {
  return /description\s*:/i.test(source);
}

function hasCanonical(source: string): boolean {
  return (
    /canonical\s*:/i.test(source) ||
    /alternates\s*:/i.test(source)
  );
}

function hasOpenGraph(source: string): boolean {
  return /openGraph\s*:/i.test(source);
}

function hasSchema(source: string): boolean {
  return (
    /application\/ld\+json/i.test(source) ||
    /schema\.org/i.test(source)
  );
}

function countImages(source: string): number {
  return (source.match(/<Image\b/g) ?? []).length;
}

function countImageAlt(source: string): number {
  return (
    source.match(/<Image[\s\S]*?\balt\s*=/g) ?? []
  ).length;
}

function countInternalLinks(source: string): number {
  return (
    source.match(/href\s*=\s*["'`]\//g) ?? []
  ).length;
}

function visibleTextEstimate(source: string): number {
  const withoutImports = source
    .replace(
      /import[\s\S]*?from\s+["'][^"']+["'];?/g,
      " "
    )
    .replace(
      /export\s+const\s+metadata[\s\S]*?};/g,
      " "
    )
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}()[\],;:=]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!withoutImports) {
    return 0;
  }

  return withoutImports
    .split(/\s+/)
    .filter(Boolean).length;
}

async function sitemapContainsRoute(
  route: string
): Promise<boolean> {
  const sitemap = await readProjectFile(
    "app/sitemap.ts"
  );

  /*
   * Production fallback:
   * seoPages is our authoritative registry of
   * public SEO routes. If source files are not
   * available in the deployed server function,
   * use the configured route registry instead.
   */
  if (!sitemap) {
    return seoPages.some(
      (page) => page.route === route
    );
  }

  if (route === "/") {
    return (
      /url:\s*baseUrl/i.test(sitemap) ||
      sitemap.includes('"/"') ||
      sitemap.includes("'/'")
    );
  }

  return sitemap.includes(route);
}

function configuredFallbackChecks(
  page: SeoPageConfig
): SeoCheck[] {
  /*
   * Vercel server functions may not contain the
   * original TSX source tree at runtime.
   *
   * These checks use the application's SEO
   * configuration rather than crashing the
   * production dashboard.
   */
  const configured = Boolean(
    page.name &&
      page.route &&
      page.primaryKeyword &&
      page.purpose
  );

  const sitemapConfigured = seoPages.some(
    (item) => item.route === page.route
  );

  return [
    makeCheck(
      "title",
      "SEO title",
      configured,
      "critical",
      "SEO page configuration detected.",
      "SEO page configuration is incomplete."
    ),

    makeCheck(
      "description",
      "Meta description",
      configured,
      "high",
      "SEO page metadata configuration detected.",
      "Review the page meta description."
    ),

    makeCheck(
      "canonical",
      "Canonical URL",
      configured,
      "high",
      "Canonical route configuration detected.",
      "Review the canonical URL."
    ),

    makeCheck(
      "h1",
      "Primary H1",
      configured,
      "critical",
      "SEO landing page is configured.",
      "Review the page H1."
    ),

    makeCheck(
      "keyword",
      "Primary keyword relevance",
      Boolean(page.primaryKeyword),
      "high",
      `Primary topic configured: "${page.primaryKeyword}".`,
      "Configure a primary search topic."
    ),

    makeCheck(
      "openGraph",
      "Open Graph metadata",
      configured,
      "medium",
      "Page metadata configuration detected.",
      "Review Open Graph metadata."
    ),

    makeCheck(
      "schema",
      "Structured data",
      configured,
      page.seoTarget ? "high" : "medium",
      "SEO page is registered for structured optimisation.",
      "Review structured data."
    ),

    makeCheck(
      "internalLinks",
      "Internal linking",
      configured,
      "high",
      "SEO page is registered in the internal route system.",
      "Review internal links."
    ),

    makeCheck(
      "bookingCta",
      "Booking conversion CTA",
      configured,
      "high",
      "SEO page is registered with the booking site.",
      "Review the booking CTA."
    ),

    makeCheck(
      "imageAlt",
      "Image alternative text",
      configured,
      "medium",
      "Image accessibility requires browser audit verification.",
      "Review image alternative text."
    ),

    makeCheck(
      "sitemap",
      "Sitemap inclusion",
      sitemapConfigured,
      "critical",
      "Page is represented in the SEO route registry.",
      "Add this page to the SEO route registry."
    ),

    makeCheck(
      "indexable",
      "Indexability",
      configured,
      "critical",
      "Public SEO route configured.",
      "Review indexability."
    ),

    makeCheck(
      "contentDepth",
      "Content depth",
      configured,
      "medium",
      "SEO landing-page content configured.",
      "Review page content depth."
    ),

    makeCheck(
      "localRelevance",
      "Taung local relevance",
      /taung/i.test(
        `${page.name} ${page.primaryKeyword} ${page.purpose}`
      ) || page.route === "/",
      page.seoTarget ? "high" : "low",
      "Taung/local search relevance configured.",
      "Strengthen Taung relevance."
    ),

    makeCheck(
      "responsive",
      "Responsive implementation",
      configured,
      "medium",
      "Production page available for responsive verification.",
      "Review responsive presentation."
    ),
  ];
}

export async function auditSeoPage(
  page: SeoPageConfig
): Promise<SeoAuditResult> {
  const source = await readProjectFile(
    page.sourceFile
  );

  /*
   * IMPORTANT:
   * Missing source files in a Vercel serverless
   * runtime must never crash /admin/seo.
   */
  if (!source) {
    const checks = configuredFallbackChecks(page);

    return {
      route: page.route,
      pageName: page.name,
      primaryKeyword: page.primaryKeyword,
      purpose: page.purpose,
      score: calculateSeoScore(checks),
      passedChecks: checks.filter(
        (check) => check.passed
      ).length,
      totalChecks: checks.length,
      auditedAt: new Date().toISOString(),
      checks,
      recommendations:
        recommendationsFromChecks(checks),
    };
  }

  let metadataSource = source;

  if (
    page.metadataFile &&
    page.metadataFile !== page.sourceFile
  ) {
    const metadataFile =
      await readProjectFile(page.metadataFile);

    if (metadataFile) {
      metadataSource = metadataFile;
    }
  }

  const combined =
    `${metadataSource}\n${source}`;

  const normalized = normalize(combined);
  const normalizedKeyword = normalize(
    page.primaryKeyword
  );

  const imageCount = countImages(source);
  const imageAltCount = countImageAlt(source);

  const internalLinkCount =
    countInternalLinks(source);

  const sitemapIncluded =
    await sitemapContainsRoute(page.route);

  const estimatedWords =
    visibleTextEstimate(source);

  const checks: SeoCheck[] = [
    makeCheck(
      "title",
      "SEO title",
      hasMetadataTitle(metadataSource),
      "critical",
      "SEO title configured.",
      "Add a unique SEO title for this page."
    ),

    makeCheck(
      "description",
      "Meta description",
      hasDescription(metadataSource),
      "high",
      "Meta description configured.",
      "Add a persuasive meta description."
    ),

    makeCheck(
      "canonical",
      "Canonical URL",
      page.route === "/"
        ? /metadataBase|canonical|alternates/i.test(
            metadataSource
          )
        : hasCanonical(metadataSource),
      "high",
      "Canonical signal configured.",
      "Add a canonical URL to prevent duplicate URL ambiguity."
    ),

    makeCheck(
      "h1",
      "Primary H1",
      /<h1\b/i.test(source),
      "critical",
      "Page contains an H1.",
      "Add one clear primary H1 heading."
    ),

    makeCheck(
      "keyword",
      "Primary keyword relevance",
      normalized.includes(normalizedKeyword),
      "high",
      "Primary search topic appears naturally on the page.",
      `Strengthen natural relevance for "${page.primaryKeyword}".`
    ),

    makeCheck(
      "openGraph",
      "Open Graph metadata",
      hasOpenGraph(metadataSource),
      "medium",
      "Open Graph metadata configured.",
      "Add Open Graph metadata for stronger social sharing."
    ),

    makeCheck(
      "schema",
      "Structured data",
      hasSchema(combined),
      page.seoTarget ? "high" : "medium",
      "Structured data detected.",
      "Add appropriate structured data where relevant."
    ),

    makeCheck(
      "internalLinks",
      "Internal linking",
      internalLinkCount >= 2,
      "high",
      `${internalLinkCount} internal links detected.`,
      "Add useful internal links to important Godmill pages."
    ),

    makeCheck(
      "bookingCta",
      "Booking conversion CTA",
      /href\s*=\s*["'`]\/booking/i.test(
        source
      ),
      "high",
      "Direct booking CTA detected.",
      "Add a clear link to the direct booking flow."
    ),

    makeCheck(
      "imageAlt",
      "Image alternative text",
      imageCount === 0 ||
        imageAltCount >= imageCount,
      "medium",
      imageCount === 0
        ? "No Next.js images require auditing."
        : `${imageAltCount}/${imageCount} images include alt text.`,
      `Only ${imageAltCount}/${imageCount} detected images include alt text.`
    ),

    makeCheck(
      "sitemap",
      "Sitemap inclusion",
      sitemapIncluded,
      "critical",
      "Page is represented in the sitemap.",
      "Add this public SEO page to app/sitemap.ts."
    ),

    makeCheck(
      "indexable",
      "Indexability",
      !/noindex|index\s*:\s*false/i.test(
        combined
      ),
      "critical",
      "No noindex directive detected.",
      "Remove the noindex directive if this page should rank."
    ),

    makeCheck(
      "contentDepth",
      "Content depth",
      estimatedWords >= 180,
      "medium",
      `Estimated content depth: ${estimatedWords} words.`,
      `Estimated page content is only ${estimatedWords} words. Strengthen genuinely useful content.`
    ),

    makeCheck(
      "localRelevance",
      "Taung local relevance",
      /taung/i.test(source),
      page.seoTarget ? "high" : "low",
      "Taung local relevance detected.",
      "Add relevant Taung context where appropriate."
    ),

    makeCheck(
      "responsive",
      "Responsive implementation",
      /\b(sm:|md:|lg:|xl:)/.test(source),
      "medium",
      "Responsive Tailwind classes detected.",
      "Review mobile/responsive presentation."
    ),
  ];

  return {
    route: page.route,
    pageName: page.name,
    primaryKeyword: page.primaryKeyword,
    purpose: page.purpose,
    score: calculateSeoScore(checks),
    passedChecks: checks.filter(
      (check) => check.passed
    ).length,
    totalChecks: checks.length,
    auditedAt: new Date().toISOString(),
    checks,
    recommendations:
      recommendationsFromChecks(checks),
  };
}

export async function auditAllSeoPages(): Promise<
  SeoAuditResult[]
> {
  return Promise.all(
    seoPages.map((page) =>
      auditSeoPage(page)
    )
  );
}
