import { NextResponse } from "next/server";

// ====== DEBUG ENV — endpoint temporaire pour vérifier ANTHROPIC_API_KEY ======
// Ne renvoie PAS la clé complète, juste :
// - hasKey : true/false
// - keyPrefix : les 10 premiers caractères (ex "sk-ant-api")
// - keyLength : longueur totale
// Utile pour vérifier si Vercel injecte bien la variable dans la lambda prod.

export const runtime = "nodejs";

export async function GET() {
  const key = process.env.ANTHROPIC_API_KEY;
  const allAnthropic = Object.keys(process.env).filter((k) =>
    k.toLowerCase().includes("anthropic")
  );

  return NextResponse.json({
    hasKey: !!key,
    keyPrefix: key ? key.slice(0, 10) : null,
    keyLength: key ? key.length : 0,
    anthropicVarsFound: allAnthropic,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
    timestamp: new Date().toISOString(),
  });
}
