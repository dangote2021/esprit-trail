# Build Android .aab (TWA) — GitHub Actions

Génère automatiquement le `.aab` signé prêt pour Play Console, sans dépendre de PWABuilder.

## Setup (une seule fois — 3 secrets à ajouter)

Va sur **GitHub → Settings → Secrets and variables → Actions → New repository secret** :

| Nom du secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Voir ci-dessous |
| `KEYSTORE_PASSWORD` | `GVHTzLYS0oGv` |
| `KEY_PASSWORD` | `GVHTzLYS0oGv` |

### Pour `ANDROID_KEYSTORE_BASE64`

Le contenu base64 du `signing.keystore` PWABuilder. Copie-colle ce one-liner (longue chaîne) :

→ Le fichier `.keystore-base64.txt` à la racine du repo contient la valeur prête à coller.

Une fois collé dans le secret GitHub, **supprime le fichier `.keystore-base64.txt`** du repo (il a servi de passage). Le secret est désormais stocké chiffré côté GitHub uniquement.

## Lancer un build

1. Va dans **Actions** → **Build Android .aab (TWA)**
2. Clique **Run workflow** (bouton en haut à droite)
3. Renseigne :
   - **Version name** : ex. `1.0.8`
   - **Version code** : entier > précédent upload Play Console (ex. `8` si t'avais uploadé v7)
4. Clique **Run workflow**

Le build prend ~10-15 min. Quand c'est vert, scrolle en bas de la page du run, dans **Artifacts** tu trouves :
- `esprit-trail-1.0.8-aab` → contient `app-release-bundle.aab` à uploader sur Play Console
- `esprit-trail-1.0.8-apk` (optionnel) → APK signé pour tester en sideload sur ton tel

## Ce que fait le workflow

1. Setup JDK 17 + Android SDK 34 + Node 20 + Bubblewrap CLI sur runner GitHub (Ubuntu)
2. Décode le keystore depuis le secret base64
3. `bubblewrap init` sur `https://esprit-trail.vercel.app/manifest.webmanifest`
4. Patch `twa-manifest.json` pour forcer :
   - `packageId: app.ravito` (matche ton listing Play Store existant)
   - `signingKey.alias: my-key-alias`
   - Version name / code passés en input
5. `bubblewrap update` régénère le projet Android Gradle
6. `bubblewrap build` compile et signe le `.aab` avec ta clé
7. Upload artifact téléchargeable

## Troubleshooting

- **Build échoue à l'étape "Decode keystore"** : le secret `ANDROID_KEYSTORE_BASE64` est mal formé. Recopie depuis `.keystore-base64.txt` (sans espaces, sur une seule ligne).
- **Build échoue à "Build .aab"** : check les logs détaillés du Gradle output. Erreur courante : version code déjà utilisée (incrémente).
- **PWA validation fails** : déjà skipée avec `--skipPwaValidation`.
