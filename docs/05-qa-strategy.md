# 🧪 Stratégie QA — TrustHub
**Agent : QA Lead**
**Date : 2026-04-05**
**Version : 1.0**

---

## 1. Pyramide des tests

```
         ┌─────────┐
         │   E2E   │  10% (Playwright) — parcours critiques
       ┌─┴─────────┴─┐
       │ Integration │  20% (Supertest + Testcontainers)
     ┌─┴─────────────┴─┐
     │   Unit tests    │  70% (Vitest/Jest)
     └─────────────────┘
```

**Couverture cible** : ≥ 80% global, **100% sur modules critiques** (analyse IA, calcul économies, sécurité).

## 2. Types de tests

### 2.1 Tests unitaires
- **Frontend** : composants (Vitest + Testing Library), hooks, utils
- **Backend** : services, guards, pipes, validators
- **Shared** : schémas Zod, calculs business

### 2.2 Tests d'intégration
- API endpoints (Supertest) avec DB réelle (Testcontainers)
- File d'attente (BullMQ) avec Redis réel
- OCR worker avec fixtures PDF

### 2.3 Tests E2E (Playwright)
Scénarios critiques :
- E2E-01 : Signup → Login → Dashboard
- E2E-02 : Créer dossier → Upload 3 docs → Lancer audit → Voir rapport
- E2E-03 : Télécharger PDF + partager lien
- E2E-04 : SSO Google
- E2E-05 : Limite crédits freemium

### 2.4 Tests IA (spécifiques)
- **Golden dataset** : 50 contrats réels annotés (types variés)
- **Regression testing** : chaque modif de prompt rejoue le dataset
- **Métriques** : precision/recall sur détection clauses, MAE sur montants
- **Seuils d'acceptation** :
  - Précision extraction dates : ≥ 98%
  - Précision extraction montants : ≥ 99%
  - Recall clauses pièges : ≥ 90%
  - Taux hallucination : < 1%

### 2.5 Tests de charge
- K6 : 100 utilisateurs concurrents, 500 audits/h
- Burst test : 50 uploads simultanés

### 2.6 Tests de sécurité
- OWASP ZAP (DAST) en pipeline
- Semgrep (SAST)
- Tests manuels : injection, XSS, CSRF, IDOR, upload malicieux
- Tests de permissions (isolation multi-tenant)

### 2.7 Tests d'accessibilité
- axe-core automatisé
- Revue manuelle NVDA + VoiceOver
- Navigation clavier pure

## 3. Définition de Done (DoD)

Une story est DONE si :
- ✅ Code reviewé (2 approbations)
- ✅ Tests unitaires écrits et passent
- ✅ Tests intégration (si applicable) passent
- ✅ Coverage branche maintenue ≥ 80%
- ✅ Pas de vulnérabilité critique (Semgrep)
- ✅ Accessibilité vérifiée (composants UI)
- ✅ Documentation mise à jour
- ✅ Déployé en staging
- ✅ QA manuelle validée
- ✅ Critères d'acceptation validés par PO

## 4. Environnements de test

| Env | Données | Usage |
|---|---|---|
| **local** | Fixtures | Dev |
| **ci** | Testcontainers | Pipeline |
| **staging** | Anonymisées | QA + UAT |
| **prod** | Réelles | Smoke tests post-deploy |

## 5. Plan de test par fonctionnalité

### F4 — Moteur d'analyse IA (critique)

**Cas de test prioritaires** :
1. Contrat PDF standard → extraction correcte de 15 champs
2. Contrat PDF scanné de mauvaise qualité → OCR acceptable
3. Contrat multi-pages (50p+) → pas de troncature
4. Devis avec tableaux complexes → extraction tableaux
5. Facture avec lignes hors forfait → détection
6. Corrélation 3 docs cohérents → 0 faux positifs
7. Corrélation 3 docs incohérents → toutes alertes levées
8. Document vide / corrompu → gestion erreur propre
9. Document non-PDF (Word, image) → conversion ou rejet clair
10. Document > 20 Mo → rejet avec message

## 6. Bug severity

| Sévérité | Definition | SLA fix |
|---|---|---|
| **P0** | Prod down, data loss, faille sécurité | 4h |
| **P1** | Feature critique cassée | 1j |
| **P2** | Feature secondaire cassée | 3j |
| **P3** | Cosmétique, amélioration | Backlog |

## 7. Outils QA

- **Test runner** : Vitest (front) + Jest (back) + Playwright (E2E)
- **Mocking** : MSW (front), Jest mocks (back)
- **Fixtures** : faker-js + factories
- **Coverage** : c8/istanbul → upload Codecov
- **Bug tracking** : Linear/Jira
- **Test management** : test cases dans `/tests/test-plans/`

## 8. Rituels QA

- **Triage bugs** : quotidien (SM + QA)
- **Regression suite** : avant chaque release
- **Bug bash** : fin de sprint, 2h en équipe
- **UAT** : 2 jours avant release prod avec 2-3 beta users

## 9. Golden dataset IA (gouvernance)

- 50 jeux de documents (contrat + devis + facture) anonymisés
- Annotations manuelles par expert juriste
- Stocké chiffré, accès restreint
- Maintenu par QA Lead + validé Product Manager
- Rejoué automatiquement à chaque PR modifiant prompts/logique IA
