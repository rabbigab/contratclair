import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FolderPlus } from "lucide-react";

export default async function FoldersPage() {
  const supabase = await createClient();
  const { data: folders } = await supabase
    .from("folders")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes dossiers</h1>
        <Link href="/app/folders/new">
          <Button>
            <FolderPlus className="mr-2 h-4 w-4" />
            Nouveau dossier
          </Button>
        </Link>
      </div>

      {!folders || folders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun dossier. Créez-en un pour commencer.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => (
            <Link key={f.id} href={`/app/folders/${f.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <h3 className="font-semibold">{f.name}</h3>
                  {f.supplier_name && (
                    <p className="text-sm text-muted-foreground">{f.supplier_name}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(f.created_at)}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
