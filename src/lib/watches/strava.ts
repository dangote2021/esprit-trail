// ====== STRAVA API — adaptateur ======
//
// Doc : https://developers.strava.com/docs/reference/
// OAuth 2.0 + refresh token flow.
//
// Scopes requis pour Ravito :
//   activity:read_all         → lire toutes les activités (même privées)
//   profile:read_all          → lire le profil
//   activity:write (option)   → pousser dans Strava depuis Ravito (post-MVP)

const STRAVA_OAUTH_URL = "https://www.strava.com/oauth/authorize";
const STRAVA_TOKEN_URL = "https://www.strava.com/oauth/token";
const STRAVA_API = "https://www.strava.com/api/v3";

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  athlete?: {
    id: number;
    firstname: string;
    lastname: string;
    profile: string;
  };
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string; // "Run", "TrailRun", "Hike"…
  sport_type: string;
  start_date: string;
  distance: number; // mètres
  total_elevation_gain: number; // mètres
  moving_time: number; // secondes
  average_speed: number; // m/s
  start_latlng?: [number, number];
  map?: { summary_polyline: string };
}

export function buildAuthorizeUrl(state: string): string {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirect = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
  if (!clientId || !redirect) {
    throw new Error("STRAVA_CLIENT_ID ou NEXT_PUBLIC_STRAVA_REDIRECT_URI manquant");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirect,
    approval_prompt: "auto",
    scope: "activity:read_all,profile:read_all",
    state,
  });
  return `${STRAVA_OAUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<StravaTokens> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    throw new Error(`Strava token exchange failed: ${res.status}`);
  }
  return res.json();
}

export async function refreshTokens(
  refreshToken: string
): Promise<StravaTokens> {
  const res = await fetch(STRAVA_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Strava refresh failed: ${res.status}`);
  return res.json();
}

export async function listActivities(
  accessToken: string,
  opts: { page?: number; perPage?: number; after?: number } = {}
): Promise<StravaActivity[]> {
  const params = new URLSearchParams();
  if (opts.page) params.set("page", String(opts.page));
  if (opts.perPage) params.set("per_page", String(opts.perPage));
  if (opts.after) params.set("after", String(opts.after));

  const res = await fetch(
    `${STRAVA_API}/athlete/activities?${params.toString()}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!res.ok) throw new Error(`Strava list activities failed: ${res.status}`);
  return res.json();
}

// Map Strava activity → Ravito Run
export function stravaToRun(a: StravaActivity, userId: string) {
  const distanceKm = a.distance / 1000;
  const avgPaceSec = distanceKm > 0 ? a.moving_time / distanceKm : 0;
  const mm = Math.floor(avgPaceSec / 60);
  const ss = Math.floor(avgPaceSec % 60)
    .toString()
    .padStart(2, "0");

  // Terrain deviné à partir du D+/km
  const dPlusPerKm = distanceKm > 0 ? a.total_elevation_gain / distanceKm : 0;
  let terrain: "flat" | "hilly" | "mountain" | "alpine" | "technical" = "flat";
  if (dPlusPerKm > 80) terrain = "alpine";
  else if (dPlusPerKm > 50) terrain = "mountain";
  else if (dPlusPerKm > 20) terrain = "hilly";

  return {
    user_id: userId,
    external_id: a.id.toString(),
    source: "strava" as const,
    date: a.start_date,
    title: a.name,
    location: null,
    distance: Number(distanceKm.toFixed(2)),
    elevation: Math.round(a.total_elevation_gain),
    duration: a.moving_time,
    avg_pace: `${mm}:${ss}/km`,
    terrain,
    polyline: a.map?.summary_polyline || null,
  };
}
