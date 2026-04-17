"use server";

import { after } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { runAuditPipeline, type DocInput } from "./pipeline";
import { revalidatePath } from "next/cache";

type AuditReportData = {
  confidence_score: number;
  total_savings_eur: number;
  summary: string;
  findings: Array<{
    severity: "info" | "warning" | "critical";
    category: string;
    title: string;
    promised_value?: string;
    actual_value?: string;
    recommendation: string;
    confidence: number;
    savings_eur?: number;
  }>;
};

export async function startAuditAction(folderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: documents, error: docsErr } = await supabase
    .from("documents")
    .select("*")
    .eq("folder_id", folderId)
    .eq("user_id", user.id);

  if (docsErr) throw docsErr;
  if (!documents || documents.length === 0) throw new Error("Aucun document dans ce dossier");

  const { data: audit, error: auditErr } = await supabase
    .from("audits")
    .insert({
      folder_id: folderId,
      user_id: user.id,
      status: "processing",
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (auditErr || !audit) throw auditErr ?? new Error("Échec création audit");

  // Lance le pipeline EN ARRIÈRE-PLAN — on redirige immédiatement
  after(async () => {
    await runPipelineBackground(audit.id, folderId, user.id, documents);
  });

  revalidatePath(`/folders/${folderId}`);
  return { auditId: audit.id, status: "processing" as const };
}

async function runPipelineBackground(
  auditId: string,
  folderId: string,
  userId: string,
  documents: Array<{
    id: string;
    type: string;
    storage_path: string;
    filename: string;
    mime_type: string;
    size_bytes: number;
  }>
) {
  const svc = createServiceClient();

  try {
    const docsInput: DocInput[] = await Promise.all(
      documents.map(async (d) => {
        const { data } = await svc.storage.from("documents").download(d.storage_path);
        if (!data) throw new Error(`Impossible de télécharger ${d.filename}`);
        const buffer = Buffer.from(await data.arrayBuffer());
        return {
          id: d.id,
          type: d.type as DocInput["type"],
          base64: buffer.toString("base64"),
          mimeType: d.mime_type,
        };
      })
    );

    const result = await runAuditPipeline(docsInput);
    const report = result.report as AuditReportData | null;

    if (!report) throw new Error("Rapport IA vide");

    await svc
      .from("audits")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        confidence_score: report.confidence_score,
        total_savings_eur: report.total_savings_eur,
        findings_count: report.findings.length,
        report: report,
        tokens_input: result.metadata.tokens_input,
        tokens_output: result.metadata.tokens_output,
        cost_eur: result.metadata.cost_eur,
      })
      .eq("id", auditId);

    const findingsRows = report.findings.map((f) => ({
      audit_id: auditId,
      severity: f.severity,
      category: f.category,
      title: f.title,
      promised_value: f.promised_value ?? null,
      actual_value: f.actual_value ?? null,
      recommendation: f.recommendation,
      confidence: f.confidence,
      savings_eur: f.savings_eur ?? null,
    }));

    if (findingsRows.length > 0) {
      await svc.from("audit_findings").insert(findingsRows);
    }

    await maybePushToBenchmark(userId, result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    await svc
      .from("audits")
      .update({ status: "failed", error_message: msg })
      .eq("id", auditId);
  }
}

async function maybePushToBenchmark(userId: string, result: Awaited<ReturnType<typeof runAuditPipeline>>) {
  const svc = createServiceClient();
  const { data: profile } = await svc
    .from("profiles")
    .select("data_consent")
    .eq("id", userId)
    .single();

  if (!profile?.data_consent) return;

  type ContractShape = {
    supplier_name?: string;
    contract_type?: string;
    monthly_price_eur?: number;
    duration_months?: number;
    notice_period_days?: number;
    indexation_rate_pct?: number;
  };
  const c = (result.contract as ContractShape | null) ?? null;
  if (!c) return;

  const crypto = await import("crypto");
  const hash = crypto
    .createHash("sha256")
    .update(`${userId}-${c.supplier_name ?? ""}-${c.monthly_price_eur ?? ""}`)
    .digest("hex");

  await svc.from("benchmark_entries").insert({
    supplier_name: c.supplier_name ?? null,
    sector: null,
    contract_type: c.contract_type ?? null,
    monthly_price_eur: c.monthly_price_eur ?? null,
    duration_months: c.duration_months ?? null,
    notice_period_days: c.notice_period_days ?? null,
    indexation_rate_pct: c.indexation_rate_pct ?? null,
    source_audit_hash: hash,
  });
}
