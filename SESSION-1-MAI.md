# Session 1er mai 2026 — Récap & Checklist lancement store

> **Update fin de session :** logo E choisi et appliqué partout dans l'app +
> fiche store. "Ladder" → "Ranking" dans la nav et la page leaderboard.
> Endpoint `/.well-known/assetlinks.json` créé (envoie [] tant que les env vars
> `TWA_PACKAGE_NAME` et `TWA_SHA256_FINGERPRINT` ne sont pas set sur Vercel).


URL prod : **https://esprit-trail.vercel.app**

---

## 🎯 Ce qui a été fait cette session

### Côté produit
- **Feature "Dossards en jeu"** complète : pages `/challenges/loto`, `/challenges/loto/[slug]`, `/organisateurs`
- **Mécanique de tirage** avec 4 challenges mock (CCC, MaxiRace, Templiers, FKT Cévennes) + ticket par challenge accompli + 1 ticket bonus par pote invité WhatsApp (max +5)
- **Gating éligibilité par difficulté de course** : volume km + D+ requis sur 30 jours glissants, calé sur la course (CCC=80km/2000D+ Engagé, Templiers=60/1500 Élevé, MaxiRace=30/800 Soutenu, FKT=50/1000 Soutenu). Bouton "Je participe" bloqué si volume insuffisant + redirect vers Coach IA.
- **Composant `WhatsAppShare`** : Web Share API native sur mobile + fallback `wa.me`. Lien partagé contient `?ref=XXXX` pour crédit ami → ticket bonus

### Côté UX & marque
- **Nouvelle baseline** : "L'app trail qui te permet de progresser sans te blesser, de participer à des courses off et de gagner des dossards grâce à tes km parcourus"
- Appliquée sur : manifest PWA, métadonnées SEO, OG image dynamique, hero `/about`, fiche Play Store
- **Section "Pourquoi Ravito existe"** refondue avec 3 cards (Esprit Trail vivant / Âme au centre / Progresser sans se blesser)
- **Carte Panini + Character** retirées de "Ce que Ravito t'apporte", remplacées par "Dossards en jeu"
- **Paragraphe "sentent le sel sur leurs gourdes de flask"** supprimé
- **Copy login/signup** nettoyée : zéro langage cru pour la policy Google Play
- **Capitalisation "L'Esprit Trail"** harmonisée partout (logo, contact, OG)

### Côté sécurité & infra
- **Google Auth** : diagnostic complet + activation côté Supabase (toi) + feature flag `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` côté code. Confirmé fonctionnel via test endpoint Supabase OAuth (302 redirect vers Google avec ton Client ID).
- **Hardening Supabase** : `REVOKE EXECUTE ON public.handle_new_user() FROM anon, authenticated, public` — fonction n'est plus exposée via REST publique mais continue de marcher comme trigger sur `auth.users`
- **Advisors Supabase Ravito** : 0 erreur, 1 warning restant (Leaked Password Protection, action toi)

### Côté assets & logo
- **6 variantes de logo** générées dans `/store/logo-options/` (PNG + SVG) — à arbitrer ensemble :
  - **A** Heavy condensed (Patagonia/UTMB-vibe)
  - **B** Stencil cut (Salomon/Black Diamond-vibe)
  - **C** Italique aérodynamique (Hoka/On Running-vibe)
  - **D** Mark + wordmark horizontal (Arc'teryx-vibe, format 1600×600)
  - **E** Icône seule fond vert forêt (parfait pour app icon Play Store + favicon)
  - **F** Monochrome (presse, impressions)
- **Screenshots Play Store** régénérés avec la nouvelle baseline + le teaser "Dossards en jeu" sur la home
- **Feature graphic 1024×500** + icône 512 + listing.md prêts dans `/store/play/`

---

## 🚦 CHECKLIST FINALE — Ce que tu dois faire en manuel avant le lancement Play Store

### 🔥 BLOQUANTS — sans ça, pas de lancement

#### 1. Supabase Dashboard — quelques toggles à faire
**URL :** https://supabase.com/dashboard/project/kymhcdxcyrpwyxbtgrdt

- [ ] **Auth → Providers → Email** : vérifier que les **email templates** sont customisés (`magic-link`, `confirm-signup`, `reset-password`, `email-change`). Les fichiers HTML existent déjà dans le repo sous `supabase/email-templates/` — il faut les copier-coller dans le dashboard.
- [ ] **Auth → Policies → Password security** : activer **"Leaked Password Protection"** (check HaveIBeenPwned.org). Toggle simple, gratuit. *(C'est le dernier warning des advisors Supabase.)*
- [ ] **Auth → URL Configuration** : vérifier que la liste **"Redirect URLs"** contient au moins :
  - `https://esprit-trail.vercel.app/auth/callback`
  - `https://esprit-trail.vercel.app/**` (wildcard pour les preview deploys)
  - Site URL : `https://esprit-trail.vercel.app`

#### 2. Choisir une direction de logo
Va dans `/store/logo-options/` (sur ton mac, dans le dossier de partage), regarde les 6 PNG. Tu me dis lequel tu préfères, je l'applique partout (TQLogo, favicon, app icon Play Store, OG image, splash screen).

Ma reco perso : **A (heavy condensed) pour le wordmark + E (icône fond vert) pour l'app icon**. C'est le combo le plus pro / outdoor / et qui se lit bien à toute taille.

#### 3. Google Play Console — création + soumission TWA
**Préalable** : avoir un Mac/PC avec Java + Android SDK + une clé de signature Android. C'est ce qui prend le plus de temps si tu n'as jamais fait de TWA.

- [ ] Créer un compte **Google Play Console** (25 $ one-shot, lifetime) : https://play.google.com/console/signup
- [ ] Installer **Bubblewrap** : `npm i -g @bubblewrap/cli` (Node 18+ requis)
- [ ] Initialiser le projet TWA :
  ```bash
  bubblewrap init --manifest https://esprit-trail.vercel.app/manifest.webmanifest
  bubblewrap build
  ```
  → te produit un fichier `.aab` (Android App Bundle) et un keystore.
- [ ] **Récupérer la SHA-256 fingerprint** du keystore :
  ```bash
  keytool -list -v -keystore ./android.keystore -alias android | grep SHA256
  ```
  Puis dans Vercel → Settings → Environment Variables → ajouter en Production :
  - `TWA_PACKAGE_NAME` = `app.ravito.twa` (ou ce que Bubblewrap a généré)
  - `TWA_SHA256_FINGERPRINT` = la fingerprint (format `AB:CD:EF:...`)
  Redéploie. L'endpoint `/.well-known/assetlinks.json` renverra automatiquement le bon JSON. (Endpoint déjà codé et live, en attendant ces 2 vars.)
- [ ] **Créer l'app** dans Play Console :
  - App name : `Ravito — L'Esprit Trail`
  - Default language : Français (France)
  - Type : App
  - Free
- [ ] **Coller la fiche** depuis `/store/play/listing.md` (descriptions courte + longue + keywords)
- [ ] **Upload assets** :
  - `/store/play/icon-512.png` (icône)
  - `/store/play/feature-graphic-1024x500.png` (bannière)
  - 6 screenshots de `/store/play/screenshots/01-home.png` → `06-cgu.png`
- [ ] **Upload .aab** → Test interne d'abord, ajoute toi + 1-2 testeurs, **valide l'install et le login depuis le téléphone**
- [ ] Lancer un **pre-launch report** (Google teste sur 5-10 vrais devices, te remonte les crashes)
- [ ] Si tout est OK → **Production rollout** progressif (20% → 50% → 100% sur 3-4 jours)

### ⚠️ Souhaitables — pour soigner le launch

#### 4. Domaine custom (optionnel mais conseillé pour le marketing)
- `ravito.app` est pris (vérifié via Vercel domain check)
- Alternative dispo : **ravito.co** à 4,99 $/an
- Si tu l'achètes, configure-le sur Vercel → Domains, et redirige de `esprit-trail.vercel.app` vers `ravito.co`

#### 5. Analytics RGPD-friendly
On utilise rien aujourd'hui. À brancher : **Plausible** ou **Umami** (pas Google Analytics, pour RGPD-friendly et pas de cookie banner pourri). 5 minutes d'install.

#### 6. Google Cloud Console — passer l'OAuth en mode "Production"
Aujourd'hui ton OAuth Google est probablement encore en "Testing" (donc bloqué à 100 users max et avec un warning "App not verified"). Pour passer en Production :
- https://console.cloud.google.com/apis/credentials/consent
- Onglet OAuth consent screen → Status → **Publish App**
- Optionnellement : Submit for verification (Google met 2-3 semaines, mais c'est pas bloquant pour le lancement Play Store)

---

## 🗂️ Récap des fichiers / dossiers utiles

| Chemin | Contenu |
|---|---|
| `/store/play/listing.md` | Fiche Play Store complète, prête à coller |
| `/store/play/feature-graphic-1024x500.png` | Bannière fiche Play Store |
| `/store/play/icon-512.png` | Icône app store (la version actuelle, à remplacer une fois logo choisi) |
| `/store/play/screenshots/` | 6 screenshots Play Store (1080×1920 mobile) |
| `/store/play/screenshots-loto/` | 4 screenshots feature Dossards en jeu |
| `/store/logo-options/` | **6 directions de logo à arbitrer (A→F)** |
| `/native/STORES.md` | Doc complète soumission Play Store via Bubblewrap |
| `/SESSION-1-MAI.md` | Ce fichier |
| `/SESSION-30-AVRIL.md` | Récap de la session précédente |

---

## 📊 État santé prod (validé maintenant)

| Check | Résultat |
|---|---|
| Routes publiques principales (HTTP 200) | ✅ /, /about, /install, /login, /signup, /challenges/loto, /organisateurs, /legal/* |
| Manifest PWA | ✅ description = nouvelle baseline |
| OG image dynamique | ✅ avec nouveau wordmark "Progresse / Cours off / Gagne des dossards" |
| Supabase Auth security | ✅ 0 ERROR, 1 WARN (Leaked Password Protection — toggle manuel) |
| Supabase RLS Ravito (`public.*`) | ✅ Tout en place, fonctions sécurisées (handle_new_user revoke) |
| Endpoint Supabase OAuth Google | ✅ 302 vers Google avec Client ID configuré |
| Bouton Google sur /login | ✅ Visible (feature flag activée) |

---

## 💡 Quelques notes pour la suite (post-launch)

- Le mock data des `/challenges/loto` est en `localStorage`. Quand un vrai organisateur signe, on bascule sur des tables Supabase (`bib_challenges`, `participations`, `referrals`, `lottery_draws`). C'est 1 jour de boulot.
- Pour la **vérification du challenge accompli** : aujourd'hui c'est auto-déclaratif. Phase 2 = lecture auto via la sync Strava (déjà en place côté infra), tag `#RavitoLoto` sur l'activité.
- Le **mailto organisateurs** envoie sur `ravito.trail.app@gmail.com` avec un template prérempli. À remplacer plus tard par un formulaire dans Supabase.
- Pour iOS : pas besoin d'App Store, ils installent la PWA via Safari → Partager → "Ajouter à l'écran d'accueil". Le banner d'aide s'affiche automatiquement la première fois.

Bon retour. Tu me dis quel logo tu choisis et je l'applique partout.
