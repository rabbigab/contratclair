# 🔒 Sécurité & Conformité RGPD — TrustHub
**Agent : Security Officer / DPO**
**Date : 2026-04-05**
**Version : 1.0**

---

## 1. Cadre légal

- **RGPD** (UE 2016/679)
- **Loi Informatique & Libertés** (FR)
- **Directive NIS2** (sécurité)
- CGU + Politique de confidentialité + DPA clients

## 2. Données traitées

| Catégorie | Exemples | Base légale | Durée |
|---|---|---|---|
| Identification | Nom, email, entreprise | Contrat | Durée compte + 3 ans |
| Documents B2B | Contrats, factures, devis | Intérêt légitime | 12 mois max |
| Logs techniques | IP, user-agent | Intérêt légitime | 12 mois |
| Données de facturation | IBAN (Stripe) | Obligation légale | 10 ans |

## 3. Principes RGPD appliqués

- **Minimisation** : collecte uniquement du nécessaire
- **Limitation finalité** : documents utilisés uniquement pour audit
- **Exactitude** : édition/rectif libre dans le profil
- **Durée limitée** : purge auto docs > 12 mois
- **Sécurité** : chiffrement at-rest + in-transit
- **Transparence** : politique lisible, notice cookies
- **Droits** : accès, rectification, effacement, portabilité, opposition

## 4. Mesures techniques

### Chiffrement
- TLS 1.3 (HSTS, TLS_AES_256_GCM_SHA384)
- S3 : SSE-KMS (AES-256)
- RDS : encryption at rest + TDE
- Secrets : AWS Secrets Manager

### Contrôle d'accès
- Auth : bcrypt (12 rounds) + JWT court + refresh rotation
- MFA : TOTP disponible V1.1
- RBAC : roles (owner, admin, member, viewer)
- Isolation multi-tenant stricte (org_id partout)

### Audit
- Log d'accès (qui voit quoi, quand)
- Log d'export (téléchargements PDF, partages)
- Log d'admin (modifs sensibles)
- Rétention logs 12 mois

### Protection attaques
- Rate limiting
- WAF (règles OWASP)
- CSRF tokens
- CSP stricte
- Sanitization XSS
- Validation stricte (Zod)

## 5. Prompt engineering & confidentialité IA

**Engagement contractuel Anthropic** : les données transmises ne sont **pas utilisées pour entraîner les modèles** (via API commerciale).

Mesures additionnelles :
- Anonymisation opportuniste : masquage IBAN, emails tiers dans les prompts
- Pas de stockage des prompts côté Anthropic au-delà de 30j
- Opt-out entraînement confirmé
- DPA signé avec Anthropic
- Alternative on-prem LLM en roadmap (Mistral)

## 6. Sous-traitants (liste Article 28)

| Sous-traitant | Rôle | Localisation | DPA |
|---|---|---|---|
| AWS (eu-west-3) | Hébergement | France | ✅ |
| Anthropic | LLM analyse | USA + EU | ✅ |
| Stripe | Paiement | USA + EU | ✅ |
| Sentry | Monitoring | EU | ✅ |
| Postmark | Emails transactionnels | EU | ✅ |

Liste publique + notifiée aux clients, droit d'opposition avant changement.

## 7. Droits des utilisateurs (self-service)

- **Accès** : export JSON complet depuis /settings
- **Rectification** : édition profil
- **Effacement** : suppression compte (purge sous 30j)
- **Portabilité** : export JSON + PDF des audits
- **Opposition** : désinscription newsletters

SLA réponse demande DPO : 72h · exécution : 30j max.

## 8. Gestion des incidents (PDB)

**Procédure en cas de data breach** :
1. Détection (monitoring, report)
2. Contention (< 4h)
3. Évaluation impact (< 24h)
4. Notification CNIL (< 72h) si risque
5. Notification utilisateurs (si risque élevé)
6. Post-mortem + actions correctives

## 9. Rétention & destruction

- Documents uploadés : **12 mois** glissants
- Rapports audits : conservés durée compte + 3 ans (preuve)
- Compte supprimé : purge totale sous **30 jours**
- Backups : purge concordante

## 10. Checklist de conformité

- [ ] Politique de confidentialité publiée et versionnée
- [ ] CGU signées à l'inscription
- [ ] Cookies : bannière conforme CNIL (essentiels / optionnels)
- [ ] Registre des traitements tenu à jour
- [ ] AIPD réalisée (documents B2B = risque modéré)
- [ ] DPO désigné et contactable (dpo@trusthub.app)
- [ ] DPA signés avec tous sous-traitants
- [ ] Tests pénétration annuels
- [ ] Formation équipe RGPD annuelle
- [ ] Procédure de gestion d'incident documentée
