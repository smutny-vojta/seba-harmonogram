/**
 * Soubor: src/features/activities/consts.ts
 * Ucel: Konstanty feature "activities" pouzivane napric dalsimi vrstvami.
 * Parametry/Vstupy: Staticke mapy, seznamy a defaultni hodnoty.
 * Pozadavky: Bez vedlejsich efektu; pouze deklarativni data.
 */

export const ACTIVITY_CATEGORIES = {
  sport: {
    name: "Sport",
    color: "#22c55e",
  },
  kreativni: {
    name: "Kreativní",
    color: "#a855f7",
  },
  vedomosti: {
    name: "Vědomostní",
    color: "#3b82f6",
  },
  celotaborova: {
    name: "Celotáborová",
    color: "#ef4444",
  },
  vylet: {
    name: "Výlet",
    color: "#f97316",
  },
  vecerni: {
    name: "Večerní",
    color: "#1e1b4b",
  },
  stravovani: {
    name: "Stravování",
    color: "#f59e0b",
  },
  hygiena: {
    name: "Hygiena",
    color: "#06b6d4",
  },
  odpocinek: {
    name: "Odpočinek",
    color: "#64748b",
  },
  organizace: {
    name: "Organizace",
    color: "#71717a",
  },
  jine: {
    name: "Jiné",
    color: "#a1a1aa",
  },
} as const;

export const ACTIVITY_CATEGORIES_ARRAY = Object.keys(
  ACTIVITY_CATEGORIES,
) as (keyof typeof ACTIVITY_CATEGORIES)[];
