"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

const STEPS = [
  { label: "Classification des documents", startAt: 0, endAt: 18 },
  { label: "Extraction des données contrat", startAt: 12, endAt: 40 },
  { label: "Extraction devis & factures", startAt: 20, endAt: 50 },
  { label: "Analyse croisée des écarts", startAt: 40, endAt: 70 },
  { label: "Génération du rapport d'audit", startAt: 65, endAt: 90 },
];

export function AuditLoading() {
  const [elapsed, setElapsed] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const tick = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const reload = setInterval(() => router.refresh(), 10000);
    return () => clearInterval(reload);
  }, [router]);

  const progress = Math.min(92, Math.round((elapsed / 90) * 92));
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeLabel =
    minutes > 0
      ? `${minutes} min ${seconds.toString().padStart(2, "0")} s`
      : `${seconds} s`;

  return (
    <div className="mx-auto max-w-lg py-16">
      <div className="space-y-8 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
          <h1 className="text-xl font-bold">Analyse en cours</h1>
          <p className="text-sm text-muted-foreground">
            Notre IA lit, croise et audite vos documents
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progression</span>
            <span>{progress} %</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const done = elapsed >= step.endAt;
            const active = elapsed >= step.startAt && !done;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  done
                    ? "text-green-600"
                    : active
                    ? "text-primary font-medium"
                    : "text-muted-foreground opacity-40"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : active ? (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
                ) : (
                  <Circle className="h-4 w-4 flex-shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
          <span>⏱ {timeLabel} écoulé</span>
          <span>Durée habituelle : 1–2 min</span>
        </div>
      </div>
    </div>
  );
}
