# 📐 PRD — TrustHub
**Agent : Product Manager**
**Date : 2026-04-05**
**Version : 1.0**

---

## 1. Objectifs produit

1. Offrir un **audit contractuel 100% automatisé** en moins de 5 minutes
2. Fournir un **rapport actionnable** clair pour non-juristes
3. Positionner TrustHub comme l'**outil de référence** des courtiers B2B

## 2. Fonctionnalités — Priorisation MoSCoW

### MUST HAVE (MVP)

#### F1 — Authentification & gestion compte
- Inscription email/password + validation email
- Connexion SSO Google
- Reset password
- Gestion du profil (nom, entreprise, logo)

#### F2 — Gestion des dossiers clients
- Créer / éditer / archiver un dossier client
- Un dossier = N documents liés (Contrat, Devis, Facture)
- Historique des audits par dossier

#### F3 — Upload multi-documents
- Drag & drop de 1 à 10 fichiers (PDF, JPG, PNG, max 20 Mo/fichier)
- Classification automatique (Contrat / Devis / Facture) + override manuel
- Prévisualisation document

#### F4 — Moteur d'analyse IA (protocole TrustHub)
- **Analyse Contrat** : durée, date fin, préavis, indexation, clauses pièges
- **Analyse Devis** : tarifs annoncés, services inclus
- **Analyse Facture** : écarts vs contrat, lignes hors forfait
- Corrélation croisée automatique entre les 3 documents

#### F5 — Rapport d'audit 3 colonnes
- Colonne 1 : **Ce qu'on vous a promis** (extrait du devis)
- Colonne 2 : **Ce que vous payez vraiment** (extrait facture + écart)
- Colonne 3 : **Plan pour en sortir** (leviers de renégociation)
- Score de confiance par alerte
- Calcul économies potentielles annuelles

#### F6 — Export PDF
- Template d'audit white-label (logo client/courtier)
- Partage par lien sécurisé (expirable 7 jours)

### SHOULD HAVE (V1.1)

- Tableau de bord multi-dossiers (vue portefeuille)
- Notifications email (audit terminé, préavis approche)
- Mode courtier (white-label complet)

### COULD HAVE (V1.2)

- Rappels automatiques des dates de préavis
- Export Excel des audits
- API publique pour intégrateurs

### WON'T HAVE (V1)

- Signature électronique
- App mobile native
- Marketplace

## 3. User stories (niveau PRD)

> *(Détail complet dans /docs/stories/)*

- **US-001** : En tant qu'utilisateur, je veux créer un compte rapidement pour commencer un audit.
- **US-002** : En tant qu'utilisateur, je veux uploader mes 3 documents d'un coup pour gagner du temps.
- **US-003** : En tant qu'utilisateur, je veux recevoir un rapport clair sous 5 min pour décider vite.
- **US-004** : En tant que courtier, je veux exporter un PDF à mon logo pour convaincre mon prospect.
- **US-005** : En tant qu'utilisateur, je veux comprendre les clauses pièges en langage simple.

## 4. Parcours utilisateur clé (Happy Path)

```
Landing page → Signup → Onboarding (1 dossier exemple)
  → Créer dossier "Contrat Xerox 2024"
  → Upload 3 fichiers (drag & drop)
  → Classification auto confirmée
  → Bouton "Lancer l'audit TrustHub"
  → Loader (progression OCR → Analyse IA → Corrélation) ~3 min
  → Rapport affiché + bouton "Télécharger PDF"
  → Call-to-action "Auditer un autre dossier"
```

## 5. Règles métier clés

- Un audit consomme **1 crédit** (offre freemium : 3 crédits/mois gratuits)
- Un document est **conservé 12 mois** puis purgé automatiquement (RGPD)
- Un rapport ne peut être partagé que via lien signé (expiration configurable)
- L'analyse IA est **déterministe** : même input → même output (seed fixe, cache)
- Les écarts détectés ont un **score de confiance** (0-100%)

## 6. Critères d'acceptation transverses

- Accessibilité WCAG 2.1 AA
- Responsive mobile/tablet/desktop
- Temps de chargement initial < 2s
- Disponibilité 99,5%
- RGPD : DPA + CGU conformes

## 7. Métriques de succès produit

| Métrique | Baseline | Cible |
|---|---|---|
| Time-to-first-audit | - | < 10 min |
| Taux de complétion audit | - | > 85% |
| Taux de téléchargement PDF | - | > 70% |
| Taux de partage lien | - | > 30% |

## 8. Dépendances

- Compte Anthropic API (Claude Sonnet 4.6)
- Compte AWS (Textract + S3 + RDS)
- Compte Stripe (paiement V1.1)
- Domaine + certificat SSL
