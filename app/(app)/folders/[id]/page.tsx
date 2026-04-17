import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur } from "@/lib/utils";
import { Upload, Play } from "lucide-react";
import { StartAuditButton } from "./start-audit-button";

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: folder } = await supabase.from("folders").select("*").eq("id", id).single();
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
  const hasAll3 = ["contract", "proposal", "invoice"].every((t) => types.has(t));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{folder.name}</h1>
        {folder.supplier_name && <p className="text-muted-foreground">{folder.supplier_name}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents ({docCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {docCount === 0 ? (
            <p className="text-muted-foreground">Aucun document uploadé.</p>
          ) : (
            <ul className="space-y-2">
              {documents!.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="font-medium">{d.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {(d.size_bytes / 1024).toFixed(0)} Ko · {formatDate(d.created_at)}
                    </p>
                  </div>
                  <Badge variant={d.type === "unknown" ? "outline" : "secondary"}>{labelType(d.type)}</Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex gap-3">
            <Link href={`/folders/${id}/upload`}>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Ajouter des documents
              </Button>
            </Link>
            {docCount > 0 && (
              <StartAuditButton folderId={id} disabled={false} />
            )}
          </div>
          {docCount > 0 && !hasAll3 && (
            <p className="mt-3 text-sm text-amber-600">
              Pour un audit complet, uploadez le <strong>trio gagnant</strong> : Contrat + Devis + Facture.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audits</CardTitle>
        </CardHeader>
        <CardContent>
          {!audits || audits.length === 0 ? (
            <p className="text-muted-foreground">Aucun audit. Lancez-en un depuis le bouton ci-dessus.</p>
          ) : (
            <ul className="space-y-2">
              {audits.map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded border p-3">
                  <div>
                    <p className="font-medium">Audit du {formatDate(a.created_at)}</p>
                    <p className="text-xs text-muted-foreground">Statut : {a.status}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.total_savings_eur && (
                      <span className="font-semibold text-green-600">
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function labelType(t: string) {
  return { contract: "Contrat", proposal: "Devis", invoice: "Facture", unknown: "Inconnu" }[t] ?? t;
}
