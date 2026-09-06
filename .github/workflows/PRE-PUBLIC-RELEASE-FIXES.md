# Pre-public-release fixes

Documented Play Console warnings to apply automatically when building the public release (v1.0.9+).

The workflow `build-aab.yml` has a `productionRelease` boolean input. When set to **true**, Fix 1 below is applied automatically. Fix 2 was reverted on 06/09/26 — see the note after it.

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

**Status: reverted, not currently applied.** The original implementation created `app/src/main/res/values-v31/styles.xml` declaring `<style name="Theme.LauncherActivity" parent="Theme.LauncherActivityBase">`, assuming Bubblewrap's generated project already defined a `Theme.LauncherActivityBase` app theme to extend. It doesn't: Bubblewrap 1.25's `LauncherActivity` has no `android:theme` override at all and inherits `@android:style/Theme.Translucent.NoTitleBar` straight from the `<application>` tag. AAPT failed resource linking with `resource style/Theme.LauncherActivityBase ... not found`, which broke every `productionRelease=true` build (confirmed in workflow run #2, 06/09/26). This step has been removed from `build-aab.yml` so `productionRelease=true` builds succeed again with Fix 1 only.

**To re-add this properly**, a future PR needs to: (1) add `android:theme="@style/Theme.LauncherActivity"` to the `LauncherActivity` entry in the regenerated `AndroidManifest.xml`; (2) define that style with `parent="@android:style/Theme.Translucent.NoTitleBar"` in both `values/styles.xml` (base) and `values-v31/styles.xml` (adding the opt-out item in the latter); (3) bump the installed SDK platform and `compileSdkVersion` to 35+ in the workflow, since `windowOptOutEdgeToEdgeEnforcement` doesn't exist in the android-34 platform currently installed. This is a real Android project/build change — it should be built and tested as its own PR rather than patched blind through CI.

**Until then:** the Play Console warning about edge-to-edge stays open; it's cosmetic (a store warning, not a functional bug) and does not block release.

---

## How to trigger the production build

1. Go to **Actions → Build Android .aab (TWA) → Run workflow**
2. Set:
   - `versionName`: `1.0.9` (or higher)
   - `versionCode`: `9` (or higher, must be > previous upload)
   - **`productionRelease`: ✅ true**
3. Click **Run workflow**

Fix 1 (orientation) will be applied automatically. Fix 2 (edge-to-edge) is not currently applied — see the note above. The resulting `.aab` is still suitable for public Production release on Play Console; the edge-to-edge item will just keep showing as an open (non-blocking) Play Console warning until Fix 2 is redone properly.

---

## Verifying the fixes were applied

In the workflow run logs, look for this confirmation message:

```
[PROD] Applied fix: orientation=any (large-screen warning)
```

---

## Future fixes to add here

When new Play Console warnings appear before public launch, document them in this file and add the corresponding conditional step in `build-aab.yml` guarded by `if: ${{ inputs.productionRelease == true }}`.
