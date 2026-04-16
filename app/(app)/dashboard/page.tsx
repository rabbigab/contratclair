import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEur } from "@/lib/utils";
import { FileText, TrendingDown, FolderPlus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: foldersCount } = await supabase
    .from("folders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user!.id);

  const { data: audits } = await supabase
    .from("audits")
    .select("total_savings_eur, findings_count")
    .eq("user_id", user!.id)
    .eq("status", "completed");

  const totalSavings = (audits ?? []).reduce(
    (sum, a) => sum + (Number(a.total_savings_eur) || 0),
    0
  );
  const totalFindings = (audits ?? []).reduce(
    (sum, a) => sum + (a.findings_count || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/app/folders/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Économies détectées</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatEur(totalSavings)}</div>
            <p className="text-xs text-muted-foreground">Sur {audits?.length ?? 0} audit(s)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Dossiers</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foldersCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alertes détectées</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFindings}</div>
          </CardContent>
        </Card>
      </div>

      {!audits || audits.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Aucun audit pour l'instant. Créez votre premier dossier pour commencer.
            </p>
            <Link href="/app/folders/new" className="mt-4 inline-block">
              <Button>Créer mon premier dossier</Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
