/**
 * Soubor: src/features/auth/types.ts
 * Ucel: Definuje TypeScript typy odvozene ze schema vrstvy.
 * Parametry/Vstupy: Pouziva z.infer nad exporty ze schema.ts.
 * Pozadavky: Bez runtime logiky; pouze type aliasy a type-only importy.
 */

import type { AccountState } from "./config";
import type { ROLES } from "./roles";

export type Role = (typeof ROLES)[number];
export type { AccountState };
