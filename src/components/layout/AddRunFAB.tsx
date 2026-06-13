"use client";

// ====== AddRunFAB ======
// Bouton flottant "Ajouter une sortie" — visible sur la home et le profil.
// Retour panel test (Théo, 28) : "Pourquoi il est pas là ? J'aurais sûrement
// compris où ajouter une sortie."
//
// Placement : au-dessus du BottomNav (bottom-24 = 6rem), à droite, avec halo
// lime pour qu'on le repère sans chercher.

import Link from "next/link";

export default function AddRunFAB() {
  return (
    <Link
      href="/run/new"
      aria-label="Ajouter une sortie"
      className="fixed bottom-24 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-lime text-bg shadow-glow-lime active:scale-95 transition safe-bottom"
      style={{
        boxShadow:
          "0 8px 20px rgba(132,169,140,0.45), 0 2px 6px rgba(27,67,50,0.18)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="h-7 w-7"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <span className="sr-only">Ajouter une sortie</span>
    </Link>
  );
}
