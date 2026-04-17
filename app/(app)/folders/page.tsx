import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatEur } from "@/lib/utils";
import { FolderPlus, TrendingDown, Clock } from "lucide-react";

export default async function FoldersPage() {
  const supabase = await createClient();

  const { data: folders } = await supabase
    .from("folders")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Latest audit per folder
  const folderAudits: Record<string, { id: string; status: string; total_savings_eur: number | null }> = {};
  if (folders && folders.length > 0) {
    const { data: audits } = await supabase
      .from("audits")
      .select("id, folder_id, status, total_savings_eur")
      .in("folder_id", folders.map((f) => f.id))
      .order("created_at", { ascending: false });
    for (const a of audits ?? []) {
      if (!folderAudits[a.folder_id]) {
        folderAudits[a.folder_id] = {
          id: a.id,
          status: a.status,
          total_savings_eur: a.total_savings_eur,
        };
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes dossiers</h1>
          {folders && folders.length > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              {folders.length} dossier{folders.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        <Link href="/folders/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
        </Link>
      </div>

      {!folders || folders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FolderPlus className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium">Aucun dossier pour l'instant</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Créez un dossier pour y déposer vos documents et lancer un audit.
            </p>
            <Link href="/folders/new" className="mt-4 inline-block">
              <Button>Créer mon premier dossier</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => {
            const audit = folderAudits[f.id];
            const href = audit ? `/audits/${audit.id}` : `/folders/${f.id}`;
            return (
              <Link key={f.id} href={href}>
                <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="pb-4 pt-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold">{f.name}</h3>
                        {f.supplier_name && (
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {f.supplier_name}
                          </p>
                        )}
                      </div>
                      <AuditBadge status={audit?.status} />
                    </div>

                    {audit?.status === "completed" &&
                      audit.total_savings_eur &&
                      Number(audit.total_savings_eur) > 0 && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <TrendingDown className="h-3.5 w-3.5 text-green-600" />
                          <span className="text-sm font-bold text-green-600">
                            {formatEur(Number(audit.total_savings_eur))}
                          </span>
                          <span className="text-xs text-muted-foreground">/an</span>
                        </div>
                      )}

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(f.created_at)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Add new folder card */}
          <Link href="/folders/new">
            <Card className="h-full cursor-pointer border-dashed transition-shadow hover:shadow-md">
              <CardContent className="flex min-h-[120px] h-full flex-col items-center justify-center pb-4 pt-5 text-muted-foreground">
                <FolderPlus className="mb-2 h-6 w-6" />
                <span className="text-sm font-medium">Nouveau dossier</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}

function AuditBadge({ status }: { status?: string }) {
  if (!status)
    return (
      <Badge variant="outline" className="shrink-0 text-xs">
        Pas d'audit
      </Badge>
    );
  if (status === "completed")
    return (
      <Badge className="shrink-0 border-green-200 bg-green-100 text-xs text-green-700 hover:bg-green-100">
        Complété
      </Badge>
    );
  if (status === "processing" || status === "pending")
    return (
      <Badge variant="outline" className="shrink-0 border-blue-200 text-xs text-blue-600">
        <Clock className="mr-1 h-3 w-3" />
        En cours
      </Badge>
    );
  if (status === "failed")
    return (
      <Badge variant="destructive" className="shrink-0 text-xs">
        Échec
      </Badge>
    );
  return (
    <Badge variant="outline" className="shrink-0 text-xs">
      {status}
    </Badge>
  );
}
