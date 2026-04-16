# 🏃 Sprint 5 — Dashboard, RGPD & Production-Ready
**Durée** : 2 semaines · **Capacité** : 40 points · **Epics** : EPIC-06 + EPIC-07

---

## Objectif sprint
Livrer le produit MVP prêt pour production : dashboard, conformité RGPD, monitoring, hardening, UAT.

## Stories

### ST-035 — Dashboard portefeuille (vue globale) (8 pts)
**AC** :
- Cards KPI : total économies détectées, nb audits, nb dossiers
- Graphique économies cumulées (Recharts)
- Tableau derniers audits avec filtres
- CTA "Nouvel audit"

### ST-036 — Liste & filtres dossiers (3 pts)
**AC** : recherche texte, tri par date/client, filtres statut.

### ST-039 — Notifications in-app (3 pts)
**AC** : cloche notifications avec badge count.

### ST-041 — Purge automatique docs > 12 mois (RGPD) (3 pts)
**AC** : cron job quotidien supprime S3 + DB, audit log.

### ST-042 — Export données personnelles (droit accès) (3 pts)
**AC** : bouton /settings → télécharger JSON avec toutes les données user.

### ST-043 — Suppression compte (droit effacement) (3 pts)
**AC** : confirmation + email + purge sous 30j.

### ST-044 — Monitoring : Sentry + CloudWatch dashboards (5 pts)
**AC** : Sentry intégré front/back, dashboards Grafana business + perf + infra.

### ST-045 — Tests de charge K6 (3 pts)
**AC** : script K6 simule 100 users, rapport publié, goulots identifiés.

### ST-046 — Hardening sécurité + audit Semgrep/ZAP (5 pts)
**AC** : WAF activé, CSP stricte, 0 vulnérabilité critique, rapport pentest interne.

### ST-UAT — UAT beta users (2 pts)
**AC** : 3 beta testeurs invités, feedback recueilli, P0/P1 corrigés.

## Definition of Done Sprint 5
- Toutes les checkboxes conformité RGPD cochées
- Dashboards Grafana en place
- 3 beta testeurs ont complété un audit end-to-end
- Aucun bug P0/P1 ouvert
- Go/No-Go décision production

## Points total : 38/40

---

## 🚀 Release plan post-Sprint 5

- **Semaine 11** : déploiement production + soft launch (20 beta users)
- **Semaine 12** : monitoring intensif, fix bugs, itération UX
- **Semaine 13** : communication marketing + ouverture publique
