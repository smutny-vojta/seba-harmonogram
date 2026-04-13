import { useMemo, useState } from "react";
import { ACTIVITY_CATEGORIES } from "@/features/activities/config";
import type { ActivityItemType } from "@/features/activities/types";

type LocationOption = {
  id: string;
  name: string;
};

export type ActivitiesFilterOption = {
  value: string;
  label: string;
};

export function useActivitiesListFilters({
  activities,
  locations,
  locationsById,
}: {
  activities: ActivityItemType[];
  locations: LocationOption[];
  locationsById: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [materialFilters, setMaterialFilters] = useState<string[]>([]);

  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const searchValue = search.trim().toLocaleLowerCase("cs-CZ");
        const locationName = locationsById[activity.locationId] ?? "";
        const materialText = activity.defaultMaterials
          .map((material) => `${material.amount} ${material.name}`)
          .join(" ");

        const searchSource = [
          activity.title,
          activity.description ?? "",
          ACTIVITY_CATEGORIES[activity.category].name,
          locationName,
          materialText,
        ]
          .join(" ")
          .toLocaleLowerCase("cs-CZ");

        const matchesSearch =
          searchValue.length === 0 || searchSource.includes(searchValue);

        const matchesCategory =
          categoryFilter === "all" || activity.category === categoryFilter;

        const matchesLocation =
          locationFilter === "all" || activity.locationId === locationFilter;

        const materialNames = activity.defaultMaterials.map(
          (material) => material.name,
        );
        const matchesMaterials =
          materialFilters.length === 0 ||
          materialFilters.some((material) => materialNames.includes(material));

        return (
          matchesSearch &&
          matchesCategory &&
          matchesLocation &&
          matchesMaterials
        );
      }),
    [
      activities,
      categoryFilter,
      locationFilter,
      locationsById,
      materialFilters,
      search,
    ],
  );

  const categoryOptions = useMemo(
    () =>
      Object.entries(ACTIVITY_CATEGORIES).map(([value, category]) => ({
        value,
        label: category.name,
      })),
    [],
  );

  const locationOptions = useMemo(
    () =>
      locations.map((location) => ({
        value: location.id,
        label: location.name,
      })),
    [locations],
  );

  const materialOptions = useMemo(() => {
    const uniqueMaterialNames = new Set<string>();

    for (const activity of activities) {
      for (const material of activity.defaultMaterials) {
        uniqueMaterialNames.add(material.name);
      }
    }

    return [...uniqueMaterialNames]
      .sort((a, b) => a.localeCompare(b, "cs-CZ"))
      .map((materialName) => ({
        value: materialName,
        label: materialName,
      }));
  }, [activities]);

  const toggleMaterialFilter = (value: string) => {
    setMaterialFilters((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  };

  return {
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    locationFilter,
    setLocationFilter,
    materialFilters,
    setMaterialFilters,
    filteredActivities,
    categoryOptions,
    locationOptions,
    materialOptions,
    toggleMaterialFilter,
  };
}
