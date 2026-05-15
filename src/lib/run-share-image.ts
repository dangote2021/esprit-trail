"use client";

// ====== run-share-image.ts ======
// Génère un visuel Story IG/TikTok (1080x1920) d'une sortie via canvas natif.
// Aucune dépendance externe — on dessine directement en 2D pour rester léger.
//
// Renvoie un Blob PNG. À charger soit en download (URL.createObjectURL +
// anchor.click), soit en navigator.share({ files: [...] }) pour partage natif.

export type RunForShare = {
  title: string;
  distance: number; // km
  elevation: number; // m D+
  duration: number; // secondes
  date: string; // ISO
  location?: string | null;
  authorName: string;
  authorUsername: string;
  authorAvatar?: string; // emoji
};

function fmtDuration(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h}h${m.toString().padStart(2, "0")}`;
  return `${m} min`;
}

function fmtPace(km: number, sec: number): string {
  if (km <= 0 || sec <= 0) return "—";
  const paceSec = sec / km;
  const mm = Math.floor(paceSec / 60);
  const ss = Math.floor(paceSec % 60);
  return `${mm}:${ss.toString().padStart(2, "0")}/km`;
}

export async function renderRunShareImage(run: RunForShare): Promise<Blob> {
  const W = 1080;
  const H = 1920;

  // Canvas offscreen
  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? (new OffscreenCanvas(W, H) as unknown as HTMLCanvasElement)
      : Object.assign(document.createElement("canvas"), { width: W, height: H });
  // Pour HTMLCanvasElement
  if ("width" in canvas) {
    canvas.width = W;
    canvas.height = H;
  }
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Background — dégradé sunset Esprit Trail
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#fefae0");
  grad.addColorStop(0.45, "#fcefd1");
  grad.addColorStop(1, "#f6dfae");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Halo orange top-right
  const halo = ctx.createRadialGradient(W * 0.85, H * 0.12, 50, W * 0.85, H * 0.12, 600);
  halo.addColorStop(0, "rgba(247,127,0,0.25)");
  halo.addColorStop(1, "rgba(247,127,0,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // Halo vert bottom-left
  const halo2 = ctx.createRadialGradient(W * 0.15, H * 0.85, 50, W * 0.15, H * 0.85, 600);
  halo2.addColorStop(0, "rgba(132,169,140,0.25)");
  halo2.addColorStop(1, "rgba(132,169,140,0)");
  ctx.fillStyle = halo2;
  ctx.fillRect(0, 0, W, H);

  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  // Logo line ESPRIT TRAIL
  ctx.font = "900 56px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#1b4332";
  ctx.fillText("ESPRIT TRAIL", 80, 90);
  ctx.font = "700 28px ui-monospace, monospace";
  ctx.fillStyle = "#52796f";
  ctx.fillText("LE TRAIL · IL A CHANGÉ", 80, 162);

  // Title de la sortie
  ctx.textAlign = "left";
  ctx.font = "900 88px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#1b4332";
  const titleLines = wrapText(ctx, run.title, W - 160, 88);
  let y = 320;
  for (const line of titleLines.slice(0, 2)) {
    ctx.fillText(line, 80, y);
    y += 100;
  }

  // Date + location
  if (run.location) {
    ctx.font = "500 40px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#52796f";
    ctx.fillText(`📍 ${run.location}`, 80, y + 10);
    y += 70;
  }

  // Stats — gros chiffres centrés sur 3 colonnes
  const statsY = 720;
  const colW = (W - 160) / 3;
  const colors = ["#f77f00", "#185fa5", "#7b2cbf"];
  const stats = [
    { label: "DISTANCE", value: run.distance.toFixed(1), unit: "km" },
    { label: "D+", value: String(Math.round(run.elevation)), unit: "m" },
    { label: "DURÉE", value: fmtDuration(run.duration), unit: "" },
  ];
  stats.forEach((s, i) => {
    const cx = 80 + colW * i + colW / 2;
    ctx.textAlign = "center";
    ctx.font = "700 28px ui-monospace, monospace";
    ctx.fillStyle = "#52796f";
    ctx.fillText(s.label, cx, statsY);

    ctx.font = "900 120px Inter, system-ui, sans-serif";
    ctx.fillStyle = colors[i];
    ctx.fillText(s.value, cx, statsY + 50);

    if (s.unit) {
      ctx.font = "500 36px ui-monospace, monospace";
      ctx.fillStyle = "#52796f";
      ctx.fillText(s.unit, cx, statsY + 200);
    }
  });

  // Pace
  ctx.textAlign = "center";
  ctx.font = "700 44px ui-monospace, monospace";
  ctx.fillStyle = "#1b4332";
  ctx.fillText(`Allure : ${fmtPace(run.distance, run.duration)}`, W / 2, statsY + 290);

  // Pied de page — auteur
  const footerY = H - 320;

  // Card auteur
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  roundRect(ctx, 80, footerY, W - 160, 200, 32);
  ctx.fill();
  ctx.strokeStyle = "rgba(27,67,50,0.15)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Avatar circle
  ctx.beginPath();
  ctx.arc(180, footerY + 100, 60, 0, Math.PI * 2);
  ctx.fillStyle = "#2d6a4f";
  ctx.fill();
  ctx.font = "900 60px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.fillText(run.authorAvatar || "🏃", 180, footerY + 65);

  // Nom + handle
  ctx.textAlign = "left";
  ctx.font = "900 48px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#1b4332";
  ctx.fillText(run.authorName, 280, footerY + 50);

  ctx.font = "500 32px ui-monospace, monospace";
  ctx.fillStyle = "#52796f";
  ctx.fillText(`@${run.authorUsername}`, 280, footerY + 110);

  // Tagline en bas
  ctx.textAlign = "center";
  ctx.font = "700 28px ui-monospace, monospace";
  ctx.fillStyle = "#84a98c";
  ctx.fillText("ESPRIT-TRAIL.VERCEL.APP", W / 2, H - 80);

  // Export en Blob
  return new Promise((resolve, reject) => {
    if ("convertToBlob" in canvas) {
      // OffscreenCanvas
      (canvas as unknown as OffscreenCanvas)
        .convertToBlob({ type: "image/png" })
        .then(resolve)
        .catch(reject);
    } else {
      (canvas as HTMLCanvasElement).toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        "image/png",
      );
    }
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  _fontSize: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? cur + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Télécharge le visuel comme PNG.
 */
export async function downloadRunImage(run: RunForShare, filename = "esprit-trail.png") {
  const blob = await renderRunShareImage(run);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/**
 * Partage natif via navigator.share (Web Share API Level 2). Si pas dispo
 * (desktop, vieux navigateurs), fallback download.
 */
export async function shareRunImage(run: RunForShare, title: string) {
  const blob = await renderRunShareImage(run);
  const file = new File([blob], "esprit-trail.png", { type: "image/png" });
  const nav = navigator as Navigator & {
    canShare?: (data: { files?: File[] }) => boolean;
  };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title,
        text: `Ma sortie sur Esprit Trail`,
      });
      return "shared";
    } catch (e) {
      if ((e as { name?: string }).name === "AbortError") return "cancelled";
      // fallback download
    }
  }
  await downloadRunImage(run);
  return "downloaded";
}
