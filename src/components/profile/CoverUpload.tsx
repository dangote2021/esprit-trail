"use client";

// ====== CoverUpload ======
// Upload de cover picture (bannière) pour le profil. Format 16:9, stockage
// localStorage en dataURL (MVP). Phase 2 = Supabase Storage.
//
// UX :
// - Si cover uploadée : affichée plein largeur en background
// - Sinon : dégradé palette Esprit Trail (peach → cyan → bg) + petit bouton "Ajouter une cover"

import { useEffect, useRef, useState } from "react";

const KEY = "esprit_cover_dataurl";
const MAX_W = 1600;
const MAX_H = 900;

function loadCover(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function saveCover(dataUrl: string | null) {
  try {
    if (dataUrl) {
      window.localStorage.setItem(KEY, dataUrl);
    } else {
      window.localStorage.removeItem(KEY);
    }
    window.dispatchEvent(new Event("esprit-cover-update"));
  } catch (e) {
    console.error("[Cover] storage failed", e);
  }
}

async function resizeCover(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  const bitmap = await createImageBitmap(blob);
  // On veut un crop 16:9 centré
  const aspect = 16 / 9;
  let cropW = bitmap.width;
  let cropH = bitmap.height;
  if (cropW / cropH > aspect) {
    cropW = Math.round(cropH * aspect);
  } else {
    cropH = Math.round(cropW / aspect);
  }
  const sx = (bitmap.width - cropW) / 2;
  const sy = (bitmap.height - cropH) / 2;
  const outW = Math.min(cropW, MAX_W);
  const outH = Math.round(outW / aspect);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");
  ctx.drawImage(bitmap, sx, sy, cropW, cropH, 0, 0, outW, outH);
  return canvas.toDataURL("image/jpeg", 0.82);
}

export default function CoverUpload({
  height = 180,
  children,
}: {
  height?: number;
  children?: React.ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [cover, setCover] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHydrated(true);
    setCover(loadCover());
    const refresh = () => setCover(loadCover());
    window.addEventListener("esprit-cover-update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit-cover-update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setErr("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Choisis une image (JPG/PNG)");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setErr("Image trop lourde (max 12 Mo)");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await resizeCover(file);
      saveCover(dataUrl);
      setCover(dataUrl);
    } catch (e) {
      setErr(`Erreur : ${e instanceof Error ? e.message : "redimensionnement"}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    saveCover(null);
    setCover(null);
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-t-3xl"
      style={{ height }}
    >
      {/* Fond : photo uploadée OU dégradé fallback */}
      {hydrated && cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt="Cover profil"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          {/* Scène par défaut : montagne + sentier + ciel coucher de soleil */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid slice"
            aria-label="Cover par défaut : montagne et sentier"
          >
            <defs>
              <linearGradient id="sky-default" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F77F00" />
                <stop offset="45%" stopColor="#DDA15E" />
                <stop offset="100%" stopColor="#FEFAE0" />
              </linearGradient>
              <linearGradient id="mtn-far" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7B9E89" />
                <stop offset="100%" stopColor="#A8C0AB" />
              </linearGradient>
              <linearGradient id="mtn-mid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2D6A4F" />
                <stop offset="100%" stopColor="#1B4332" />
              </linearGradient>
              <linearGradient id="mtn-near" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B4332" />
                <stop offset="100%" stopColor="#0B1D0E" />
              </linearGradient>
            </defs>

            {/* Ciel */}
            <rect width="400" height="200" fill="url(#sky-default)" />

            {/* Soleil */}
            <circle cx="305" cy="78" r="22" fill="#FFD89C" opacity="0.95" />
            <circle cx="305" cy="78" r="14" fill="#FFFBE8" opacity="0.9" />

            {/* Montagnes lointaines */}
            <path
              d="M 0 130 L 50 95 L 95 115 L 140 80 L 185 110 L 230 88 L 280 108 L 330 92 L 400 118 L 400 200 L 0 200 Z"
              fill="url(#mtn-far)"
              opacity="0.85"
            />

            {/* Montagnes plan moyen */}
            <path
              d="M 0 155 L 40 120 L 75 140 L 120 95 L 165 125 L 210 105 L 250 130 L 295 110 L 340 132 L 400 145 L 400 200 L 0 200 Z"
              fill="url(#mtn-mid)"
            />
            {/* Neige sur les pics */}
            <path d="M 115 100 L 120 95 L 125 100 L 122 105 L 118 105 Z" fill="#FEFAE0" opacity="0.9" />
            <path d="M 207 110 L 210 105 L 213 110 L 211 113 L 209 113 Z" fill="#FEFAE0" opacity="0.9" />
            <path d="M 292 115 L 295 110 L 298 115 L 296 118 L 294 118 Z" fill="#FEFAE0" opacity="0.85" />

            {/* Collines + forêt sombre devant */}
            <path
              d="M 0 175 Q 60 150 130 165 T 260 158 T 400 168 L 400 200 L 0 200 Z"
              fill="url(#mtn-near)"
            />

            {/* Sentier serpentant vers les montagnes */}
            <path
              d="M 180 200 Q 175 188 195 178 Q 215 168 205 158 Q 195 148 215 142"
              stroke="#DDA15E"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.75"
            />
            <path
              d="M 180 200 Q 175 188 195 178 Q 215 168 205 158 Q 195 148 215 142"
              stroke="#FEFAE0"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2 4"
              fill="none"
              opacity="0.5"
            />

            {/* Sapins silhouettes le long du sentier */}
            <g fill="#0B1D0E" opacity="0.75">
              <polygon points="155,178 158,170 161,178" />
              <polygon points="158,178 161,168 164,178" />
              <polygon points="240,172 244,162 248,172" />
              <polygon points="295,170 298,160 301,170" />
              <polygon points="80,180 84,170 88,180" />
              <polygon points="350,175 354,164 358,175" />
            </g>

            {/* Silhouette de traileur sur le sentier */}
            <g fill="#0B1D0E" opacity="0.85">
              <circle cx="210" cy="153" r="1.6" />
              <rect x="209.2" y="154.5" width="1.8" height="3.5" rx="0.5" />
            </g>
          </svg>
        </div>
      )}

      {/* Gradient overlay pour lisibilité du contenu superposé */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/30" />

      {/* Boutons upload (en haut à droite) */}
      <div className="absolute right-2 top-2 z-10 flex gap-1.5">
        {hydrated && cover && (
          <button
            onClick={handleRemove}
            className="rounded-md bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:bg-black/80 transition"
            aria-label="Retirer la cover"
          >
            ✕
          </button>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="rounded-md bg-black/60 backdrop-blur px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white hover:bg-black/80 transition disabled:opacity-50"
          aria-label={cover ? "Changer la cover" : "Ajouter une cover"}
        >
          {busy ? "..." : cover ? "✎" : "📷 Cover"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>

      {err && (
        <div className="absolute bottom-2 left-2 z-10 rounded-md bg-red-500/90 px-2 py-1 text-[10px] font-mono text-white">
          {err}
        </div>
      )}

      {/* Slot pour content overlay (ex: avatar circle au-dessus) */}
      {children}
    </div>
  );
}
