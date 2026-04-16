# TrustHub — Auditeur multi-documents B2B

Plateforme **100% gratuite** d'audit contractuel B2B propulsée par l'IA Claude.

> *« Ce qu'on vous a promis / Ce que vous payez vraiment / Le plan pour en sortir. »*

## 🎯 Modèle

- **Audit gratuit illimité** pour les utilisateurs
- **Monétisation data** : dataset anonymisé vendu à cabinets conseil + leads courtiers (opt-in explicite)

## 🚀 Démarrage rapide

```bash
# 1. Installer dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env.local
# Remplir : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY

# 3. Supabase : créer un projet https://supabase.com/
# 4. Exécuter les migrations dans l'ordre :
#    supabase/migrations/20260406000001_initial_schema.sql
#    supabase/storage.sql

# 5. Dev
npm run dev
# → http://localhost:3000
```

## 🏗️ Stack

- **Next.js 15** (App Router, Server Actions)
- **Supabase** (Auth + Postgres + Storage + RLS)
- **Claude Sonnet 4.6 + Haiku 4.5** (Anthropic SDK, tool use, PDF natif)
- **TailwindCSS + shadcn/ui**
- **TypeScript strict**

## 📂 Structure

```
app/
├── page.tsx                       Landing
├── (auth)/login, signup/          Auth pages
├── (app)/
│   ├── dashboard/                 Vue globale
│   ├── folders/                   Dossiers CRUD
│   │   ├── [id]/                  Détail + actions
│   │   └── [id]/upload/           Upload multi-PDF
│   └── audits/[id]/               Rapport 3 colonnes
└── auth/signout/                  Logout route

lib/
├── supabase/                      Client, server, middleware
├── claude/                        Client, prompts, tools, schemas
└── audit/                         Pipeline IA + Server Actions

components/ui/                     shadcn components
supabase/migrations/               SQL migrations
docs/                              BMAD docs (brief, PRD, archi, QA...)
```

## 💰 Coûts

- **Fixe** : ~1 €/mois (domaine)
- **Variable** : ~0,35 € par audit (Claude API pay-per-use)
- Vercel + Supabase + Sentry : **gratuit** jusqu'à ~50 utilisateurs actifs

## 📋 Documentation BMAD

- [Brief produit](docs/00-project-brief.md)
- [PRD](docs/01-prd.md)
- [Architecture](docs/02-architecture.md)
- [UX Spec](docs/03-ux-spec.md)
- [DevOps Lean](docs/04-devops.md)
- [QA Strategy](docs/05-qa-strategy.md)
- [Security & RGPD](docs/06-security-rgpd.md)
- [Epics & Sprints](docs/07-epics.md)
