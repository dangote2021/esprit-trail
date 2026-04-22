# 🏔️ Esprit trail

> **Le trail, il a changé.**

**L'app trail nouvelle génération.** Gamification maîtrisée, UTMB Index, ITRA, défis hebdo, badges significatifs, loot drops contextuels. Deux modes : *Adventure* (gamifié, vibe Clem qui court × Casquette Verte) ou *Performance* (data pro, sobre).

---

## ✨ Ce qui est dans l'app

**Onboarding (5 étapes)**
1. Nom + bienvenue "Le trail, il a changé."
2. Choix de mode : Adventure ou Performance
3. Objectif (premier trail / ultra / UTMB / faire ses preuves…)
4. Niveau déclaré + Import UTMB/ITRA *(optionnel, collapsible)*
5. Connexion Strava + Garmin + Coros + Suunto

**Home (Dashboard)**
- PlayerHUD avec avatar, level, XP bar, rythme hebdo (remplace le streak quotidien anxiogène)
- Tuiles stats personnalisées selon le mode
- CTA "Lance ta sortie"
- Quêtes du jour + semaine
- Derniers runs + prochaine course + top badges
- Teaser Guildes

**Quêtes** (daily, weekly, seasonal, epic)
Progress bars, récompenses XP + badges. Ex: "10 km aujourd'hui", "3 sorties cette semaine", "100 km en montagne ce mois".

**Badges / Trophées** (40+ badges, 5 raretés)
Common → Rare → Epic → Legendary → Mythic. Effet shine pour les légendaires. Filtre par catégorie, progress "collection %".

**Courses** (12 courses iconiques)
UTMB, CCC, Diagonale des Fous, Hardrock, 6000D, MaXi-Race, EcoTrail Paris, SaintéLyon, Grand Raid Pyrénées… Filtres catégorie (XS/S/M/L/XL), toggle "iconiques uniquement", eligibility check vs UTMB Index.

**Leaderboard**
3 scopes : Amis / Région / Monde. Podium animé, indicateurs ↑↓, highlight "Toi".

**Profil / Cockpit**
- UTMB Index avec breakdown par catégorie
- ITRA Performance Index / 1000
- 4 montres connectées avec statut sync
- 6 stats saison
- Top 6 badges, inventaire loot
- Historique complet des sorties

**Run detail + Share**
Hero carte SVG, profil d'altitude, XP gagnée, badges débloqués, loot drops. Bouton share → 4 templates story 9:16 (Pulse / Classic / Gamer / Sobre) avec captions prêtes.

**New Run**
Tracking Esprit trail (beta), import Garmin, import Strava, saisie manuelle.

**Coach IA** (`/coach`)
Générateur de plan d'entraînement perso basé sur l'objectif, le niveau, le temps dispo. Phases foundation → build → peak → taper → race, semaines de décharge auto, conseils par phase.

**Guildes** (`/guildes`)
Teams de 5 à 20 pratiquants. Défis collectifs, classement membres, rôles capitaine/membre.

**Settings** (`/profile/settings`)
Toggle mode Adventure/Performance, rythme hebdo (1-4×), style de loot (gamer / real / hidden), connexions montres, notifs, confidentialité, export, logout.

---

## 🛠 Stack technique

- **Next.js 14.2** (App Router, Server Components, TypeScript)
- **Tailwind CSS 3.4** avec design tokens custom (lime / peach / cyan / violet / gold + raretés)
- **React 18**
- **Supabase** (schema prêt, RLS, auth trigger) — à brancher
- **OAuth Strava** (scaffold complet, prêt à recevoir les clés)
- Mobile-first, safe-area insets iPhone, PWA-ready
- 0 dépendance UI externe — tout est custom

**Palette gaming dark mode :**
- `bg` : `#0a0f1c` (nuit noire)
- `lime` : `#c2ff2e` (néon principal)
- `peach` : `#ff7849` (D+, alertes)
- `cyan` : `#22d3ee` (UTMB, durée)
- `violet` : `#a855f7` (ITRA, mondiaux)
- `gold` : `#fbbf24` (podium, légendaire)
- `mythic` : `#ff3366` (mythique)

---

## 🚀 Installation & dev local

```bash
cd esprit-trail
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build    # build de prod
npm start        # serve le build
```

---

## 🌐 Déploiement Vercel

### Option A — Via GitHub (recommandé, auto-deploys)

```bash
# 1. Crée le repo
cd esprit-trail
rm -rf node_modules .next
git init
git add .
git commit -m "feat: Esprit trail v0.2 — Le trail, il a changé"

# 2. Crée un repo GitHub vide (via github.com ou gh)
gh repo create esprit-trail --public --source=. --push
# ou manuellement :
git remote add origin git@github.com:TON_USER/esprit-trail.git
git branch -M main
git push -u origin main

# 3. Import sur Vercel
# → vercel.com/new → import le repo esprit-trail
# → framework détecté : Next.js, zéro config
# → click Deploy
```

Une fois le repo lié à Vercel, **chaque push = deploy auto**.

### Option B — Via Vercel CLI

```bash
cd esprit-trail
npx vercel login
npx vercel          # preview
npx vercel --prod   # production
```

### Variables d'environnement

Voir `.env.example`. Pour le MVP, tout tourne avec les données mock sans aucune var. Les vars sont requises uniquement quand tu branches :
- Supabase (auth + DB)
- Strava (OAuth)
- Claude (Coach IA)

---

## 📁 Structure du projet

```
esprit-trail/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # shell + bottom nav
│   │   ├── page.tsx                # Home
│   │   ├── globals.css
│   │   ├── onboarding/page.tsx
│   │   ├── quests/page.tsx
│   │   ├── badges/page.tsx
│   │   ├── races/page.tsx
│   │   ├── race/[id]/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── profile/settings/page.tsx
│   │   ├── run/[id]/page.tsx
│   │   ├── run/[id]/share/page.tsx
│   │   ├── run/new/page.tsx
│   │   ├── coach/page.tsx
│   │   ├── coach/plan/page.tsx
│   │   ├── guildes/page.tsx
│   │   ├── guildes/[id]/page.tsx
│   │   └── api/
│   │       ├── coach/plan/route.ts
│   │       └── oauth/strava/…
│   ├── components/
│   │   ├── layout/BottomNav.tsx
│   │   └── ui/{PlayerHUD,QuestCard,BadgeCard,StatTile,SectionHeader,TQLogo}.tsx
│   └── lib/
│       ├── types.ts                # User, Run, Badge, Quest, Race + XP formulas
│       ├── data/                   # badges, quests, races, me, guildes, leaderboard
│       ├── supabase/{client,server,types}.ts
│       └── watches/{strava,garmin}.ts
├── supabase/migrations/0001_initial_schema.sql
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## ⚡ Moteur de gamification

`src/lib/types.ts` expose :

```ts
levelFromXp(xp)         // LVL = floor(√(xp/100) + 1)
computeRunXp(run)       // base = distance*10 + D+*0.5 × multiplicateur terrain
TITLES[]                // LVL1 "Randonneur du dimanche" → LVL100 "Dieu du trail"
```

Chaque rareté a son style dans `RARITY_STYLES`.

---

## 🎯 Roadmap

**Livré**

- [x] Onboarding 5 étapes (UTMB/ITRA optionnels)
- [x] Home, Quests, Badges, Races, Leaderboard, Profile, Run detail
- [x] Mode Adventure/Performance
- [x] User testing 4 personas + top 5 fixes appliqués
- [x] Coach IA (hub + plan generator + API)
- [x] Guildes (teams 5-20, défis collectifs)
- [x] Share post-run (4 templates story 9:16)
- [x] Settings complets
- [x] Supabase schema + RLS + auth trigger
- [x] Strava OAuth scaffold (prêt à activer)
- [x] Rebrand → Esprit trail + baseline "Le trail, il a changé"

**À venir**

- [ ] Créer le projet Supabase et jouer la migration (engage coûts — validation Guillaume)
- [ ] Wiring Supabase côté Server Components
- [ ] Déclarer l'app Strava + obtenir les clés API
- [ ] Brancher Claude dans `/api/coach/plan` (`ANTHROPIC_API_KEY`)
- [ ] GPS tracking temps réel (PWA + wake lock)
- [ ] Marketplace matos d'occasion
- [ ] Notifications météo / alertes courses ouvertes
- [ ] User testing V2 post-fixes

---

*Esprit trail — le trail, il a changé.* 🌙
