# 🏛️ Architecture technique — TrustHub
**Agent : Solution Architect**
**Date : 2026-04-05**
**Version : 2.0 — Lean MVP**

> Architecture révisée pour MVP ultra-lean. Voir `04-devops.md` pour détail coûts.

---

## 1. Vue d'ensemble

Architecture **monolithique Next.js full-stack** hébergée serverless, avec Supabase comme backend-as-a-service et Claude API pour toute l'analyse IA (incluant lecture native des PDF).

**Aucun backend séparé, aucun worker, aucun OCR tiers.**

```
┌─────────────────────────────────────────────┐
│  Next.js 15 App (Vercel - free hobby)      │
│  • Pages & composants                       │
│  • API routes / Server Actions              │
│  • Orchestration audit                      │
└──────┬────────────────────────┬─────────────┘
       │                        │
┌──────▼────────┐      ┌────────▼──────────┐
│   Supabase    │      │  Anthropic Claude │
│   (free tier) │      │   API             │
│ • PostgreSQL  │      │ • Sonnet 4.6      │
│ • Auth        │      │ • Haiku 4.5       │
│ • Storage PDF │      │ • Lecture PDF     │
│ • RLS         │      │   native          │
└───────────────┘      └───────────────────┘
```

## 2. Stack technique

### Full-stack Next.js 15 (monolithe serverless)
- **Framework** : Next.js 15 App Router + React 19 + TypeScript strict
- **UI** : TailwindCSS + shadcn/ui + Radix
- **State** : Zustand + TanStack Query
- **Forms** : React Hook Form + Zod
- **API** : Route handlers + Server Actions (pas de backend séparé)
- **Auth** : Supabase Auth (@supabase/ssr)
- **DB** : Supabase Postgres + SDK `@supabase/supabase-js`
- **Storage** : Supabase Storage (buckets privés + signed URLs)
- **Tests** : Vitest + Testing Library + Playwright

### IA & Analyse
- **LLM** : Anthropic SDK — `claude-sonnet-4-6` + `claude-haiku-4-5`
- **Lecture PDF** : native via Claude (API `document` content block)
- **Pas d'OCR tiers** (Textract supprimé)
- **Extraction structurée** : tool use Claude → JSON strict
- **Prompts versionnés** dans `/prompts/v1/*.md`

### Infra
- **Hosting** : Vercel free hobby
- **Backend-as-a-Service** : Supabase free tier (EU — Frankfurt)
- **DNS** : Cloudflare free
- **Pas de Terraform, pas de Docker, pas d'AWS**

## 3. Modèle de données (PostgreSQL)

```sql
users (id, email, password_hash, name, company, role, created_at)
organizations (id, name, logo_url, plan, credits_remaining)
folders (id, org_id, name, client_name, status, archived_at)
documents (id, folder_id, type[contract|proposal|invoice], s3_key,
           ocr_status, ocr_raw_text, uploaded_by, size_bytes)
audits (id, folder_id, status, started_at, completed_at,
        confidence_score, total_savings_eur, report_json)
audit_findings (id, audit_id, severity, category,
                promised_value, actual_value, recommendation,
                confidence, source_document_ids[])
share_links (id, audit_id, token, expires_at, revoked)
audit_logs (id, user_id, action, entity, ip, created_at) -- RGPD
```

## 4. Pipeline d'analyse IA (workflow simplifié)

```
[Upload 3 PDF] → Supabase Storage
  → Server Action "startAudit(folderId)"
      1. Récupère signed URLs des 3 PDFs
      2. Appel Claude Haiku : classification (si non typé)
      3. Appel Claude Sonnet avec les 3 PDFs en input natif
         → tool use : extract_contract + extract_proposal + extract_invoice
         → un seul appel multi-docs possible (context 200k)
      4. Appel Claude Sonnet : corrélation + findings + économies
      5. INSERT audits + audit_findings dans Supabase
  → client poll status ou Supabase Realtime subscribe
```

**Temps cible pipeline** : 30-90s (1 à 2 appels Claude total).

**Astuce** : les 3 PDFs peuvent être envoyés à Claude dans un seul message → gain de temps et contexte partagé.

## 5. Prompts IA (versionnés)

- `prompts/v1/classify-document.md`
- `prompts/v1/extract-contract.md`
- `prompts/v1/extract-proposal.md`
- `prompts/v1/extract-invoice.md`
- `prompts/v1/correlate-audit.md`
- `prompts/v1/generate-report.md`

Chaque prompt utilise **tool use** (function calling) pour garantir un output JSON structuré et éviter les hallucinations.

## 6. Sécurité

- TLS 1.3 partout
- Chiffrement at-rest S3 + RDS (KMS)
- JWT courte durée (15 min) + refresh (7j) rotation
- Rate-limiting API (100 req/min/user)
- CSP stricte, CSRF tokens
- SAST (Semgrep) + DAST (OWASP ZAP) en CI
- Audit logs RGPD (accès/modifs)
- Purge automatique documents > 12 mois

## 7. Performance & scalabilité

- Cache Redis : résultats OCR (hash fichier) + résultats LLM
- Workers horizontaux auto-scaling (1 → 10)
- CDN assets statiques
- Pagination + infinite scroll sur dashboards
- Index DB sur foreign keys + colonnes filtrées

## 8. Observabilité

- **Logs** : CloudWatch + Pino structured logs
- **Métriques** : CloudWatch Metrics + Prometheus exporters
- **Traces** : OpenTelemetry → AWS X-Ray
- **Erreurs** : Sentry
- **Uptime** : UptimeRobot + PagerDuty

## 9. Décisions techniques (ADR)

| # | Décision | Justification |
|---|---|---|
| ADR-001 | Next.js full-stack (pas de backend séparé) | Simplicité MVP, 1 déploiement, 0 config |
| ADR-002 | Supabase vs AWS RDS | Free tier généreux, auth + db + storage inclus |
| ADR-003 | Claude lit PDF nativement | Supprime besoin d'OCR tiers → -40€/mois |
| ADR-004 | Sonnet + Haiku hybride | Optimisation coût : Haiku sur tâches simples |
| ADR-005 | Vercel vs self-hosted | Free tier + deploy auto, upgrade si besoin |

## 10. Arborescence du repo (mono-app)

```
trusthub/
├── app/                  # Next.js App Router
│   ├── (marketing)/      # landing, pricing
│   ├── (auth)/           # login, signup
│   ├── (app)/            # dashboard, folders, audits
│   └── api/              # routes handlers
├── components/           # UI shadcn + custom
├── lib/
│   ├── supabase/         # client, server, middleware
│   ├── claude/           # SDK + prompts + tools
│   └── audit/            # logique business
├── prompts/v1/           # prompts versionnés
├── supabase/
│   ├── migrations/       # SQL migrations
│   └── seed.sql
├── docs/
└── .github/workflows/
```

**Un seul projet, un seul déploiement.**
