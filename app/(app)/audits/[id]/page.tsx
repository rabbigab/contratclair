import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { formatDate, formatEur } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingDown,
  AlertTriangle,
  Info,
  XCircle,
  ArrowLeft,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { AuditLoading } from "./audit-loading";

export const maxDuration = 300;

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: audit } = await supabase
    .from("audits")
    .select("*, folders(name, supplier_name)")
    .eq("id", id)
    .single();
  if (!audit) notFound();

  const { data: findings } = await supabase
    .from("audit_findings")
    .select("*")
    .eq("audit_id", id)
    .order("savings_eur", { ascending: false });

  if (audit.status === "processing" || audit.status === "pending") {
    return <AuditLoading />;
  }

  if (audit.status === "failed") {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <Link href={`/folders/${audit.folder_id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au dossier
          </Button>
        </Link>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-10 text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="mt-4 text-xl font-bold">Analyse échouée</h1>
            <p className="mt-2 text-sm text-muted-foreground">{audit.error_message}</p>
            <Link href={`/folders/${audit.folder_id}`} className="mt-6 inline-block">
              <Button>Retenter l&apos;audit</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const critical = (findings ?? []).filter((f) => f.severity === "critical");
  const warnings = (findings ?? []).filter((f) => f.severity === "warning");
  const infos = (findings ?? []).filter((f) => f.severity === "info");
  const totalSavings = Number(audit.total_savings_eur) || 0;
  const folder = audit.folders as { name: string; supplier_name: string | null } | null;
  const report = audit.report as { summary?: string } | null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Link href={`/folders/${audit.folder_id}`}>
        <Button variant="ghost" className="-ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au dossier
        </Button>
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rapport d&apos;audit</h1>
          {folder && (
            <p className="mt-1 text-muted-foreground">
              {folder.name}
              {folder.supplier_name ? ` · ${folder.supplier_name}` : ""}
            </p>
          )}
        </div>
        <Badge
          variant={audit.confidence_score >= 75 ? "default" : "secondary"}
          className="mt-1 shrink-0 px-3 py-1 text-sm"
        >
          Fiabilité {audit.confidence_score} %
        </Badge>
      </div>

      {/* Hero économies */}
      <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-100">Économies potentielles détectées</p>
            <p className="mt-1 text-5xl font-extrabold tracking-tight">
              {formatEur(totalSavings)}
            </p>
            <p className="mt-1 text-sm text-green-100">
              par an · {findings?.length ?? 0} point{(findings?.length ?? 0) > 1 ? "s" : ""} d&apos;attention
            </p>
          </div>
          <TrendingDown className="h-20 w-20 shrink-0 opacity-20" />
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">
            {critical.length} critique{critical.length !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {warnings.length} alerte{warnings.length !== 1 ? "s" : ""}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {infos.length} info{infos.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Synthèse */}
      {report?.summary && (
        <Card>
          <CardContent className="py-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Synthèse exécutive
            </p>
            <p className="text-sm leading-relaxed">{report.summary}</p>
          </CardContent>
        </Card>
      )}

      {critical.length > 0 && (
        <FindingSection
          title="Clauses pièges & écarts critiques"
          icon={<ShieldAlert className="h-5 w-5 text-destructive" />}
          items={critical}
          leftBorder="border-l-destructive"
          bgColor="bg-destructive/5"
          badgeClass="bg-destructive/10 text-destructive border-destructive/20"
        />
      )}
      {warnings.length > 0 && (
        <FindingSection
          title="Points de vigilance"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          items={warnings}
          leftBorder="border-l-amber-400"
          bgColor="bg-amber-50/80"
          badgeClass="bg-amber-100 text-amber-700 border-amber-200"
        />
      )}
      {infos.length > 0 && (
        <FindingSection
          title="Informations"
          icon={<Info className="h-5 w-5 text-blue-500" />}
          items={infos}
          leftBorder="border-l-blue-300"
          bgColor="bg-blue-50/50"
          badgeClass="bg-blue-100 text-blue-700 border-blue-200"
        />
      )}

      <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
        <span>Analysé par Claude AI · {formatDate(audit.completed_at ?? audit.created_at)}</span>
        {audit.cost_eur && <span>Coût analyse : {formatEur(Number(audit.cost_eur))}</span>}
      </div>
    </div>
  );
}

type Finding = {
  id: string;
  title: string;
  category: string;
  promised_value: string | null;
  actual_value: string | null;
  recommendation: string;
  savings_eur: number | null;
  confidence: number;
};

function FindingSection({
  title, icon, items, leftBorder, bgColor, badgeClass,
}: {
  title: string;
  icon: React.ReactNode;
  items: Finding[];
  leftBorder: string;
  bgColor: string;
  badgeClass: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="font-semibold">
          {title} <span className="font-normal text-muted-foreground">({items.length})</span>
        </h2>
      </div>
      {items.map((f) => (
        <div key={f.id} className={`rounded-xl border border-l-4 ${leftBorder} ${bgColor} px-4 py-4`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold">{f.title}</p>
                <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                  {f.category}
                </span>
              </div>
              {(f.promised_value || f.actual_value) && (
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {f.promised_value && (
                    <span><span className="font-medium text-foreground">Promis :</span> {f.promised_value}</span>
                  )}
                  {f.actual_value && (
                    <span><span className="font-medium text-foreground">Réel :</span> {f.actual_value}</span>
                  )}
                </div>
              )}
              <div className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium text-primary">{f.recommendation}</p>
              </div>
            </div>
            {f.savings_eur && Number(f.savings_eur) > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-green-600">{formatEur(Number(f.savings_eur))}</p>
                <p className="text-xs text-muted-foreground">/an</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
