import { CAMP_CATEGORIES } from "./config";
import type { GroupType } from "./types";

export function createGeneratedGroupSlug(
  campCategory: GroupType["campCategory"],
  index: number,
): string {
  if (index <= 1) {
    return campCategory;
  }

  return `${campCategory}-${index}`;
}

export function createGeneratedGroupName(
  campCategory: GroupType["campCategory"],
  index: number,
): string {
  const baseName = CAMP_CATEGORIES[campCategory].name;

  if (index <= 1) {
    return baseName;
  }

  return `${baseName} ${index}`;
}

export function createGeneratedGroupShortCode(
  campCategory: GroupType["campCategory"],
  index: number,
): string {
  const baseShortCode = CAMP_CATEGORIES[campCategory].shortCode;

  if (index <= 1) {
    return baseShortCode;
  }

  return `${baseShortCode}-${index}`;
}
