export const CAMP_CATEGORIES = {
  cyber: {
    name: "Cyber camp",
    shortCode: "CC",
    kind: "camp",
  },
  fortnite: {
    name: "Fortnite",
    shortCode: "FN",
    kind: "camp",
  },
  minecraft: {
    name: "Minecraft",
    shortCode: "MC",
    kind: "camp",
  },
  sport: {
    name: "Sportovní tábor",
    shortCode: "ST",
    kind: "camp",
  },
  kancl: {
    name: "Kancl",
    shortCode: "KC",
    kind: "office",
  },
} as const;

export const CAMP_CATEGORY_KINDS = ["camp", "office"] as const;

export const CAMP_CATEGORIES_ARRAY = Object.keys(CAMP_CATEGORIES) as [
  keyof typeof CAMP_CATEGORIES,
  ...(keyof typeof CAMP_CATEGORIES)[],
];

export const OFFICE_CAMP_CATEGORY = "kancl" as const;

export function isOfficeCampCategory(
  campCategory: keyof typeof CAMP_CATEGORIES,
): boolean {
  return CAMP_CATEGORIES[campCategory].kind === "office";
}
