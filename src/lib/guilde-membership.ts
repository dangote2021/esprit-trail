// ====== Guilde membership store (localStorage) ======
// Partagé entre GuildeActions et GuildeMemberCount (custom events).

export type GuildeMembership = Record<string, "member" | "pending">;

const KEY = "esprit_guilde_membership";

export function getStoredMembership(): GuildeMembership {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export function setStoredMembership(m: GuildeMembership) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

export function dispatchMembershipChange(
  guildeId: string,
  action: "member" | "pending" | "left",
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("esprit:guilde:joined", {
      detail: { guildeId, action },
    }),
  );
}
