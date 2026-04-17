"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { startAuditAction } from "@/lib/audit/actions";

export function StartAuditButton({ folderId, disabled }: { folderId: string; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await startAuditAction(folderId);
      router.push(`/audits/${res.auditId}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={disabled || loading}>
        <Play className="mr-2 h-4 w-4" />
        {loading ? "Analyse en cours..." : "Lancer l'audit"}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
