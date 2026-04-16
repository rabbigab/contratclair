import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Lock, Zap, FileSearch } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Trust<span className="text-primary">Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/signup">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" /> 100% gratuit · Sans carte bancaire
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Vos contrats B2B vous coûtent{" "}
            <span className="text-primary">25% de trop.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Uploadez votre contrat, votre devis et votre facture. Notre IA vous
            révèle en 5 minutes les clauses pièges, les dérives tarifaires et
            votre plan de renégociation.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base">
                Auditer mes contrats
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Données UE
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> RGPD
            </div>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" /> IA Claude
            </div>
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="container py-16">
        <h2 className="text-center text-3xl font-bold">Comment ça marche</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Uploadez",
              desc: "Contrat + Devis + Facture (PDF ou photo)",
            },
            {
              step: "2",
              title: "L'IA analyse",
              desc: "Extraction, corrélation, détection des écarts",
            },
            {
              step: "3",
              title: "Rapport d'audit",
              desc: "3 colonnes : Promis / Payé / Plan d'action",
            },
          ].map((s) => (
            <Card key={s.step}>
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Why free */}
      <section className="container py-16">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold">
              Pourquoi c'est 100% gratuit ?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Nous créons la première base de données de référence des prix et
              clauses contractuels B2B en France. Avec votre accord, nous{" "}
              <strong>anonymisons</strong> vos données pour alimenter ce
              benchmark, que nous monétisons auprès de cabinets conseil et
              acheteurs pros.
            </p>
            <p className="mt-4 text-muted-foreground">
              Vous gardez le contrôle total : vos documents ne quittent jamais
              votre compte, et vous pouvez refuser l'opt-in à tout moment.
            </p>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 TrustHub · Hébergé en UE · RGPD
      </footer>
    </main>
  );
}
