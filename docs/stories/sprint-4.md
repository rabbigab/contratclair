# 🏃 Sprint 4 — Rapport d'audit & Export
**Durée** : 2 semaines · **Capacité** : 40 points · **Epic** : EPIC-05

---

## Objectif sprint
Afficher le rapport 3 colonnes, permettre l'export PDF white-label et le partage par lien.

## Stories

### ST-029 — Page rapport d'audit 3 colonnes (8 pts)
**AC** :
- Route `/app/audits/[id]`
- Colonnes : Promis / Payé réellement / Plan
- KPI header : économies détectées, score confiance
- Listing findings avec severity badges
- Responsive mobile (accordéon)

### ST-030 — Design template PDF white-label (5 pts)
**AC** : template HTML+CSS print-ready avec logo dynamique, couleurs brand, en-têtes/pieds.

### ST-031 — Service génération PDF (Puppeteer ou react-pdf) (5 pts)
**AC** :
- Endpoint POST /audits/:id/export → retourne PDF
- PDF contient logo org + rapport complet + synthèse
- Polices embarquées
- Pagination propre sur longs rapports

### ST-032 — Partage par lien signé (5 pts)
**AC** :
- Endpoint POST /audits/:id/share → retourne token + URL publique
- Page `/share/[token]` publique (sans auth)
- Expiration configurable (24h, 7j, 30j)
- Révocation possible

### ST-033 — Loader animé pendant analyse (3 pts)
**AC** :
- Composant Progress avec messages contextuels
- SSE écoute évènements worker
- Animation lottie rassurante

### ST-034 — Calcul économies + mise en forme (5 pts)
**AC** :
- Service calcule économies sur 12 mois + 5 ans
- Format monétaire FR (1 440,00 €)
- Couleurs dynamiques selon severity

### ST-040 — Export Excel des findings (stretch 3 pts)
**AC** : endpoint `/audits/:id/export?format=xlsx`.

### ST-037 — Notifications email (audit terminé) (3 pts)
**AC** : email transactionnel Postmark avec lien direct rapport.

### ST-038 — Onboarding guidé nouveau user (3 pts)
**AC** : tour guidé (react-joyride) sur premier login.

## Definition of Done Sprint 4
- Parcours complet : upload → analyse → rapport affiché → PDF téléchargé
- Lien partagé fonctionne sur browser en navigation privée
- Email "audit terminé" reçu

## Points total : 40/40
