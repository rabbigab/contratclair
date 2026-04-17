import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Lock,
  Zap,
  FileSearch,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
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
            <Zap className="h-4 w-4" />
            100% gratuit · Analyse en moins de 2 minutes
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Vos contrats B2B vous coûtent{" "}
            <span className="text-primary">trop cher.</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Uploadez votre contrat, devis et facture. Notre IA détecte en
            quelques minutes les clauses pièges, dérives tarifaires et
            renouvellements tacites — avec un plan de renégociation concret.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base">
                Auditer mes contrats gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Données hébergées en UE
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Conforme RGPD
            </div>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4" />
              Propulsé par Claude AI
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y bg-muted/40 py-8">
        <div className="container">
          <div className="grid gap-6 text-center sm:grid-cols-3">
            {[
              { value: "18–32%", label: "d'économies détectées en moyenne" },
              { value: "< 2 min", label: "pour un rapport d'audit complet" },
              { value: "3 docs", label: "suffisent : contrat · devis · facture" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Ce que votre contrat vous cache</h2>
          <p className="mt-3 text-muted-foreground">
            Les problèmes les plus courants détectés par TrustHub
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <RefreshCw className="h-6 w-6 text-amber-500" />,
              bg: "bg-amber-50 border-amber-200",
              title: "Renouvellement tacite",
              desc: "Votre contrat se reconduit automatiquement avec une hausse tarifaire non notifiée. Nous détectons les délais de préavis oubliés.",
            },
            {
              icon: <TrendingDown className="h-6 w-6 text-red-500" />,
              bg: "bg-red-50 border-red-200",
              title: "Dérive tarifaire",
              desc: "Le prix facturé s'écarte du devis signé. Nous comparons ligne par ligne et chiffrons l'écart annuel.",
            },
            {
              icon: <AlertTriangle className="h-6 w-6 text-destructive" />,
              bg: "bg-destructive/5 border-destructive/20",
              title: "Clauses déséquilibrées",
              desc: "Révision unilatérale des prix, pénalités asymétriques, exclusions de responsabilité abusives — signalées et expliquées.",
            },
          ].map((item) => (
            <Card key={item.title} className={`${item.bg} border`}>
              <CardContent className="pt-6">
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">Comment ça marche</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Uploadez vos 3 docs",
                desc: "Glissez-déposez contrat, devis et facture (PDF). Vos fichiers restent privés sur votre compte.",
              },
              {
                step: "2",
                title: "L'IA analyse en 2 min",
                desc: "Claude AI lit, croise et corrèle vos documents. Extraction des données, détection des écarts, scoring de confiance.",
              },
              {
                step: "3",
                title: "Rapport d'audit clair",
                desc: "Chaque problème est expliqué, chiffré en euros et accompagné d'une recommandation concrète de renégociation.",
              },
            ].map((s) => (
              <Card key={s.step}>
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="container py-16 text-center">
        <div className="mx-auto max-w-xl">
          <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h2 className="text-2xl font-bold">Prêt à reprendre le contrôle ?</h2>
          <p className="mt-3 text-muted-foreground">
            Rejoignez les professionnels qui utilisent TrustHub pour auditer leurs
            contrats en quelques minutes, sans frais.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg">
              Créer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Why free */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <Card className="mx-auto max-w-3xl">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold">Pourquoi c'est 100% gratuit ?</h2>
              <p className="mt-4 text-muted-foreground">
                Nous construisons la première base de données de référence des prix et
                clauses B2B en France. Avec votre accord, vos données sont{" "}
                <strong>anonymisées</strong> pour alimenter ce benchmark, monétisé
                auprès de cabinets conseil et acheteurs professionnels.
              </p>
              <p className="mt-4 text-muted-foreground">
                Vous gardez le contrôle total : vos documents restent privés, et vous
                pouvez refuser le partage anonymisé à tout moment.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {["Données UE", "RGPD", "Opt-in choisi", "Suppression à la demande"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border bg-background px-3 py-1 text-xs font-medium"
                    >
                      ✓ {tag}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 TrustHub · Hébergé en UE · RGPD compliant
      </footer>
    </main>
  );
}
