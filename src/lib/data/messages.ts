import type { Conversation, Message, MessageUser } from "@/lib/types";

// ====== MOCK MESSAGERIE ======
// Données fictives pour la démo de l'UI. Backend Supabase Realtime en
// Phase 2 (table conversations, conversation_members, messages, RLS).
//
// L'utilisateur courant est `me` (id "me"). Les autres traileurs sont des
// personas du panel utilisé pour les user tests.

export const ME_ID = "me";

export const MESSAGE_USERS: Record<string, MessageUser> = {
  me: {
    id: "me",
    username: "traileur_demo",
    displayName: "Toi",
    avatar: "🏃",
    level: 9,
  },
  "u-clem": {
    id: "u-clem",
    username: "clem_dva",
    displayName: "Clem",
    avatar: "🧗",
    level: 12,
    online: true,
  },
  "u-casquette": {
    id: "u-casquette",
    username: "casquette",
    displayName: "Vincent",
    avatar: "🧢",
    level: 7,
    online: false,
  },
  "u-marine": {
    id: "u-marine",
    username: "marine_trail",
    displayName: "Marine",
    avatar: "🌊",
    level: 15,
    online: true,
  },
  "u-theo": {
    id: "u-theo",
    username: "theod",
    displayName: "Théo D.",
    avatar: "⛰️",
    level: 18,
    online: false,
  },
  "u-sam": {
    id: "u-sam",
    username: "sam_pyrenees",
    displayName: "Sam",
    avatar: "🦬",
    level: 10,
    online: false,
  },
};

export function getUser(id: string): MessageUser | undefined {
  return MESSAGE_USERS[id];
}

// ====== CONVERSATIONS ======

export const CONVERSATIONS: Conversation[] = [
  // === DM avec Clem ===
  {
    id: "c-clem",
    type: "dm",
    members: [MESSAGE_USERS.me, MESSAGE_USERS["u-clem"]],
    lastMessage: {
      text: "Carrément, on part vendredi matin ?",
      authorId: "u-clem",
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  // === Groupe Crew Mercantour ===
  {
    id: "c-crew-mercantour",
    type: "group",
    name: "Crew Mercantour",
    avatar: "🏔️",
    description: "Sorties weekend dans le 06 — Mercantour, Esterel, Mont Vinaigre",
    members: [
      MESSAGE_USERS.me,
      MESSAGE_USERS["u-clem"],
      MESSAGE_USERS["u-marine"],
      MESSAGE_USERS["u-theo"],
    ],
    lastMessage: {
      text: "Marine : Météo top samedi, on part de Tende à 7h",
      authorId: "u-marine",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 5,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  // === DM avec Vincent (casquette) ===
  {
    id: "c-casquette",
    type: "dm",
    members: [MESSAGE_USERS.me, MESSAGE_USERS["u-casquette"]],
    lastMessage: {
      text: "Merci pour le plan nutri 🙏",
      authorId: "u-casquette",
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
  // === Groupe Préparation MaXi-Race ===
  {
    id: "c-prep-maxirace",
    type: "group",
    name: "Prépa MaXi-Race",
    avatar: "🎯",
    description: "On vise le 86 km en mai 2026 — partage des sorties longues",
    members: [
      MESSAGE_USERS.me,
      MESSAGE_USERS["u-sam"],
      MESSAGE_USERS["u-theo"],
    ],
    lastMessage: {
      text: "Théo : J'ai fini ma sortie de 50 km hier, 1800 D+",
      authorId: "u-theo",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ====== MESSAGES PAR CONVERSATION ======
// Trié du plus ancien (top) au plus récent (bas).

export const MESSAGES_BY_CONV: Record<string, Message[]> = {
  "c-clem": [
    {
      id: "m1",
      conversationId: "c-clem",
      authorId: "u-clem",
      text: "Salut ! T'es chaud pour un long ce weekend ?",
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "m2",
      conversationId: "c-clem",
      authorId: "me",
      text: "Carrément ouais. T'as une idée de spot ?",
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "m3",
      conversationId: "c-clem",
      authorId: "u-clem",
      text: "Je pensais à la boucle des 3 Sommets. 38 km, 2400 D+. Ça t'irait ?",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "m4",
      conversationId: "c-clem",
      authorId: "u-clem",
      text: "Check le GPX",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 60000).toISOString(),
      status: "read",
      attachment: {
        type: "spot",
        refId: "trois-sommets",
        title: "Boucle des 3 Sommets",
        subtitle: "38 km · 2400 D+ · Difficulté 4/5",
        href: "/spots",
      },
    },
    {
      id: "m5",
      conversationId: "c-clem",
      authorId: "me",
      text: "Joli ! Ça me va. On part tôt ?",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "m6",
      conversationId: "c-clem",
      authorId: "u-clem",
      text: "Yes, dep 5h30 pour être en haut au lever du soleil",
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: "delivered",
    },
    {
      id: "m7",
      conversationId: "c-clem",
      authorId: "u-clem",
      text: "Carrément, on part vendredi matin ?",
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      status: "delivered",
    },
  ],
  "c-crew-mercantour": [
    {
      id: "g1",
      conversationId: "c-crew-mercantour",
      authorId: "u-theo",
      text: "Salut la team 👋 Qui est chaud pour la sortie de samedi ?",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "g2",
      conversationId: "c-crew-mercantour",
      authorId: "u-clem",
      text: "Moi !",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "g3",
      conversationId: "c-crew-mercantour",
      authorId: "u-marine",
      text: "Présente. On part d'où ?",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "g4",
      conversationId: "c-crew-mercantour",
      authorId: "u-theo",
      text: "Je propose Tende, on monte par le Refuge des Merveilles puis col du Sabion",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "g5",
      conversationId: "c-crew-mercantour",
      authorId: "u-theo",
      text: "Tracé GPX",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000 + 30000).toISOString(),
      status: "read",
      attachment: {
        type: "spot",
        refId: "mercantour-merveilles",
        title: "Refuge des Merveilles · Col du Sabion",
        subtitle: "26 km · 1800 D+ · Difficulté 3/5",
        href: "/spots",
      },
    },
    {
      id: "g6",
      conversationId: "c-crew-mercantour",
      authorId: "u-marine",
      text: "Météo top samedi, on part de Tende à 7h",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "delivered",
    },
  ],
  "c-casquette": [
    {
      id: "v1",
      conversationId: "c-casquette",
      authorId: "u-casquette",
      text: "Salut, t'aurais un plan nutri à me filer pour ma première 50 km ?",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "v2",
      conversationId: "c-casquette",
      authorId: "me",
      text: "Yes carrément, j'utilise le coach IA d'Esprit Trail pour le générer. Je te l'envoie",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 600000).toISOString(),
      status: "read",
    },
    {
      id: "v3",
      conversationId: "c-casquette",
      authorId: "me",
      text: "Voilà ton plan",
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
      status: "read",
      attachment: {
        type: "nutri-plan",
        refId: "plan-50k",
        title: "Plan nutrition 50 km",
        subtitle: "90 g glucides/h · sels minéraux · alternance solide/liquide",
        href: "/coach",
      },
    },
    {
      id: "v4",
      conversationId: "c-casquette",
      authorId: "u-casquette",
      text: "Merci pour le plan nutri 🙏",
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
  ],
  "c-prep-maxirace": [
    {
      id: "p1",
      conversationId: "c-prep-maxirace",
      authorId: "u-sam",
      text: "Salut les bouzin, on attaque la prépa pour la MaXi-Race ?",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "p2",
      conversationId: "c-prep-maxirace",
      authorId: "me",
      text: "Yes, 86 km, 5600 D+ ça va piquer",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 600000).toISOString(),
      status: "read",
    },
    {
      id: "p3",
      conversationId: "c-prep-maxirace",
      authorId: "u-theo",
      text: "J'ai fini ma sortie de 50 km hier, 1800 D+",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "read",
    },
    {
      id: "p4",
      conversationId: "c-prep-maxirace",
      authorId: "u-theo",
      text: "Course visée",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60000).toISOString(),
      status: "read",
      attachment: {
        type: "race",
        refId: "maxirace-annecy-2026",
        title: "MaXi-Race Annecy",
        subtitle: "86 km · 5600 D+ · 30 mai 2026",
        href: "/race/maxirace-annecy-2026",
      },
    },
  ],
};

export function getConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find((c) => c.id === id);
}

export function getMessages(conversationId: string): Message[] {
  return MESSAGES_BY_CONV[conversationId] || [];
}

export function totalUnread(): number {
  return CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
}

/** Pour les DM : affiche le nom de l'autre participant (pas "Toi"). */
export function conversationDisplayName(conv: Conversation): string {
  if (conv.type === "group") return conv.name || "Groupe";
  const other = conv.members.find((m) => m.id !== ME_ID);
  return other?.displayName || "Inconnu";
}

export function conversationDisplayAvatar(conv: Conversation): string {
  if (conv.type === "group") return conv.avatar || "👥";
  const other = conv.members.find((m) => m.id !== ME_ID);
  return other?.avatar || "👤";
}

/** Formatte une date ISO en libellé compact pour la liste de conversations. */
export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "maintenant";
  if (diffMin < 60) return `${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} j`;
  return date.toLocaleDateString("fr", { day: "numeric", month: "short" });
}
