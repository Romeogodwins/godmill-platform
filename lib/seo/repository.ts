import {
  createSupabaseAdminClient,
} from "../supabase/admin";

import {
  defaultSeoTasks,
  seoKeywords,
} from "./config";

import type {
  SeoAuditResult,
  SeoKeyword,
  SeoTask,
} from "./types";

function isMissingSeoTableError(
  error: unknown
): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    "message" in error
      ? String(error.message)
      : "";

  return (
    message.includes("seo_") ||
    message.includes("does not exist") ||
    message.includes("schema cache")
  );
}

export async function getSeoKeywords(): Promise<
  SeoKeyword[]
> {
  try {
    const supabase =
      createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("seo_keywords")
      .select(
        "keyword,target_page,intent,priority,cluster,active"
      )
      .eq("active", true)
      .order("priority");

    if (error) {
      if (isMissingSeoTableError(error)) {
        return seoKeywords;
      }

      throw error;
    }

    if (!data?.length) {
      return seoKeywords;
    }

    return data.map((row) => ({
      keyword: row.keyword,
      targetPage: row.target_page,
      intent: row.intent,
      priority: row.priority,
      cluster: row.cluster,
      active: row.active,
    }));
  } catch {
    return seoKeywords;
  }
}

export async function getSeoTasks(): Promise<
  SeoTask[]
> {
  try {
    const supabase =
      createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("seo_tasks")
      .select(
        "id,title,description,priority,category,status"
      )
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      if (isMissingSeoTableError(error)) {
        return defaultSeoTasks;
      }

      throw error;
    }

    if (!data?.length) {
      return defaultSeoTasks;
    }

    return data as SeoTask[];
  } catch {
    return defaultSeoTasks;
  }
}

export async function saveAuditSnapshot(
  audits: SeoAuditResult[]
): Promise<void> {
  try {
    const supabase =
      createSupabaseAdminClient();

    const rows = audits.map((audit) => ({
      page_route: audit.route,
      page_name: audit.pageName,
      primary_keyword:
        audit.primaryKeyword,
      score: audit.score,
      passed_checks:
        audit.passedChecks,
      total_checks: audit.totalChecks,
      audit_json: audit,
      audited_at: audit.auditedAt,
    }));

    const { error } = await supabase
      .from("seo_audits")
      .insert(rows);

    if (
      error &&
      !isMissingSeoTableError(error)
    ) {
      throw error;
    }
  } catch {
    // Persistence must never prevent the
    // SEO audit engine from functioning.
  }
}
