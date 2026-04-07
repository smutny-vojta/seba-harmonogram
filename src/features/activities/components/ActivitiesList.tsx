"use client";

import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "@features/activities/components/ActivitiesDialogs";
import type { ColumnDef } from "@tanstack/react-table";
import { LucideMapPin, LucideShapes } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ACTIVITY_CATEGORIES } from "@/features/activities/consts";
import type { ActivityItemType } from "@/features/activities/types";

type ActivityLocationOption = {
  id: string;
  name: string;
};

export default function ActivitiesList({
  activities,
  locations,
  locationsById,
}: {
  activities: ActivityItemType[];
  locations: ActivityLocationOption[];
  locationsById: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

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

        return matchesSearch && matchesCategory && matchesLocation;
      }),
    [activities, categoryFilter, locationFilter, locationsById, search],
  );

  const columns: Array<ColumnDef<ActivityItemType>> = [
    {
      accessorKey: "title",
      header: "Název",
      cell: ({ row }) => <p className="font-semibold">{row.original.title}</p>,
    },
    {
      accessorFn: (activity) => ACTIVITY_CATEGORIES[activity.category].name,
      id: "category",
      header: "Kategorie",
      cell: ({ row }) => (
        <Badge
          style={{
            backgroundColor: ACTIVITY_CATEGORIES[row.original.category].color,
          }}
          className="text-white"
        >
          {ACTIVITY_CATEGORIES[row.original.category].name}
        </Badge>
      ),
    },
    {
      accessorFn: (activity) => locationsById[activity.locationId] ?? "",
      id: "location",
      header: "Lokace",
      cell: ({ row }) => (
        <span className="text-muted-foreground flex items-center gap-x-2">
          <LucideMapPin size={16} />
          <span>
            {locationsById[row.original.locationId] ?? "Neznámá lokace"}
          </span>
        </span>
      ),
    },
    {
      accessorFn: (activity) => activity.defaultMaterials.length,
      id: "materials",
      header: "Materiál",
      cell: ({ row }) =>
        row.original.defaultMaterials.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <LucideShapes size={16} className="text-muted-foreground" />
            {row.original.defaultMaterials.map((material) => (
              <Badge
                key={`${material.amount}-${material.name}`}
                variant="secondary"
              >
                {material.amount} {material.name}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">Bez materiálu</span>
        ),
    },
    {
      id: "actions",
      enableSorting: false,
      header: () => <div className="text-right">Akce</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-x-2">
          <ActivitiesEditDialog activity={row.original} locations={locations} />
          <ActivitiesDeleteDialog
            id={row.original.id}
            title={row.original.title}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <span>Hledat:</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Název, popis, kategorie, lokace..."
            className="w-72"
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span>Kategorie:</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3"
          >
            <option value="all">Všechny</option>
            {Object.entries(ACTIVITY_CATEGORIES).map(([key, category]) => (
              <option key={key} value={key}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <span>Lokace:</span>
          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3"
          >
            <option value="all">Všechny</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <DataTable
        className="bg-card"
        columns={columns}
        data={filteredActivities}
        emptyMessage="Nejsou zde žádné aktivity."
        defaultSorting={[{ id: "title", desc: false }]}
        singleColumnSort
      />
    </div>
  );
}
