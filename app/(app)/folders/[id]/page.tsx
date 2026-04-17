import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur } from "@/lib/utils";
import {
  Upload,
  CheckCircle2,
  Circle,
  TrendingDown,
  Clock,
  XCircle,
  FileText,
  Receipt,
  FileCheck,
} from "lucide-react";
import { StartAuditButton } from "./start-audit-button";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: folder } = await supabase
    .from("folders")
    .select("*")
    .eq("id", id)
    .single();
  if (!folder) notFound();

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("folder_id", id)
    .order("created_at");

  const { data: audits } = await supabase
    .from("audits")
    .select("*")
    .eq("folder_id", id)
    .order("created_at", { ascending: false });

  const docCount = documents?.length ?? 0;
  const types = new Set(documents?.map((d) => d.type) ?? []);
  const hasContract = types.has("contract");
  const hasProposal = types.has("proposal");
  const hasInvoice = types.has("invoice");
  const hasAll3 = hasContract && hasProposal && hasInvoice;

  const latestAudit = audits?.[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{folder.name}</h1>
        {folder.supplier_name && (
          <p className="mt-1 text-muted-foreground">{folder.supplier_name}</p>
        )}
      </div>

      {/* Document checklist + list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Documents ({docCount})</CardTitle>
            <Link href={`/folders/${id}/upload`}>
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trio checklist */}
          <div className="flex flex-wrap gap-3">
            <ChecklistItem
              label="Contrat"
              done={hasContract}
              icon={<FileCheck className="h-3.5 w-3.5" />}
            />
            <ChecklistItem
              label="Devis"
              done={hasProposal}
              icon={<FileText className="h-3.5 w-3.5" />}
            />
            <ChecklistItem
              label="Facture"
              done={hasInvoice}
              icon={<Receipt className="h-3.5 w-3.5" />}
            />
          </div>

          {/* Document list */}
          {docCount > 0 && (
            <ul className="space-y-2">
              {documents!.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{d.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {(d.size_bytes / 1024).toFixed(0)} Ko · {formatDate(d.created_at)}
                    </p>
                  </div>
                  <DocTypeBadge type={d.type} />
                </li>
              ))}
            </ul>
          )}

          {docCount === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Aucun document — uploadez le trio contrat / devis / facture pour lancer l'audit.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Lancer l'audit */}
      {docCount > 0 && (
        <Card className={hasAll3 ? "border-primary/30 bg-primary/5" : ""}>
          <CardContent className="py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold">
                  {hasAll3 ? "Dossier complet — prêt pour l'audit" : "Lancer l'audit"}
                </p>
                {!hasAll3 && (
                  <p className="mt-0.5 text-sm text-amber-600">
                    Pour un résultat optimal, ajoutez le{" "}
                    <strong>trio gagnant</strong> : Contrat + Devis + Facture
                  </p>
                )}
                {hasAll3 && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Contrat · Devis · Facture sont présents ✓
                  </p>
                )}
              </div>
              <StartAuditButton folderId={id} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit history */}
      {audits && audits.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Historique des audits ({audits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {audits.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <AuditStatusIcon status={a.status} />
                    <div>
                      <p className="text-sm font-medium">
                        Audit du {formatDate(a.created_at)}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{a.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.total_savings_eur && Number(a.total_savings_eur) > 0 && (
                      <span className="flex items-center gap-1 text-sm font-bold text-green-600">
                        <TrendingDown className="h-3.5 w-3.5" />
                        {formatEur(Number(a.total_savings_eur))}
                      </span>
                    )}
                    <Link href={`/audits/${a.id}`}>
                      <Button size="sm" variant="outline">
                        Voir
                      </Button>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ChecklistItem({
  label,
  done,
  icon,
}: {
  label: string;
  done: boolean;
  icon: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
        done
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-dashed border-muted-foreground/30 text-muted-foreground"
      }`}
    >
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <Circle className="h-3.5 w-3.5 opacity-40" />
      )}
      {icon}
      {label}
    </span>
  );
}

function DocTypeBadge({ type }: { type: string }) {
  const map: Record<string, { label: string; className: string }> = {
    contract: { label: "Contrat", className: "bg-blue-100 text-blue-700 border-blue-200" },
    proposal: { label: "Devis", className: "bg-amber-100 text-amber-700 border-amber-200" },
    invoice: { label: "Facture", className: "bg-green-100 text-green-700 border-green-200" },
    unknown: { label: "Inconnu", className: "bg-muted text-muted-foreground border-muted" },
  };
  const cfg = map[type] ?? { label: type, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

function AuditStatusIcon({ status }: { status: string }) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />;
  if (status === "processing" || status === "pending")
    return <Clock className="h-4 w-4 text-blue-500 shrink-0 animate-pulse" />;
  if (status === "failed")
    return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
  return <Circle className="h-4 w-4 text-muted-foreground shrink-0" />;
}
