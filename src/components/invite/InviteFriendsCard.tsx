"use client";

// ====== InviteFriendsCard ======
// Card de parrainage : l'utilisateur invite des potos à rejoindre Esprit Trail
// et reçoit en retour des tickets bonus pour le tirage dossards gratuits.
//
// Mécanique :
// - 1 invité qui s'inscrit = +1 ticket bonus → maximise les chances au
//   tirage des dossards gratuits (PAS de gain automatique)
// - 3 invités = badge "Bouzin recruteur" (badge cosmétique)
// - 5+ invités = chances boostées (les tickets comptent double dans
//   l'urne de tirage)
// - 10+ invités = chances max (tickets comptent triple)
//
// Important : invitter des potos AUGMENTE LES CHANCES, mais ne garantit
// jamais d'obtenir un dossard. Le tirage reste aléatoire.
//
// Tracking initial via localStorage (key: esprit_invites_sent).
// La vérification "l'invité s'est-il vraiment inscrit ?" passera plus tard
// par un système de codes parrain côté backend Supabase.

import { useEffect, useState } from "react";
import ShareSheet from "@/components/share/ShareSheet";
import { showToast } from "@/components/ui/Toast";

const INVITES_KEY = "esprit_invites_sent";
const SITE_URL = "https://esprit-trail.vercel.app";

function getInvitesSent(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(INVITES_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function incrementInvitesSent() {
  if (typeof window === "undefined") return;
  try {
    const current = getInvitesSent();
    window.localStorage.setItem(INVITES_KEY, String(current + 1));
  } catch {
    /* ignore */
  }
}

export default function InviteFriendsCard({
  variant = "full",
}: {
  /** "full" = card complète home, "compact" = petite version pour /challenges/loto */
  variant?: "full" | "compact";
}) {
  const [open, setOpen] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInvitesSent(getInvitesSent());
  }, []);

  // Référé code unique stocké (pour le futur backend)
  const [refCode, setRefCode] = useState("");
  useEffect(() => {
    if (typeof window === "undefined") return;
    let code = window.localStorage.getItem("esprit_ref_code");
    if (!code) {
      code = generateRefCode();
      window.localStorage.setItem("esprit_ref_code", code);
    }
    setRefCode(code);
  }, []);

  const inviteUrl = refCode ? `${SITE_URL}/?ref=${refCode}` : SITE_URL;
  const shareText =
    "Rejoins-moi sur Esprit Trail — l'app coach trail / nutri / spots / dossards gratuits. Entre potos, pleins phares !";

  function handleShare() {
    setOpen(true);
  }

  function trackInviteSent() {
    incrementInvitesSent();
    setInvitesSent(getInvitesSent());
    showToast(
      `✓ Invitation partagée ! +1 chance au tirage`,
      "success",
    );
    // Petite vibration
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([10, 50, 10]);
      } catch {
        /* ignore */
      }
    }
  }

  // Mécanique de récompense
  const bonusTickets = invitesSent;
  const nextMilestone = invitesSent < 3 ? 3 : invitesSent < 5 ? 5 : 10;
  const progress = Math.min(100, (invitesSent / nextMilestone) * 100);

  // Version compact pour /challenges/loto
  if (variant === "compact") {
    return (
      <>
        <div className="rounded-2xl border-2 border-lime/40 bg-gradient-to-br from-lime/15 via-cyan/10 to-bg p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎟️</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono font-black uppercase tracking-widest text-lime">
                Maximise tes chances
              </div>
              <div className="mt-0.5 font-display text-base font-black leading-tight">
                Invite tes potos → + de chances au tirage
              </div>
              {mounted && (
                <div className="mt-1 text-[11px] text-ink-muted">
                  <strong className="text-lime">+{bonusTickets} chance{bonusTickets > 1 ? "s" : ""}</strong>{" "}
                  ajoutée{bonusTickets > 1 ? "s" : ""} à l&apos;urne du tirage
                  ({invitesSent} pot{invitesSent > 1 ? "os" : "o"} invité{invitesSent > 1 ? "s" : ""})
                </div>
              )}
            </div>
            <button
              onClick={handleShare}
              className="shrink-0 rounded-lg bg-lime px-3 py-2 text-[11px] font-mono font-black uppercase tracking-wider text-bg shadow-glow-lime hover:scale-[1.02] transition"
            >
              Inviter
            </button>
          </div>
        </div>
        <ShareSheet
          open={open}
          onClose={() => {
            setOpen(false);
            // On comptabilise une invitation à la fermeture de la modal
            // (l'user a eu la modale, on assume qu'il a partagé)
          }}
          title="Esprit Trail · Coach Trail"
          text={shareText}
          url={inviteUrl}
          eyebrow="Inviter un poto"
          onShared={trackInviteSent}
        />
      </>
    );
  }

  // Version full pour la home
  return (
    <>
      <section
        className="relative overflow-hidden rounded-3xl border-2 border-violet/40 p-5 card-chunky"
        style={{
          // Dégradé "bonus social" : violet doux → violet profond, distinct du
          // vert nature des autres sections + contrasté avec le fond crème.
          background:
            "linear-gradient(135deg, rgba(199,125,255,0.18) 0%, rgba(157,78,221,0.10) 45%, rgba(254,250,224,0) 100%)",
        }}
      >
        {/* Halo subtil top-right pour le ressenti "premium" (cf. OFF Races) */}
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(199,125,255,0.45) 0%, transparent 65%)",
          }}
        />
        <div className="pointer-events-none absolute -right-4 -top-4 text-[100px] opacity-[0.08] leading-none">
          🎟️
        </div>

        <div className="relative flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-bg card-chunky wobble"
            style={{
              background:
                "linear-gradient(135deg, #c77dff 0%, #5a189a 100%)",
              boxShadow: "0 4px 14px rgba(90,24,154,0.35)",
            }}
          >
            <span className="text-3xl">🎟️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-violet/20 text-violet px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-violet animate-pulse" />
              Parrainage · Maximise tes chances
            </div>
            <div className="mt-1 font-display text-xl font-black leading-tight text-violet">
              Invite ta crew
            </div>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Chaque poto qui rejoint l&apos;app via ton lien =
              <strong className="text-ink"> +1 chance</strong> ajoutée dans
              l&apos;urne du tirage des dossards. Plus vous êtes, plus vous
              gagnez 🎟️ — <strong className="text-ink">sans garantie de gain</strong>.
            </p>
          </div>
        </div>

        {/* Progression bonus */}
        {mounted && (
          <div className="relative mt-4 space-y-2">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink-muted">
                  Chances ajoutées au tirage
                </div>
                <div className="font-display text-3xl font-black text-violet leading-none mt-0.5">
                  +{bonusTickets}
                  <span className="text-base text-ink-dim ml-1">
                    🎟️
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono text-ink-dim">
                  Prochain palier
                </div>
                <div className="font-display text-base font-black text-violet">
                  {invitesSent}/{nextMilestone}
                </div>
              </div>
            </div>
            {/* Bar — dégradé violet qui s'intensifie */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-bg-raised">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, #c77dff 0%, #7b2cbf 60%, #3c096c 100%)",
                }}
              />
            </div>
            {/* Milestones — paliers contrastés qui prennent en intensité */}
            <div className="grid grid-cols-3 gap-1 text-[9px] font-mono pt-1">
              <div
                className={`rounded-md p-1.5 text-center ${
                  invitesSent >= 3
                    ? "bg-violet/15 text-violet border border-violet/30"
                    : "bg-bg-raised/60 text-ink-dim"
                }`}
              >
                <div className="font-black">3 potos</div>
                <div className="opacity-70">Badge Bouzin recruteur</div>
              </div>
              <div
                className={`rounded-md p-1.5 text-center ${
                  invitesSent >= 5 ? "text-white shadow-md" : "bg-bg-raised/60 text-ink-dim"
                }`}
                style={
                  invitesSent >= 5
                    ? {
                        background:
                          "linear-gradient(135deg, #c77dff 0%, #9d4edd 100%)",
                      }
                    : undefined
                }
              >
                <div className="font-black">5 potos</div>
                <div className="opacity-80">Chances ×2 au tirage</div>
              </div>
              <div
                className={`rounded-md p-1.5 text-center ${
                  invitesSent >= 10 ? "text-white shadow-md" : "bg-bg-raised/60 text-ink-dim"
                }`}
                style={
                  invitesSent >= 10
                    ? {
                        background:
                          "linear-gradient(135deg, #7b2cbf 0%, #3c096c 100%)",
                      }
                    : undefined
                }
              >
                <div className="font-black">10 potos</div>
                <div className="opacity-80">Chances ×3 au tirage</div>
              </div>
            </div>
            <p className="text-[9px] text-ink-dim pt-1 leading-relaxed">
              Plus tu invites de potos, plus tes chances montent dans l&apos;urne du
              tirage au sort des dossards. <strong>Sans garantie de gain</strong> —
              le tirage reste aléatoire (mais tes chances sont nettement
              meilleures qu&apos;un coureur qui n&apos;invite personne).
            </p>
          </div>
        )}

        <button
          onClick={handleShare}
          className="relative mt-4 block w-full rounded-xl py-3 text-center font-display font-black uppercase tracking-wider text-white btn-chunky tap-bounce"
          style={{
            background:
              "linear-gradient(135deg, #9d4edd 0%, #5a189a 100%)",
            boxShadow: "0 4px 14px rgba(90,24,154,0.35)",
          }}
        >
          🚀 Inviter un poto
        </button>

        <p className="relative mt-2 text-center text-[9px] font-mono text-ink-dim">
          WhatsApp · SMS · Mail · Lien à copier
        </p>
      </section>

      <ShareSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Esprit Trail · Coach Trail"
        text={shareText}
        url={inviteUrl}
        eyebrow="Inviter un poto"
        onShared={trackInviteSent}
      />
    </>
  );
}

// Génère un code parrain court genre "ZNZ7K3"
function generateRefCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}
