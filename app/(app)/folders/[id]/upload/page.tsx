"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X } from "lucide-react";
import { use } from "react";

type PendingFile = {
  file: File;
  type: "contract" | "proposal" | "invoice" | "unknown";
};

export default function UploadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: folderId } = use(params);
  const router = useRouter();
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: 25 * 1024 * 1024,
    onDrop: (accepted) => {
      setFiles((prev) => [
        ...prev,
        ...accepted.map((f) => ({ file: f, type: guessType(f.name) })),
      ]);
    },
  });

  function updateType(i: number, type: PendingFile["type"]) {
    setFiles((prev) => prev.map((f, idx) => (idx === i ? { ...f, type } : f)));
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleUpload() {
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      for (const pf of files) {
        const path = `${user.id}/${folderId}/${Date.now()}-${pf.file.name}`;
        const { error: upErr } = await supabase.storage.from("documents").upload(path, pf.file);
        if (upErr) throw upErr;

        const { error: dbErr } = await supabase.from("documents").insert({
          folder_id: folderId,
          user_id: user.id,
          type: pf.type,
          storage_path: path,
          filename: pf.file.name,
          mime_type: pf.file.type,
          size_bytes: pf.file.size,
        });
        if (dbErr) throw dbErr;
      }
      router.push(`/app/folders/${folderId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">Uploader des documents</h1>

      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium">
              {isDragActive
                ? "Déposez vos fichiers ici"
                : "Glissez votre Contrat + Devis + Facture"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              PDF, JPG, PNG · 25 Mo max par fichier
            </p>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fichiers à uploader ({files.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {files.map((pf, i) => (
              <div key={i} className="flex items-center gap-3 rounded border p-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 truncate">
                  <p className="truncate font-medium">{pf.file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(pf.file.size / 1024).toFixed(0)} Ko
                  </p>
                </div>
                <select
                  value={pf.type}
                  onChange={(e) => updateType(i, e.target.value as PendingFile["type"])}
                  className="rounded border px-2 py-1 text-sm"
                >
                  <option value="contract">Contrat</option>
                  <option value="proposal">Devis</option>
                  <option value="invoice">Facture</option>
                  <option value="unknown">À classer</option>
                </select>
                <Button variant="ghost" size="icon" onClick={() => removeFile(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Upload..." : "Uploader tous les fichiers"}
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function guessType(name: string): PendingFile["type"] {
  const n = name.toLowerCase();
  if (/(contrat|contract|bail|convention)/.test(n)) return "contract";
  if (/(devis|proposition|proposal|offre|quote)/.test(n)) return "proposal";
  if (/(facture|invoice|bill)/.test(n)) return "invoice";
  return "unknown";
}
