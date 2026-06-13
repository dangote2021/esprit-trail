"use client";

// ====== SubmittedByBadge ======
// Petit badge "Proposée par @username" qui apparaît sur une race card quand
// celle-ci a été soumise par un user de la communauté. Cliquable → renvoie
// vers /u/[username] (profil public).

import Link from "next/link";

export default function SubmittedByBadge({
  username,
  displayName,
  avatar,
  tone = "lime",
}: {
  username: string;
  displayName: string;
  avatar: string;
  tone?: "lime" | "violet" | "peach";
}) {
  const tones: Record<string, string> = {
    lime: "border-lime/40 bg-lime/10 text-lime hover:bg-lime/20",
    violet: "border-violet/40 bg-violet/10 text-violet hover:bg-violet/20",
    peach: "border-peach/40 bg-peach/10 text-peach hover:bg-peach/20",
  };
  return (
    <Link
      href={`/u/${encodeURIComponent(username)}`}
      // Stoppe la propagation pour ne pas ouvrir la card en arrière-plan
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono font-black transition ${tones[tone]}`}
      title={`Voir le profil de ${displayName}`}
    >
      <span aria-hidden className="text-sm leading-none">
        {avatar}
      </span>
      <span className="uppercase tracking-wider">
        Proposée par <span className="font-black">@{username}</span>
      </span>
    </Link>
  );
}
