# 🎨 Spécification UI/UX — TrustHub
**Agent : UX/UI Designer**
**Date : 2026-04-05**
**Version : 1.0**

---

## 1. Principes de design

1. **Clarté radicale** : chaque écran répond à UNE question utilisateur
2. **Preuve sociale constante** : chiffres d'économies visibles partout
3. **Rassurer sur la confidentialité** : badges RGPD, icônes cadenas
4. **Réduction de friction** : 3 clics max pour lancer un audit

## 2. Design system

### Couleurs
- **Primary** : `#1E40AF` (bleu confiance)
- **Success** : `#059669` (vert économies)
- **Warning** : `#D97706` (ambre alertes)
- **Danger** : `#DC2626` (rouge clauses pièges)
- **Neutral** : `#F8FAFC` → `#0F172A` (slate scale)

### Typographie
- **Heading** : Inter Display (700, 600)
- **Body** : Inter (400, 500)
- **Mono** : JetBrains Mono (données chiffrées)

### Espacements
- Scale 4px (4, 8, 12, 16, 24, 32, 48, 64)
- Max-width conteneur : 1280px

### Composants (shadcn/ui)
Button, Card, Dialog, Toast, Tabs, Table, Progress, Badge, Tooltip, Alert, Dropdown, Select, Input, Textarea, FileUpload.

## 3. Arborescence des écrans

```
/                         Landing page
/login                    Connexion
/signup                   Inscription
/app
 ├── /dashboard           Vue globale (portefeuille)
 ├── /folders             Liste dossiers
 ├── /folders/new         Création dossier
 ├── /folders/[id]        Détail dossier (documents + audits)
 ├── /folders/[id]/upload Upload documents
 ├── /audits/[id]         Rapport d'audit
 └── /settings            Profil, équipe, facturation
/share/[token]            Rapport partagé public
```

## 4. Wireframes clés

### 4.1 Landing page
```
┌─────────────────────────────────────────────────┐
│ [Logo]           Fonctionnalités  Prix  [Login] │
├─────────────────────────────────────────────────┤
│                                                 │
│   Vos contrats B2B vous coûtent 25% de trop.   │
│            Prouvez-le en 5 minutes.             │
│                                                 │
│   [Commencer mon audit gratuit →]              │
│                                                 │
│   🔒 RGPD · Hébergé UE · 500+ audits réalisés  │
├─────────────────────────────────────────────────┤
│  Comment ça marche :                            │
│  1️⃣ Uploadez  2️⃣ L'IA analyse  3️⃣ Rapport PDF  │
└─────────────────────────────────────────────────┘
```

### 4.2 Upload documents (étape clé)
```
┌─────────────────────────────────────────────────┐
│ ← Dossier "Xerox Location 2024"                 │
├─────────────────────────────────────────────────┤
│  Glissez vos 3 documents ici                    │
│  ┌───────────────────────────────────────────┐  │
│  │  📄 Contrat    📄 Devis    📄 Facture     │  │
│  │         [Drop zone PDF/JPG]                │  │
│  │      Le trio gagnant TrustHub              │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Fichiers :                                     │
│  ✅ contrat_xerox.pdf     → Contrat  [modif]   │
│  ✅ devis_2023.pdf        → Devis    [modif]   │
│  ✅ facture_mars.pdf      → Facture  [modif]   │
│                                                 │
│  [Lancer l'audit TrustHub →]                    │
└─────────────────────────────────────────────────┘
```

### 4.3 Rapport d'audit (3 colonnes)
```
┌─────────────────────────────────────────────────┐
│ Audit "Xerox 2024"  · Confiance 92% · [📥 PDF]  │
├─────────────────────────────────────────────────┤
│  💰 Économies détectées : 1 440 € /an           │
├─────────────────────────────────────────────────┤
│  PROMIS          │ PAYÉ RÉELLEMENT │ PLAN        │
│  100 €/mois      │ 124 €/mois      │ Renégocier │
│  Maintenance     │ +15 €/mois      │ Exiger      │
│  incluse         │ facturée        │ suppression │
│  Durée 36 mois   │ Tacite 60 mois  │ Préavis     │
│                  │                 │ avant 30/06 │
├─────────────────────────────────────────────────┤
│  🚨 3 clauses pièges détectées                  │
│  ⚠ 2 lignes hors forfait                        │
│  💡 3 leviers de renégociation                  │
└─────────────────────────────────────────────────┘
```

## 5. Flow utilisateur (parcours clé)

```
Landing → CTA "Audit gratuit"
  → Signup (email + password) · 20s
  → Onboarding : créer 1er dossier · 15s
  → Upload 3 fichiers · 30s
  → Validation classification · 10s
  → [Loader animé 3 min avec messages rassurants]
       "Lecture OCR des documents..."
       "Analyse juridique par l'IA TrustHub..."
       "Détection des écarts financiers..."
       "Génération de votre rapport..."
  → Rapport affiché · wow-moment
  → CTA "Télécharger PDF" + "Partager"
```

**Temps cible : 5 min pour premier audit complet.**

## 6. Responsive

- **Mobile (< 768px)** : accordéon 3 colonnes → empilé vertical, upload caméra
- **Tablet (768-1024px)** : 2 colonnes (promis + réel) + plan en drawer
- **Desktop (> 1024px)** : 3 colonnes complètes

## 7. Accessibilité (WCAG 2.1 AA)

- Contrastes texte ≥ 4.5:1
- Navigation clavier complète
- ARIA labels sur tous les éléments interactifs
- Focus visibles
- Support screen readers (NVDA, VoiceOver)
- Textes alternatifs images/icônes

## 8. Micro-interactions

- Loader d'analyse : progression fluide avec messages contextuels
- Confettis lors de la découverte d'économies > 1000€
- Toast de confirmation non intrusif
- Skeleton loaders pour listes
- Hover states cards

## 9. Brand voice

- **Ton** : expert mais accessible, direct, un brin irrévérencieux face aux "arnaques"
- **Vocabulaire** : « débusquer », « clauses pièges », « levier », « preuve »
- **Formules interdites** : jargon juridique non traduit, anglicismes

## 10. Livrables design

- Figma avec design system + wireframes + prototype clickable
- Icônes : Lucide React
- Illustrations : unDraw ou custom SVG
- Logo + brand guidelines
