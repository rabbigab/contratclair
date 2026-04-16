# 🏃 Sprint 2 — Dossiers & Upload OCR
**Durée** : 2 semaines · **Capacité** : 40 points · **Epics** : EPIC-02 + EPIC-03

---

## Objectif sprint
L'utilisateur peut créer un dossier, y uploader ses documents et voir l'OCR extraire le texte.

## Stories

### ST-008 — CRUD dossiers (backend + frontend) (5 pts)
**AC** : endpoints REST /folders · page /app/folders avec liste + création + archive.

### ST-009 — Modèle organisations & multi-tenant (5 pts)
**AC** : chaque user appartient à une org, isolation stricte des données par org_id.

### ST-010 — Profil utilisateur & logo upload (3 pts)
**AC** : /settings permet d'éditer nom, entreprise, upload logo S3.

### ST-011 — SSO Google OAuth2 (5 pts)
**AC** : bouton "Continuer avec Google" fonctionnel, création compte auto.

### ST-014 — Upload drag & drop multi-fichiers (5 pts)
**AC** :
- Composant FileUpload avec drag & drop
- Validation type (PDF/JPG/PNG) + taille (20 Mo max)
- Upload parallèle avec progress bar
- Stockage S3 (presigned URLs)

### ST-015 — Worker OCR (BullMQ + AWS Textract) (8 pts)
**AC** :
- Queue BullMQ configurée
- Job `ocr-extract` consomme Textract
- Stockage texte + tableaux extraits en DB
- Fallback Tesseract si Textract échoue
- Retry 3× avec backoff exponentiel

### ST-016 — Classification automatique de documents (5 pts)
**AC** :
- LLM classifie Contrat/Devis/Facture après OCR
- Utilisateur peut override manuellement
- Affichage type avec badge coloré

### ST-017 — Prévisualisation document dans l'UI (3 pts)
**AC** : visionneuse PDF intégrée (react-pdf).

### ST-019 — Tests intégration upload + OCR (3 pts)
**AC** : scénario E2E "upload 3 PDFs → OCR complet" passe.

## Definition of Done Sprint 2
- Parcours : signup → créer dossier → upload 3 docs → voir classification
- OCR fonctionne sur 90% des fixtures du golden dataset
- Documents stockés chiffrés S3

## Points total : 42/40 (stretch)
