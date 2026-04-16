# 🏃 Sprint 3 — Moteur IA TrustHub
**Durée** : 2 semaines · **Capacité** : 40 points · **Epic** : EPIC-04

---

## Objectif sprint
Extraire les données clés des 3 types de documents et les croiser pour détecter les écarts.

## Stories

### ST-020 — Schémas Zod d'extraction par type de doc (3 pts)
**AC** : `ContractExtract`, `ProposalExtract`, `InvoiceExtract` typés, partagés front/back.

### ST-021 — Prompts v1 + tool use Claude (5 pts)
**AC** :
- 6 prompts versionnés dans `packages/prompts/v1/`
- Tool definitions JSON Schema pour extraction forcée
- Integration SDK `@anthropic-ai/sdk` (claude-sonnet-4-6)

### ST-022 — Service AnalysisService (extraction contrat) (5 pts)
**AC** : extrait durée, date fin, préavis, indexation, clauses pièges, frais annexes.

### ST-023 — Service AnalysisService (extraction devis) (3 pts)
**AC** : extrait tarifs promis, services inclus, conditions commerciales.

### ST-024 — Service AnalysisService (extraction facture) (3 pts)
**AC** : extrait lignes de facturation, montants, périodes, écarts vs contrat.

### ST-025 — Corrélation croisée 3 documents (8 pts)
**AC** :
- Service `CorrelationService` compare les 3 extraits
- Détecte écarts tarifaires, services non rendus, clauses actionnables
- Calcule économies potentielles /an
- Produit liste de `AuditFinding` avec severity + confidence

### ST-026 — Worker analysis job (orchestration pipeline complet) (5 pts)
**AC** :
- Job `analyze-folder` enchaîne : OCR → classify → extract×3 → correlate → save
- Progression trackée en DB
- Notifications SSE vers front

### ST-027 — API /audits + endpoint /folders/:id/analyze (3 pts)
**AC** : endpoint déclenche l'analyse, retourne audit_id + statut.

### ST-028 — Tests IA : golden dataset (5 pts)
**AC** :
- 20 triplets de docs annotés créés
- Script `pnpm test:golden` rejoue les prompts
- Métriques logged : précision/recall
- Seuils : extraction dates ≥ 95%, montants ≥ 98%

## Definition of Done Sprint 3
- Pour un dossier avec 3 docs uploadés, cliquer "Analyser" lance le pipeline complet
- L'audit produit une liste de findings structurés en < 3 min
- Golden dataset atteint les seuils de qualité

## Points total : 40/40
