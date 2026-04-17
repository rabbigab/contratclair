import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatEur } from "@/lib/utils";
import {
  FileText,
  TrendingDown,
  FolderPlus,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: audits } = await supabase
    .from("audits")
    .select("id, folder_id, total_savings_eur, findings_count, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: folders } = await supabase
    .from("folders")
    .select("id, name, supplier_name, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  // Latest audit per folder
  const folderAudits: Record<string, { id: string; status: string; total_savings_eur: number | null }> = {};
  for (const a of audits ?? []) {
    if (!folderAudits[a.folder_id]) {
      folderAudits[a.folder_id] = {
        id: a.id,
        status: a.status,
        total_savings_eur: a.total_savings_eur,
      };
    }
  }

  const completed = (audits ?? []).filter((a) => a.status === "completed");
  const processing = (audits ?? []).filter(
    (a) => a.status === "processing" || a.status === "pending"
  );
  const totalSavings = completed.reduce(
    (sum, a) => sum + (Number(a.total_savings_eur) || 0),
    0
  );
  const totalFindings = completed.reduce(
    (sum, a) => sum + (a.findings_count || 0),
    0
  );

  const rawName = user.email?.split("@")[0]?.split(".")[0] ?? "";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Bonjour{displayName ? `, ${displayName}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {processing.length > 0
              ? `${processing.length} analyse${processing.length > 1 ? "s" : ""} en cours…`
              : "Votre espace d'audit contractuel"}
          </p>
        </div>
        <Link href="/folders/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">
              Économies détectées
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">
              {formatEur(totalSavings)}
            </div>
            <p className="mt-1 text-xs text-green-600/70">
              Sur {completed.length} audit{completed.length !== 1 ? "s" : ""} complété
              {completed.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dossiers analysés</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completed.length}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {folders?.length ?? 0} dossier{(folders?.length ?? 0) !== 1 ? "s" : ""} au
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Points d'attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFindings}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Clauses & écarts détectés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      {folders && folders.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dossiers récents</h2>
            <Link href="/folders" className="text-sm text-primary hover:underline">
              Voir tous →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map((folder) => {
              const audit = folderAudits[folder.id];
              const href = audit ? `/audits/${audit.id}` : `/folders/${folder.id}`;
              return (
                <Link key={folder.id} href={href} className="block">
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                    <CardContent className="pb-4 pt-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{folder.name}</p>
                          {folder.supplier_name && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {folder.supplier_name}
                            </p>
                          )}
                        </div>
                        <AuditStatusBadge status={audit?.status} />
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
                        {formatDate(folder.created_at)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
            <Link href="/folders/new">
              <Card className="h-full cursor-pointer border-dashed transition-shadow hover:shadow-md">
                <CardContent className="flex min-h-[110px] h-full flex-col items-center justify-center pb-4 pt-5 text-muted-foreground">
                  <FolderPlus className="mb-2 h-6 w-6" />
                  <span className="text-sm font-medium">Nouveau dossier</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Commencez votre premier audit</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Uploadez vos contrats, devis et factures. Notre IA détecte les clauses
              pièges et les économies potentielles en 1–2 minutes.
            </p>
            <Link href="/folders/new" className="mt-6 inline-block">
              <Button size="lg">
                <FolderPlus className="mr-2 h-4 w-4" />
                Créer mon premier dossier
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AuditStatusBadge({ status }: { status?: string }) {
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
