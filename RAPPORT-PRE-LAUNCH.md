# Ravito — Rapport pré-lancement

**Date :** 24 avril 2026
**Environnement :** https://esprit-trail.vercel.app
**Supabase :** kymhcdxcyrpwyxbtgrdt (eu-west-3, PG 17)

Audit complet avant sortie officielle. Les tickets sont classés par criticité : **🔴 BLOQUANT** (à régler avant lancement), **🟡 IMPORTANT** (à régler semaine 1), **🟢 POLISH** (au fil de l'eau).

---

## 🔴 BLOQUANTS — à régler avant mise en ligne

### B0 — Auth callback cassé en prod (PRIORITÉ 1)
Les runtime logs Vercel remontent **4 erreurs récentes sur `/auth/callback`** :
- 3× échecs `verifyOtp` (magic link token expiré ou déjà consommé)
- 1× échec `exchangeCodeForSession`

Impact : certains utilisateurs ne peuvent pas se connecter. À reproduire en local avec un magic link, ajouter un retry + logger l'erreur Supabase exacte, et renvoyer vers `/login?error=...` avec un message clair.

### B1 — Données hardcodées "Guillaume / coulon_g"
Quatre fichiers contiennent encore le profil de Guillaume en dur :
- `/src/lib/data/me.ts`
- `/src/lib/data/leaderboard.ts`
- `/src/lib/data/guildes.ts`
- `/src/lib/data/connections.ts`

Conséquence : tout nouvel utilisateur voit le profil de Guillaume. À remplacer par un fetch Supabase sur l'utilisateur authentifié (+ fallback démo clair pour les visiteurs non loggés).

### B2 — Domaine hardcodé `esprit-trail.vercel.app`
Présent dans `layout.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`. À remplacer par `process.env.NEXT_PUBLIC_SITE_URL` avec fallback prod. Obligatoire avant de basculer sur `ravito.app`.

### B3 — `/api/debug/env` fuite la clé Anthropic
La route retourne le préfixe de la clé API. **À supprimer purement et simplement** avant le lancement.

### B4 — Lien mort `/coach/humans`
`src/app/coach/page.tsx:231` pointe vers une route qui n'existe pas. Soit créer la page, soit supprimer le lien.

### B5 — Lien mort `/guildes/create`
`src/app/guildes/page.tsx:35` pointe vers une page absente. Créer une page minimaliste ou masquer le bouton tant que le flow n'est pas en place.

### B6 — Lien mort `/guildes/[id]/members`
Référencé depuis la page détail team mais non implémenté.

### B7 — UTMB runnerIndex avec commentaire "mensonge marketing"
À nettoyer : soit connecter la vraie API UTMB, soit retirer le champ, soit afficher "Bientôt disponible".

---

## 🟡 IMPORTANT — Semaine 1 après lancement

- **I1 — `/profile/settings/connections`** : page présente mais incomplète (gestion des tokens Strava, bouton disconnect, statut sync)
- **I2 — `.env.example`** pas à jour (manque `ANTHROPIC_API_KEY`, `STRAVA_CLIENT_ID/SECRET`, `NEXT_PUBLIC_SITE_URL`)
- **I3 — Sync Strava automatique** : actuellement manuel. Implémenter un webhook Strava → Supabase
- **I4 — Radar "near-me"** non câblé à de vraies données géo
- **I5 — Middleware auth** : durcir la liste des routes protégées (`/profile`, `/quests/submit`, `/guildes/*`)
- **I6 — Domaine ravito.app** non configuré sur Vercel (DNS + certificat)
- **I7 — Leaked Password Protection** désactivé sur Supabase (avertissement advisor)
- **I8 — 6 deploys en échec le 23/04** : post-mortem à faire, vérifier que les logs build remontent vers Sentry/Logflare

---

## 🟢 POLISH — Au fil de l'eau

- **P1 — Mulet hairstyle** (#77) + **BOUZIN t-shirt** (#78) : assets character manquants
- **P2 — Animations Framer Motion** sur les cards home (hover/tap feedback)
- **P3 — Skeleton loaders** sur les pages serveur lentes
- **P4 — PWA manifest** à compléter (screenshots, categories, shortcuts)
- **P5 — Sentry** pour le monitoring runtime
- **P6 — Analytics Vercel** à activer pour tracker le funnel onboarding

---

## ✅ Ce qui fonctionne bien

- Onboarding et navigation mobile fluide
- Kill-cam Théo D. bien mis en avant (hero home + page about)
- Feature OFF Races positionnée en 1ʳᵉ place sur le home
- Coach IA route `/api/coach/ai` opérationnelle (Anthropic)
- RLS Supabase actif sur toutes les tables
- Character clickable → `/profile/character` (corrigé dans cette session)
- Tous les renommages "guilde → team" corrects, imports restaurés

---

## Ordre de bataille recommandé

| Jour | Tâche |
|------|-------|
| J0 | B3 (supprimer `/api/debug/env`), B4-B6 (fix liens morts), B7 (UTMB) |
| J0-J1 | B0 (investiguer et patcher auth callback) |
| J1-J2 | B1 (dé-hardcoder Guillaume), B2 (env site URL) |
| J2 | Redéploiement + smoke test complet |
| J3 | I6 (domaine ravito.app), I7 (leaked password) |
| J3+ | Launch public + monitoring runtime logs |

---

## Logos proposés pour les stores

Six concepts distincts dans `/logos/` — voir les fichiers SVG individuellement. Chaque logo est en 1024×1024 avec coins arrondis iOS-style :

1. **`01-gobelet-lime.svg`** — Signature. Le gobelet + la goutte, celui de la page About. Lecture évidente, ancrage terrain.
2. **`02-monogramme-R-peach.svg`** — R monogramme sur fond peach + silhouette montagne. Impact visuel fort.
3. **`03-pirate-FKT.svg`** — Deux trekking poles croisés + gobelet central. L'âme pirate/FKT d'Adventurer.
4. **`04-dossard-typo.svg`** — RAVITO en bold sur fond lime façon dossard de course, avec "kill-cam.app" dessous. Très typé brand.
5. **`05-target-killcam.svg`** — Viseur de kill-cam. Parfait pour mettre en avant la signature feature.
6. **`06-minimal-drop.svg`** — Version la plus épurée. Une goutte-sommet + "Ravito" en dessous. Vieillit bien.

**Recommandation** : `01-gobelet-lime` (force la cohérence avec l'existant) ou `06-minimal-drop` (si tu veux un logo qui scale mieux en petit format).
