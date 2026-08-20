import fs from "node:fs/promises";
import path from "node:path";

import {
  seoPages,
} from "./config";

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
    message: passed
      ? successMessage
      : failureMessage,
  };
}

async function readProjectFile(
  relativePath: string
): Promise<string> {
  /*
   * The SEO auditor intentionally reads source files dynamically.
   * Turbopack cannot statically determine the target file from
   * relativePath, so this access is deliberately excluded from
   * filesystem tracing.
   */
  const absolute = path.join(
    /* turbopackIgnore: true */
    process.cwd(),
    relativePath
  );

  return fs.readFile(absolute, "utf8");
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
    source.match(
      /<Image[\s\S]*?\balt\s*=/g
    ) ?? []
  ).length;
}

function countInternalLinks(
  source: string
): number {
  return (
    source.match(
      /href\s*=\s*["'`]\//g
    ) ?? []
  ).length;
}

function visibleTextEstimate(
  source: string
): number {
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

  return visibleTextEstimateWordCount(
    withoutImports
  );
}

function visibleTextEstimateWordCount(
  text: string
): number {
  if (!text) {
    return 0;
  }

  return text.split(/\s+/).filter(Boolean).length;
}

async function sitemapContainsRoute(
  route: string
): Promise<boolean> {
  const sitemap = await readProjectFile(
    "app/sitemap.ts"
  );

  if (route === "/") {
    return /url:\s*baseUrl/i.test(sitemap);
  }

  return (
    sitemap.includes(
      `${"${baseUrl}"}${route}`
    ) || sitemap.includes(route)
  );
}

export async function auditSeoPage(
  page: SeoPageConfig
): Promise<SeoAuditResult> {
  const source = await readProjectFile(
    page.sourceFile
  );

  const metadataSource =
    page.metadataFile &&
    page.metadataFile !== page.sourceFile
      ? await readProjectFile(page.metadataFile)
      : source;

  const combined = `${metadataSource}\n${source}`;

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
      /href\s*=\s*["']\/booking["']/i.test(
        source
      ) ||
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

  const score = calculateSeoScore(checks);

  return {
    route: page.route,
    pageName: page.name,
    primaryKeyword: page.primaryKeyword,
    purpose: page.purpose,
    score,
    passedChecks:
      checks.filter((check) => check.passed)
        .length,
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