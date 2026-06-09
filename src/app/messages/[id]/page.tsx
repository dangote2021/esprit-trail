// ====== /messages/[id] — page conversation ======
// On délègue tout au composant client ConversationThread qui fetch les
// messages via Supabase (avec fallback mock). Pas de generateStaticParams
// pour éviter de pré-builder des slugs serveur — les vraies convs ont des
// UUID Supabase générés dynamiquement.

import ConversationThread from "@/components/messages/ConversationThread";

export const dynamic = "force-dynamic";

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  // Le composant client charge lui-même conversation + messages via Supabase
  return <ConversationThread conversationId={params.id} />;
}
