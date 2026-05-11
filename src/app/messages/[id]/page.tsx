import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  CONVERSATIONS,
  conversationDisplayAvatar,
  conversationDisplayName,
  getConversation,
  getMessages,
} from "@/lib/data/messages";
import ConversationThread from "@/components/messages/ConversationThread";

export async function generateStaticParams() {
  return CONVERSATIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const conv = getConversation(params.id);
  if (!conv) return { title: "Conversation" };
  return {
    title: `${conversationDisplayName(conv)} · Messages`,
  };
}

export default function ConversationPage({
  params,
}: {
  params: { id: string };
}) {
  const conv = getConversation(params.id);
  if (!conv) notFound();

  const messages = getMessages(conv.id);
  const name = conversationDisplayName(conv);
  const avatar = conversationDisplayAvatar(conv);

  return (
    <ConversationThread
      conversationId={conv.id}
      conversationName={name}
      conversationAvatar={avatar}
      type={conv.type}
      memberCount={conv.members.length}
      description={conv.description}
      initialMessages={messages}
    />
  );
}
