# 🛠️ Plan DevOps MVP Lean — TrustHub
**Agent : DevOps Engineer**
**Date : 2026-04-05**
**Version : 2.0 — Ultra Lean**

---

## 🎯 Principe directeur

**Zéro coût fixe. Tu paies uniquement quand un client utilise le produit.**

- Aucun serveur qui tourne 24/7 à vide
- Aucune DB Multi-AZ avant revenus
- Aucun container/queue/worker inutile
- Pay-per-use strict pour l'IA

## 1. Stack MVP Lean

| Composant | Service | Coût |
|---|---|---|
| **Hosting web + API** | Vercel (free hobby) | **0 €** |
| **Base de données** | Supabase (free tier) | **0 €** |
| **Auth** | Supabase Auth | **0 €** |
| **Stockage fichiers** | Supabase Storage (1 GB gratuit) | **0 €** |
| **Emails** | Resend (free 3000/mois) | **0 €** |
| **Monitoring** | Sentry (free 5k events) | **0 €** |
| **Analytics** | Vercel Analytics / Plausible | **0 €** |
| **DNS + Domaine** | Cloudflare + .app | **~1 €/mois** |
| **IA Claude** | Pay-per-use Anthropic | **Variable** |
| **TOTAL FIXE** | | **~1 €/mois** |

## 2. Architecture simplifiée

```
┌────────────────────────────────────────┐
│  Next.js 15 (Vercel)                   │
│  • Pages + API routes + Server Actions │
│  • Traitement audit côté serveur       │
└──────────┬─────────────────────────────┘
           │
    ┌──────▼──────┐     ┌──────────────┐
    │  Supabase   │     │ Anthropic    │
    │  • Postgres │     │ Claude API   │
    │  • Auth     │     │ (PDF natif)  │
    │  • Storage  │     │              │
    └─────────────┘     └──────────────┘
```

**Pas de backend séparé, pas de worker, pas de Redis, pas d'OCR tiers.**

## 3. Le trick IA : Claude lit les PDF nativement

**Claude Sonnet 4.6 accepte les PDF en input directement via l'API** (messages avec `document`). Résultat :

- ❌ Pas besoin d'AWS Textract (économie 40 €/mois)
- ❌ Pas besoin de Tesseract worker
- ❌ Pas de pipeline OCR à maintenir
- ✅ Claude extrait + analyse en **1 seul appel**
- ✅ Meilleure compréhension (vision + texte en contexte)

## 4. Coûts IA — choix du modèle

### Stratégie hybride par défaut

| Étape | Modèle | Coût/audit |
|---|---|---|
| Classification doc | `claude-haiku-4-5` | 0,01 € |
| Extraction contrat | `claude-sonnet-4-6` | 0,15 € |
| Extraction devis | `claude-haiku-4-5` | 0,03 € |
| Extraction facture | `claude-haiku-4-5` | 0,03 € |
| Corrélation + rapport | `claude-sonnet-4-6` | 0,12 € |
| **Total par audit** | | **~0,35 €** |

### Projection coûts selon volume

| Audits/mois | Coût IA | Coût total | Revenu (si 29€/audit) | Marge |
|---|---|---|---|---|
| 10 | 3,5 € | ~5 € | 290 € | 98% |
| 100 | 35 € | ~36 € | 2 900 € | 99% |
| 500 | 175 € | ~176 € | 14 500 € | 99% |
| 1000 | 350 € | ~351 € | 29 000 € | 99% |

**Tu es rentable dès le 1er client.**

## 5. Supabase free tier — limites à connaître

| Ressource | Limite free | Suffisant pour |
|---|---|---|
| Database | 500 MB | ~5000 audits |
| Storage | 1 GB | ~200 dossiers (5 Mo avg) |
| Auth MAU | 50 000 | Toute ta phase MVP |
| Edge Functions | 500k/mois | OK |
| Bande passante | 5 GB/mois | OK |

**Upgrade Supabase Pro à 25 $/mois** uniquement quand tu dépasses (= quand tu as du revenu).

## 6. Vercel free tier — limites

- 100 GB bande passante/mois
- 100 GB-hours Serverless Functions
- Builds illimités
- **Timeout fonctions : 10s (hobby) / 60s (pro)**

⚠️ **Point d'attention** : une analyse IA complète peut dépasser 10s. Solution :
- **Option A** : passer Vercel Pro à 20 $/mois (timeout 60s) quand tu as des clients
- **Option B (free)** : utiliser un background job Supabase Edge Function + polling côté client
- **Option C (free)** : Upstash QStash free (500 msg/jour) pour déclencher le traitement async

**Recommandation démarrage : Option B** (0 € jusqu'au revenu).

## 7. CI/CD ultra simple

```
GitHub → push main → Vercel auto-deploy (0 config)
```

- Preview URL automatique par PR
- Tests GitHub Actions (free tier 2000 min/mois)
- Pas de Terraform, pas d'ECS, pas de Docker

## 8. Sécurité minimale mais sérieuse

- Supabase Row Level Security (RLS) activé partout
- Variables d'env chiffrées dans Vercel
- HTTPS natif (Vercel + Cloudflare)
- Rate limiting via Upstash Ratelimit (free)
- Sentry pour erreurs

## 9. Quand upgrader (seuils)

| Trigger | Action | Nouveau coût |
|---|---|---|
| > 50 MAU actifs | Supabase Pro | +25 $/mois |
| Timeout API > 10s constaté | Vercel Pro | +20 $/mois |
| > 1000 audits/mois | Claude prepaid discount | négocier -10% |
| > 5 GB docs stockés | Cloudflare R2 | +0,015 $/GB |

**Tant que tu n'as pas de clients payants récurrents, reste en free.**

## 10. Comparaison vs. plan initial

| | Plan initial (AWS) | Plan Lean |
|---|---|---|
| Coût fixe | 875 €/mois | **1 €/mois** |
| Temps setup infra | 1-2 semaines | **1 jour** |
| Complexité ops | Haute (Terraform, ECS) | **Nulle** |
| Scalabilité | Enterprise | Jusqu'à ~500 clients |
| Migration future | N/A | Facile (Supabase → AWS RDS) |

## 11. Stack complète — liste d'outils

```
Frontend + Backend : Next.js 15 (App Router)
Hosting           : Vercel Hobby (free)
Database + Auth   : Supabase Free
Storage PDF       : Supabase Storage
IA                : Anthropic SDK (Claude Sonnet 4.6 + Haiku 4.5)
Emails            : Resend Free
Monitoring        : Sentry Free
Rate limiting     : Upstash Ratelimit Free
Analytics         : Vercel Analytics Free
DNS               : Cloudflare Free
Domaine           : Namecheap .app (~12 €/an)
```

**Coût annuel démarrage : ~12 € + IA variable.**
