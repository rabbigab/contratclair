# 📋 Project Brief — TrustHub
**Agent : Analyst (Business Analyst)**
**Date : 2026-04-06**
**Version : 2.0 — Data-driven model**

---

## 1. Vision produit

**TrustHub** est une plateforme **gratuite** d'audit contractuel B2B. Les entreprises uploadent leurs contrats, devis et factures ; notre IA les audite en 5 min et livre un rapport clair.

**Le produit est gratuit. La data est le business.**

## 2. Modèle économique (pivot v2)

### Monétisation par la donnée (pas par l'utilisateur)

Nous accumulons une base unique de **connaissance contractuelle B2B** : prix réels du marché par fournisseur, clauses courantes, dérives tarifaires, conditions de sortie, taux d'indexation pratiqués.

**Sources de revenus** :

| # | Canal | Description | Timing |
|---|---|---|---|
| 1 | **Benchmark Reports** (B2B data) | Rapports sectoriels anonymisés vendus aux acheteurs, DAF, cabinets de conseil | M+3 |
| 2 | **Leads courtiers** | Les audits remontent des contrats à renégocier → leads qualifiés revendus à des courtiers partenaires (com. 30%) | M+2 |
| 3 | **API data** | Accès API aux benchmarks pour ERP, legaltechs, logiciels achats | M+6 |
| 4 | **Alerting pro** (freemium opt-in) | Notif préavis + renégociation auto pour DAF (19 €/mois) | M+4 |
| 5 | **Market intelligence** | Vente de tendances tarifaires à fournisseurs eux-mêmes (fair pricing) | M+9 |

### Le deal avec l'utilisateur

> *« Votre audit est 100% gratuit, pour toujours. En échange, nous anonymisons vos données contractuelles pour alimenter notre benchmark marché — avec votre consentement explicite. »*

## 3. Problème résolu (inchangé)

Les PME signent des contrats sans jamais les auditer. Dérive moyenne : 15-25% de surfacturation.

## 4. Utilisateurs cibles

| Persona | Volume cible | Rôle dans le modèle |
|---|---|---|
| **PME/ETI** | 10 000 inscrits M+12 | Producteurs de data |
| **Courtiers** | 200 partenaires M+6 | Acheteurs de leads |
| **DAF grandes PME** | 500 abonnés Alerting | Abonnés premium |
| **Cabinets conseil** | 20 clients M+6 | Acheteurs Benchmark Reports |

## 5. Proposition de valeur utilisateur

- **100% gratuit, sans limite** : audit illimité, rapport PDF illimité
- **Économies réelles détectées** : en moyenne 1 200 €/an/contrat
- **Alerte automatique** préavis (opt-in)
- **Données garanties anonymisées** avant usage benchmark

## 6. Actif stratégique : le Dataset TrustHub

La valeur long terme du projet = la base de données.

**Ce qu'on collecte (anonymisé)** :
- Fournisseur + secteur (ex : Xerox / photocopie)
- Type de contrat (location, maintenance, SaaS...)
- Prix pratiqués (loyer, indexation, frais annexes)
- Durée, préavis, clauses types
- Écarts promis/réel constatés
- Géographie (département)

**Ce qu'on NE collecte PAS** :
- Nom de l'entreprise cliente
- Coordonnées bancaires
- Contacts nominatifs

**Taille cible** : 50 000 contrats indexés à M+12 → dataset monétisable.

## 7. Périmètre MVP (V1)

✅ **IN SCOPE**
- Audit 100% gratuit illimité
- Upload 3 types de documents (Contrat, Devis, Facture)
- Analyse IA via Claude (protocole TrustHub)
- Rapport d'audit 3 colonnes
- Export PDF
- Auth (email + Google)
- **Opt-in data** explicite (case à cocher au signup + dans chaque audit)
- **Anonymisation automatique** côté serveur avant indexation benchmark

❌ **OUT OF SCOPE V1**
- Monétisation utilisateur finale
- Portail benchmark (V2)
- API data (V2)

## 8. KPIs de succès (révisés data-driven)

| Métrique | Cible M+6 |
|---|---|
| Utilisateurs inscrits | 3 000 |
| Audits réalisés | 5 000 |
| **Contrats indexés dans dataset** | **10 000** |
| Taux opt-in data | > 70% |
| Leads courtiers générés | 500 |
| Revenus leads | 15 000 € |

## 9. Risques spécifiques au pivot

| Risque | Impact | Mitigation |
|---|---|---|
| Refus opt-in massif (< 30%) | Critique | Communication transparente, valeur claire, data bien anonymisée |
| Conformité RGPD data commerciale | Critique | AIPD renforcée, DPO, anonymisation K-anonymat k≥5 |
| Qualité dataset (biais, faible volume) | Élevé | Acquisition agressive phase 1 (ads), partenariats |
| Concurrence copie le modèle | Moyen | Vitesse d'exécution + effet réseau dataset |

## 10. Stack MVP Lean

(Voir `04-devops.md`) : Next.js + Supabase + Claude API = **~1 €/mois fixe**.
