"use client";

import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "@features/activities/components/ActivitiesDialogs";
import type { ColumnDef } from "@tanstack/react-table";
import { LucideMapPin, LucideShapes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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
    <div className="min-h-0 flex-1 overflow-y-auto">
      <DataTable
        className="bg-card"
        columns={columns}
        data={activities}
        emptyMessage="Nejsou zde žádné aktivity."
        defaultSorting={[{ id: "title", desc: false }]}
        singleColumnSort
      />
    </div>
  );
}
