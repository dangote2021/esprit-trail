import type { Metadata } from "next";
import UserPublicProfile from "./UserPublicProfile";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  return {
    title: `@${params.username} · Profil`,
    description: `Profil public de @${params.username} sur Esprit Trail`,
  };
}

export default function UserPublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  return <UserPublicProfile username={params.username} />;
}
