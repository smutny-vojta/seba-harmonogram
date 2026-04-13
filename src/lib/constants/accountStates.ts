export const ACCOUNT_STATES = ["pending", "active", "blocked"] as const;

export type AccountState = (typeof ACCOUNT_STATES)[number];

export const ACCOUNT_STATE_LABELS: Record<AccountState, string> = {
  pending: "Čeká na aktivaci",
  active: "Aktivní",
  blocked: "Blokovaný",
};
