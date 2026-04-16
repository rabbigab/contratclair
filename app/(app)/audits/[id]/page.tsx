import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEur } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Info, TrendingDown } from "lucide-react";

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: audit } = await supabase.from("audits").select("*").eq("id", id).single();
  if (!audit) notFound();

  const { data: findings } = await supabase
    .from("audit_findings")
    .select("*")
    .eq("audit_id", id)
    .order("severity", { ascending: false });

  if (audit.status === "processing" || audit.status === "pending") {
    return (
      <div className="mx-auto max-w-2xl py-20 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h1 className="mt-6 text-2xl font-bold">Analyse en cours...</h1>
        <p className="mt-2 text-muted-foreground">
          Notre IA audite vos documents. Cela prend généralement 30 à 90 secondes.
        </p>
        <script dangerouslySetInnerHTML={{ __html: "setTimeout(()=>location.reload(),5000)" }} />
      </div>
    );
  }

  if (audit.status === "failed") {
    return (
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardContent className="py-8 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
            <h1 className="mt-4 text-xl font-bold">Analyse échouée</h1>
            <p className="mt-2 text-sm text-muted-foreground">{audit.error_message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const critical = (findings ?? []).filter((f) => f.severity === "critical");
  const warnings = (findings ?? []).filter((f) => f.severity === "warning");
  const infos = (findings ?? []).filter((f) => f.severity === "info");

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapport d'audit</h1>
        <p className="text-muted-foreground">
          Score de confiance : {audit.confidence_score}% · {findings?.length ?? 0} alertes détectées
        </p>
      </div>

      {/* KPI Savings */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="flex items-center justify-between py-6">
          <div>
            <p className="text-sm text-green-900">Économies potentielles détectées</p>
            <p className="text-4xl font-bold text-green-600">
              {formatEur(Number(audit.total_savings_eur) || 0)}
            </p>
            <p className="text-xs text-green-800">par an</p>
          </div>
          <TrendingDown className="h-16 w-16 text-green-600" />
        </CardContent>
      </Card>

      {/* Summary */}
      {audit.report && typeof audit.report === "object" && "summary" in audit.report && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Synthèse</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{(audit.report as { summary: string }).summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Findings by severity */}
      <div className="grid gap-6 md:grid-cols-3">
        <SeverityColumn
          title="🚨 Clauses pièges"
          items={critical}
          color="destructive"
        />
        <SeverityColumn
          title="⚠️ Alertes"
          items={warnings}
          color="warning"
        />
        <SeverityColumn
          title="ℹ️ Informations"
          items={infos}
          color="secondary"
        />
      </div>
    </div>
  );
}

function SeverityColumn({
  title,
  items,
  color,
}: {
  title: string;
  items: Array<{
    id: string;
    title: string;
    category: string;
    promised_value: string | null;
    actual_value: string | null;
    recommendation: string;
    savings_eur: number | null;
    confidence: number;
  }>;
  color: "destructive" | "warning" | "secondary";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title} ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun élément.</p>
        ) : (
          items.map((f) => (
            <div key={f.id} className="rounded border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-semibold">{f.title}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {f.category}
                  </Badge>
                </div>
                {f.savings_eur && (
                  <span className="text-xs font-semibold text-green-600">
                    {formatEur(Number(f.savings_eur))}
                  </span>
                )}
              </div>
              {f.promised_value && (
                <p className="mt-2 text-xs">
                  <span className="text-muted-foreground">Promis :</span> {f.promised_value}
                </p>
              )}
              {f.actual_value && (
                <p className="text-xs">
                  <span className="text-muted-foreground">Réel :</span> {f.actual_value}
                </p>
              )}
              <p className="mt-2 text-xs font-medium text-primary">→ {f.recommendation}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
