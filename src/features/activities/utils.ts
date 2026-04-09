import { ACTIVITY_CATEGORIES_ARRAY } from "@/features/activities/config";
import type {
  ActivityItemType,
  ActivityMaterialType,
  ActivityType,
  NewActivityType,
} from "@/features/activities/types";
import { mapMongoIdToId } from "@/utils/mongo";

export type MaterialRow = {
  id: number;
  defaultAmount?: string;
  defaultName?: string;
};

export function buildMaterialRows(
  defaultMaterials?: ActivityMaterialType[],
): MaterialRow[] {
  if (!defaultMaterials || defaultMaterials.length === 0) {
    return [{ id: 0 }];
  }

  return defaultMaterials.map((material, index) => ({
    id: index,
    defaultAmount: material.amount,
    defaultName: material.name,
  }));
}

export function parseMaterials(formData: FormData): ActivityMaterialType[] {
  const amounts = formData
    .getAll("materialAmount")
    .map((value) => String(value).trim());
  const names = formData
    .getAll("materialName")
    .map((value) => String(value).trim());

  return names
    .map((name, index) => {
      const amount = amounts[index] ?? "";

      if (!name || !amount) {
        return null;
      }

      return {
        name,
        amount,
      } satisfies ActivityMaterialType;
    })
    .filter((item): item is ActivityMaterialType => item !== null);
}

export function parseActivityFormData(formData: FormData): NewActivityType {
  const description = String(formData.get("description") ?? "").trim();
  const category = String(
    formData.get("category") ?? "jine",
  ) as NewActivityType["category"];

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: description.length > 0 ? description : undefined,
    locationId: String(formData.get("locationId") ?? ""),
    category,
    defaultMaterials: parseMaterials(formData),
  } satisfies NewActivityType;
}

export function mapActivityToItem(activity: ActivityType): ActivityItemType {
  const { location, ...rest } = mapMongoIdToId(activity);

  return {
    ...rest,
    locationId: location.toString(),
  };
}

export function ensureActivitiesSeedPreconditions(locationIds: string[]) {
  if (locationIds.length === 0) {
    throw new Error("Nelze seedovat aktivity bez lokací.");
  }

  if (ACTIVITY_CATEGORIES_ARRAY.length === 0) {
    throw new Error("Nelze seedovat aktivity bez kategorií.");
  }
}
