// ====== DEBUG ENV — neutralisé ======
// Cette route fuitait le préfixe de ANTHROPIC_API_KEY. Désactivée avant lancement.
// Conserver une 404 plutôt que supprimer pour éviter les 500 sur routes cachées.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return new NextResponse("Not Found", { status: 404 });
}
