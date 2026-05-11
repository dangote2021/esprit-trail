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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #F77F00 0%, #C25E00 30%, #1B4332 70%, #0B1D0E 100%)",
          }}
        >
          {/* Pattern subtil */}
          <svg
            className="absolute inset-0 h-full w-full opacity-25"
            viewBox="0 0 400 200"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 160 Q 80 100 160 130 T 320 110 T 400 140 L 400 200 L 0 200 Z"
              fill="#0B1D0E"
              opacity="0.5"
            />
            <path
              d="M 0 175 Q 100 145 200 160 T 400 155 L 400 200 L 0 200 Z"
              fill="#0B1D0E"
              opacity="0.7"
            />
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
