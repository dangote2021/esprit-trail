# Pre-public-release fixes

Documented Play Console warnings to apply automatically when building the public release (v1.0.9+).

The workflow `build-aab.yml` has a `productionRelease` boolean input. When set to **true**, both fixes below are applied automatically — no manual editing required.

For closed testing (current v1.0.8), leave `productionRelease=false` and ignore the warnings.

---

## Fix 1 — Orientation lock on large screens (Android 16)

**Play Console warning:** *"Supprimez les restrictions de redimensionnement et d'orientation dans votre appli pour la rendre compatible avec les appareils à grand écran"*

**Cause:** The TWA manifest forces `orientation: "portrait"`. Android 16+ ignores this on tablets and foldables, but our app would still be forced portrait on Android 15 large screens.

**Fix applied when `productionRelease=true`:** patches `twa-manifest.json` to set `orientation: "any"` before `bubblewrap update` regenerates the gradle project.

**Impact on UX:** tablets and foldables can rotate freely. Phones remain portrait by default because the PWA's responsive CSS handles it.

---

## Fix 2 — Edge-to-edge enforcement (Android 15)

**Play Console warning:** *"Votre appli utilise des API ou des paramètres obsolètes pour l'affichage de bord à bord"*

**Cause:** Android 15 (SDK 35) forces edge-to-edge display. TWAs wrapping a PWA inherit legacy `fitSystemWindows` behavior that conflicts with this.

**Fix applied when `productionRelease=true`:** creates (or patches) `app/src/main/res/values-v31/styles.xml` to opt out of automatic enforcement via:

```xml
<item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>
```

The PWA's CSS already uses `env(safe-area-inset-*)` so manual layout works correctly.

**Impact on UX:** status bar and navigation bar render as before, no overlap with web content.

---

## How to trigger the production build

1. Go to **Actions → Build Android .aab (TWA) → Run workflow**
2. Set:
   - `versionName`: `1.0.9` (or higher)
   - `versionCode`: `9` (or higher, must be > previous upload)
   - **`productionRelease`: ✅ true**
3. Click **Run workflow**

The two fixes will be applied automatically. The resulting `.aab` is suitable for public Production release on Play Console.

---

## Verifying the fixes were applied

In the workflow run logs, look for these confirmation messages:

```
[PROD] Applied fix: orientation=any (large-screen warning)
[PROD] Created app/src/main/res/values-v31/styles.xml with edge-to-edge opt-out
```

(Or `[PROD] Patched existing styles.xml` if Bubblewrap pre-generated one.)

---

## Future fixes to add here

When new Play Console warnings appear before public launch, document them in this file and add the corresponding conditional step in `build-aab.yml` guarded by `if: ${{ inputs.productionRelease == true }}`.
