# 🏔️ Ravito

> **Le trail, il a changé.**

**L'app trail nouvelle génération.** Gamification maîtrisée, UTMB Index, ITRA, défis hebdo, badges significatifs, loot drops contextuels. Deux modes : *Adventure* (gamifié, vibe Clem qui court × Casquette Verte) ou *Performance* (data pro, sobre).

Ravito, c'est le moment clé du trail — l'arrêt où tu te recharges, où tu croises les bénévoles, où tu récupères avant de repartir. L'app porte ce nom parce qu'elle veut être ça pour ta pratique : un point de ravitaillement permanent, qui te donne ce qu'il faut quand il le faut.

---

## ✨ Ce qui est dans l'app

**Onboarding v3 RPG (8 chapitres)**
1. NOUVELLE PARTIE (splash + nom)
2. Mode de jeu : Adventure ou Performance
3. Classe de traileur (Sprinter / Ultra / Alpiniste / Technicien / Flâneur)
4. Pratique (années, km hebdo, plus grosse course)
5. Character SIMS (casquette + tshirt + short + chaussures + marques)
6. Reveal stats animées (endurance / vitesse / technique / mental / grimpe)
7. Goals adaptés au mode
8. Sync montres + Lance le jeu

**Home (Dashboard)**
- PlayerHUD avec avatar Character SIMS, level, XP bar, rythme hebdo
- Tuiles stats personnalisées selon le mode
- CTA "Lance ta sortie"
- Quêtes du jour + semaine
- Derniers runs + prochaine course + top badges

**Character SIMS** (`/profile/character`)
Mode customisation : tabs Tête / Corps / Jambes / Pieds. Marques réelles (Hoka, Salomon, La Sportiva, On, Nike, Adidas, Altra…) + easter eggs (Casquette Verte 🧢, Ravito 🏠, t-shirt Rose bouzin 💖).

**Coach IA Claude** (`/coach`)
Plan d'entraînement perso généré par **Claude Sonnet 4.6**. Tu donnes ton objectif, ton niveau, ton dispo, ta date de course — il te sort un plan semaine par semaine avec périodisation réelle (foundation → build → peak → taper → race), séances de qualité, conseils du coach par phase.

**Quêtes** (daily, weekly, seasonal, epic)
**Badges / Trophées** (40+ badges, 5 raretés)
**Courses** (12 courses iconiques)
**Leaderboard** (Amis / Région / Monde)
**Profil / Cockpit** (UTMB Index, ITRA, montres, stats)
**Run detail + Share** (4 templates story 9:16)
**Guildes** (teams 5-20 pratiquants)

---

## 🛠 Stack

- **Next.js 14.2** (App Router)
- **TypeScript** strict
- **Tailwind CSS 3.4** + design tokens custom
- **Supabase** (auth + DB + RLS)
- **Claude Sonnet 4.6** pour le coach IA
- **Strava OAuth 2.0** pour la sync
- **Vercel** pour le deploy auto depuis GitHub

---

## 🚀 Dev local

```bash
git clone https://github.com/dangote2021/esprit-trail.git ravito
cd ravito
npm install
npm run dev
```

Env vars :
```
ANTHROPIC_API_KEY=sk-ant-...     # pour le coach IA
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
STRAVA_CLIENT_ID=...
STRAVA_CLIENT_SECRET=...
```

---

## 📦 Structure

```
ravito/
├── src/
│   ├── app/              # Pages (App Router)
│   ├── components/ui/    # Design system
│   ├── lib/
│   │   ├── character.ts  # Types + palettes avatar SIMS
│   │   ├── trailer-class.ts  # 5 classes RPG avec stats biais
│   │   ├── data/         # Mock data
│   │   └── watches/      # Adaptateurs Strava, Garmin, Coros, Suunto
│   └── styles/
└── supabase/migrations/
```

---

## ✅ Roadmap

- [x] Setup + data model
- [x] Onboarding v1/v2/v3 (RPG character creation)
- [x] Home, Quêtes, Badges, Courses, Leaderboard, Profil
- [x] Run detail + Share (4 templates story)
- [x] Settings, Guildes, Coach IA
- [x] Rebrand → Ravito + baseline "Le trail, il a changé"
- [x] Character SIMS + easter eggs (Casquette Verte, Rose bouzin)
- [x] Coach IA branché sur Claude Sonnet 4.6
- [ ] Off Races (courses punk hors circuit)
- [ ] PWA offline-first
- [ ] Onboarding multi-sports (Terre/Mer/Air)

---

*Ravito — le trail, il a changé.* 🌙
