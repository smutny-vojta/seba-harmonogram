export const CAMP_CATEGORIES = {
  "cyber-camp": {
    name: "Cyber camp",
    shortCodeBase: "CC",
  },
  fortnite: {
    name: "Fortnite",
    shortCodeBase: "FN",
  },
  minecraft: {
    name: "Minecraft",
    shortCodeBase: "MC",
  },
  "sportovni-tabor": {
    name: "Sportovní tábor",
    shortCodeBase: "ST",
  },
} as const;

export const CAMP_CATEGORIES_ARRAY = Object.keys(CAMP_CATEGORIES) as [
  keyof typeof CAMP_CATEGORIES,
  ...(keyof typeof CAMP_CATEGORIES)[],
];

// Cron by mel bezet v pasmu Europe/Prague denne v 10:30:01.
export const GROUPS_ARCHIVE_CRON_EXPRESSION = "1 30 10 * * *";
