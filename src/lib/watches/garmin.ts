// ====== GARMIN CONNECT API — adaptateur ======
//
// Garmin utilise OAuth 1.0a (legacy) pour son Health API / Activity API.
// Doc : https://developer.garmin.com/gc-developer-program/activity-api/
//
// Le programme partenaire nécessite une validation manuelle de Garmin.
// Pendant l'attente, alternative :
//   - Intégration via Strava (les Garmin poussent auto vers Strava)
//   - Import de fichiers .fit/.gpx manuels
//
// Ce fichier est un scaffold — l'implémentation complète arrive une fois le
// programme partenaire validé.

export interface GarminActivity {
  activityId: number;
  activityType: { typeKey: string }; // "trail_running", "running", "hiking"…
  startTimeLocal: string;
  durationInSeconds: number;
  distanceInMeters: number;
  totalElevationGainInMeters: number;
  averagePaceInMinutesPerKilometer?: number;
  locationName?: string;
}

export function buildAuthorizeUrl(): string {
  throw new Error(
    "Garmin OAuth 1.0a — implémentation bloquée tant que le programme partenaire n'est pas validé. En attendant, suggère à l'utilisateur de connecter son Garmin à Strava, puis Esprit trail via Strava."
  );
}

export function garminToRun(a: GarminActivity, userId: string) {
  const distanceKm = a.distanceInMeters / 1000;
  const avgPace = a.averagePaceInMinutesPerKilometer
    ? `${Math.floor(a.averagePaceInMinutesPerKilometer)}:${Math.floor(
        (a.averagePaceInMinutesPerKilometer % 1) * 60
      )
        .toString()
        .padStart(2, "0")}/km`
    : null;

  const dPlusPerKm = distanceKm > 0 ? a.totalElevationGainInMeters / distanceKm : 0;
  let terrain: "flat" | "hilly" | "mountain" | "alpine" | "technical" = "flat";
  if (dPlusPerKm > 80) terrain = "alpine";
  else if (dPlusPerKm > 50) terrain = "mountain";
  else if (dPlusPerKm > 20) terrain = "hilly";

  return {
    user_id: userId,
    external_id: a.activityId.toString(),
    source: "garmin" as const,
    date: a.startTimeLocal,
    title:
      a.activityType.typeKey === "trail_running"
        ? "Trail run"
        : a.activityType.typeKey === "running"
        ? "Run"
        : "Outdoor",
    location: a.locationName || null,
    distance: Number(distanceKm.toFixed(2)),
    elevation: Math.round(a.totalElevationGainInMeters),
    duration: a.durationInSeconds,
    avg_pace: avgPace,
    terrain,
    polyline: null,
  };
}
