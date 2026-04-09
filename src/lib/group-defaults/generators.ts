import { CAMP_CATEGORIES } from "@/lib/camp-categories";
import type { CampCategory } from "@/lib/camp-categories";

export function createGeneratedGroupSlug(
  campCategory: CampCategory,
  index: number,
) {
  if (index <= 1) {
    return campCategory;
  }

  return `${campCategory}-${index}`;
}

export function createGeneratedGroupName(
  campCategory: CampCategory,
  index: number,
) {
  const baseName = CAMP_CATEGORIES[campCategory].name;

  if (index <= 1) {
    return baseName;
  }

  return `${baseName} ${index}`;
}

export function createGeneratedGroupShortCode(
  campCategory: CampCategory,
  index: number,
) {
  const baseShortCode = CAMP_CATEGORIES[campCategory].shortCodeBase;

  if (index <= 1) {
    return baseShortCode;
  }

  return `${baseShortCode}-${index}`;
}
