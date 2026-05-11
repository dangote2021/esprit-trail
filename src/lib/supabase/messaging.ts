"use client";

// ====== SUPABASE MESSAGING SERVICE ======
// Couche d'accès données pour la messagerie. Toutes les ops passent par cette
// couche, qui gère :
// - les requêtes Supabase (auth requis)
// - le fallback vers les mock data quand non-authentifié (preview/démo)
// - le retour normalisé au format Message / Conversation côté client
//
// Realtime : voir subscribeToMessages() pour s'abonner aux nouveaux msgs
// d'une conversation.

import type { Conversation, Message, MessageUser } from "@/lib/types";
import {
  CONVERSATIONS as MOCK_CONVERSATIONS,
  MESSAGES_BY_CONV as MOCK_MESSAGES,
  MESSAGE_USERS as MOCK_USERS,
  ME_ID as MOCK_ME_ID,
} from "@/lib/data/messages";
import { getSupabaseBrowserClient } from "./client";

// ============================================================================
// HELPERS
// ============================================================================

async function getUserId(): Promise<string | null> {
  try {
    const sb = getSupabaseBrowserClient();
    const { data } = await sb.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

/** Si Supabase n'est pas configuré ou l'user n'est pas connecté, on retombe
 *  sur les mock data côté client pour pas casser la démo. */
async function shouldUseMock(): Promise<boolean> {
  const uid = await getUserId();
  return uid === null;
}

// ============================================================================
// CONVERSATIONS
// ============================================================================

type SbConvRow = {
  id: string;
  type: "dm" | "group";
  name: string | null;
  avatar: string | null;
  description: string | null;
  created_by: string | null;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_author_id: string | null;
  created_at: string;
};

type SbMemberRow = {
  conversation_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  last_read_at: string;
  muted: boolean;
  profile: {
    id: string;
    username: string;
    display_name: string;
    avatar: string | null;
    xp: number;
  } | null;
};

function profileToMessageUser(p: SbMemberRow["profile"]): MessageUser {
  return {
    id: p?.id ?? "?",
    username: p?.username ?? "user",
    displayName: p?.display_name ?? p?.username ?? "Inconnu",
    avatar: p?.avatar ?? "🏃",
  };
}

export async function listConversations(): Promise<Conversation[]> {
  if (await shouldUseMock()) {
    return MOCK_CONVERSATIONS;
  }
  const sb = getSupabaseBrowserClient();
  const meId = (await getUserId())!;

  // Récupère toutes les convs où l'user est membre, avec membres + profils
  const { data: convs, error } = await sb
    .from("conversations")
    .select(
      `
      id, type, name, avatar, description, created_by,
      last_message_at, last_message_preview, last_message_author_id, created_at,
      members:conversation_members(
        conversation_id, user_id, role, joined_at, last_read_at, muted,
        profile:profiles(id, username, display_name, avatar, xp)
      )
      `,
    )
    .order("last_message_at", { ascending: false });

  if (error) {
    console.error("[messaging] listConversations", error);
    return [];
  }

  return (convs || []).map((c: any) => {
    const members: MessageUser[] = (c.members || []).map((m: SbMemberRow) =>
      profileToMessageUser(m.profile),
    );
    const myMember = (c.members || []).find(
      (m: SbMemberRow) => m.user_id === meId,
    );
    const lastReadAt = myMember?.last_read_at;

    // unread = count des messages plus récents que last_read_at et pas écrits par moi
    // Pour l'instant on déduit du preview (1 si dernier msg !== me ET plus récent que lastRead).
    // Le compteur précis est fourni par unread_count_for_user() côté nav.
    const lastIsFromOther =
      c.last_message_author_id && c.last_message_author_id !== meId;
    const isUnread =
      lastIsFromOther &&
      lastReadAt &&
      c.last_message_at &&
      new Date(c.last_message_at) > new Date(lastReadAt);

    return {
      id: c.id,
      type: c.type,
      name: c.name ?? undefined,
      avatar: c.avatar ?? undefined,
      description: c.description ?? undefined,
      members,
      lastMessage: c.last_message_preview
        ? {
            text: c.last_message_preview,
            authorId: c.last_message_author_id ?? "",
            createdAt: c.last_message_at ?? c.created_at,
          }
        : undefined,
      unreadCount: isUnread ? 1 : 0,
      updatedAt: c.last_message_at ?? c.created_at,
    } as Conversation;
  });
}

export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  if (await shouldUseMock()) {
    return MOCK_CONVERSATIONS.find((c) => c.id === id) ?? null;
  }
  const list = await listConversations();
  return list.find((c) => c.id === id) ?? null;
}

export async function getTotalUnread(): Promise<number> {
  if (await shouldUseMock()) {
    return MOCK_CONVERSATIONS.reduce((sum, c) => sum + c.unreadCount, 0);
  }
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.rpc("unread_count_for_user");
  if (error || data == null) return 0;
  return Number(data) || 0;
}

// ============================================================================
// MESSAGES
// ============================================================================

type SbMessageRow = {
  id: string;
  conversation_id: string;
  author_id: string;
  text: string;
  attachment: Message["attachment"] | null;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
};

function rowToMessage(r: SbMessageRow): Message {
  return {
    id: r.id,
    conversationId: r.conversation_id,
    authorId: r.author_id,
    text: r.text,
    attachment: r.attachment ?? undefined,
    createdAt: r.created_at,
    status: "delivered",
  };
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  if (await shouldUseMock()) {
    return MOCK_MESSAGES[conversationId] || [];
  }
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(500);

  if (error) {
    console.error("[messaging] listMessages", error);
    return [];
  }
  return (data || []).map(rowToMessage);
}

export async function sendMessage(
  conversationId: string,
  text: string,
  attachment?: Message["attachment"],
): Promise<Message | null> {
  const uid = await getUserId();
  if (!uid) {
    // Mode preview : on simule l'envoi en mémoire seulement
    return {
      id: `local-${Date.now()}`,
      conversationId,
      authorId: MOCK_ME_ID,
      text,
      attachment,
      createdAt: new Date().toISOString(),
      status: "delivered",
    };
  }
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb
    .from("messages")
    .insert({
      conversation_id: conversationId,
      author_id: uid,
      text,
      attachment: attachment ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[messaging] sendMessage", error);
    return null;
  }
  return rowToMessage(data as SbMessageRow);
}

export async function markRead(conversationId: string): Promise<void> {
  const uid = await getUserId();
  if (!uid) return;
  const sb = getSupabaseBrowserClient();
  await sb
    .from("conversation_members")
    .update({ last_read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .eq("user_id", uid);
}

// ============================================================================
// REALTIME — subscription aux nouveaux messages d'une conversation
// ============================================================================

export type Unsubscribe = () => void;

export function subscribeToMessages(
  conversationId: string,
  onMessage: (m: Message) => void,
): Unsubscribe {
  let unsubscribed = false;
  let cleanup: (() => void) | null = null;

  (async () => {
    if (await shouldUseMock()) return;
    if (unsubscribed) return;
    const sb = getSupabaseBrowserClient();
    const channel = sb
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          onMessage(rowToMessage(payload.new as SbMessageRow));
        },
      )
      .subscribe();
    cleanup = () => {
      sb.removeChannel(channel);
    };
    if (unsubscribed) cleanup();
  })();

  return () => {
    unsubscribed = true;
    if (cleanup) cleanup();
  };
}

// ============================================================================
// CREATE CONVERSATION (DM ou groupe) via RPC
// ============================================================================

export async function createConversation(params: {
  type: "dm" | "group";
  name?: string;
  avatar?: string;
  description?: string;
  memberIds: string[];
}): Promise<string | null> {
  const uid = await getUserId();
  if (!uid) return null;
  const sb = getSupabaseBrowserClient();
  const { data, error } = await sb.rpc("create_conversation", {
    p_type: params.type,
    p_name: params.name ?? null,
    p_avatar: params.avatar ?? null,
    p_description: params.description ?? null,
    p_member_ids: params.memberIds,
  });
  if (error) {
    console.error("[messaging] createConversation", error);
    return null;
  }
  return data as string;
}

// Re-export mock helpers pour compatibilité
export { MOCK_USERS as MESSAGE_USERS_MOCK, MOCK_ME_ID };
