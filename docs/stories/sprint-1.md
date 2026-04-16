# 🏃 Sprint 1 — Foundation
**Durée** : 2 semaines · **Capacité** : 40 points · **Epic** : EPIC-01

---

## Objectif sprint
Déployer une application squelette sécurisée en staging avec auth fonctionnelle et pipeline CI/CD.

## Stories

### ST-001 — Setup monorepo Turborepo (3 pts)
**En tant que** dev, **je veux** un monorepo avec apps web/api/worker et packages shared/prompts/ui.
**AC** :
- Turborepo + pnpm workspaces
- apps/web (Next.js 15) + apps/api (NestJS) + apps/worker
- packages/shared (types Zod) + packages/ui
- Scripts `dev`, `build`, `lint`, `test` à la racine

### ST-002 — Config TypeScript, ESLint, Prettier, Husky (2 pts)
**AC** : tsconfig strict, ESLint flat config, pre-commit hooks (lint+typecheck+test).

### ST-003 — Infra Terraform staging (8 pts)
**AC** : VPC, RDS Postgres, Redis, ECS cluster, S3, CloudFront déployés en eu-west-3.

### ST-004 — Pipeline CI GitHub Actions (5 pts)
**AC** : lint + typecheck + tests + build sur chaque PR · déploiement auto staging sur develop.

### ST-005 — Backend NestJS : skeleton + Prisma + health endpoint (5 pts)
**AC** : `/health` répond 200 · Prisma connecté à RDS · migrations initiales.

### ST-006 — Auth JWT + refresh + signup/login endpoints (8 pts)
**AC** :
- POST /auth/signup (email + password + name)
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- Guards JWT opérationnels
- Tests unitaires + intégration

### ST-007 — Frontend : landing + pages login/signup + Zustand store (8 pts)
**AC** :
- Landing page responsive
- Pages /login et /signup fonctionnelles branchées API
- Store auth (Zustand) + persistance refresh
- Redirection automatique si connecté

## Definition of Done Sprint 1
- App staging.trusthub.app répond
- Un utilisateur peut s'inscrire, se connecter, se déconnecter
- Pipeline CI verte sur main + develop
- Coverage global > 80%

## Points total : 39/40
