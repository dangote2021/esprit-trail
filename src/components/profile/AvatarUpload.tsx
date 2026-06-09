"use client";

// ====== AvatarUpload ======
// Upload de photo de profil affichée en cercle. Stockage : localStorage en
// dataURL (MVP). Phase 2 = Supabase Storage.
//
// UX :
// - Si photo uploadée : affiche en cercle, avec petit overlay "Changer" et bouton "Retirer"
// - Sinon : affiche placeholder (avatar character SIMS ou emoji ME.avatar) + bouton "Ajouter une photo"

import { useEffect, useRef, useState } from "react";

const KEY = "esprit_avatar_dataurl";
const MAX_SIZE = 800; // resize max 800x800 pour éviter d'exploser le localStorage

function loadAvatar(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function saveAvatar(dataUrl: string | null) {
  try {
    if (dataUrl) {
      window.localStorage.setItem(KEY, dataUrl);
    } else {
      window.localStorage.removeItem(KEY);
    }
    window.dispatchEvent(new Event("esprit-avatar-update"));
  } catch (e) {
    console.error("[Avatar] storage failed", e);
  }
}

// Resize image to MAX_SIZE px max (square crop) + JPEG compression
async function resizeImageToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: file.type });
  const bitmap = await createImageBitmap(blob);

  const size = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - size) / 2;
  const sy = (bitmap.height - size) / 2;

  const out = Math.min(size, MAX_SIZE);
  const canvas = document.createElement("canvas");
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");
  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, out, out);
  return canvas.toDataURL("image/jpeg", 0.85);
}

export default function AvatarUpload({
  fallbackEmoji = "🦊",
  size = 96,
}: {
  fallbackEmoji?: string;
  size?: number;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHydrated(true);
    setAvatar(loadAvatar());
    const refresh = () => setAvatar(loadAvatar());
    window.addEventListener("esprit-avatar-update", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("esprit-avatar-update", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErr("Format non supporté. Choisis une image.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErr("Image trop lourde (max 8 Mo). Compresse-la avant.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      saveAvatar(dataUrl);
      setAvatar(dataUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur upload");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onRemove = () => {
    saveAvatar(null);
    setAvatar(null);
  };

  if (!hydrated) {
    return (
      <div
        className="rounded-full bg-bg-card animate-pulse"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {avatar ? (
          <div
            className="rounded-full border-4 border-lime/40 shadow-glow-lime overflow-hidden bg-bg-card"
            style={{ width: size, height: size }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatar}
              alt="Photo de profil"
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-full border-4 border-dashed border-ink/20 bg-bg-card text-4xl"
            style={{ width: size, height: size }}
          >
            {fallbackEmoji}
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          aria-label={avatar ? "Changer la photo" : "Ajouter une photo"}
          className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-lime text-bg shadow-md ring-2 ring-bg-card transition hover:scale-110 disabled:opacity-50"
        >
          {busy ? (
            <span className="text-xs animate-pulse">...</span>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="hidden"
      />

      {avatar && (
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] font-mono text-ink-dim hover:text-mythic underline-offset-2 hover:underline"
        >
          Retirer la photo
        </button>
      )}
      {err && (
        <div className="text-[10px] text-mythic font-mono text-center max-w-[200px]">
          {err}
        </div>
      )}
    </div>
  );
}
