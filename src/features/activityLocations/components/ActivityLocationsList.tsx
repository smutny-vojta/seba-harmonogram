"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LucideMountain, LucideUmbrellaOff } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  ActivityLocationsDeleteDialog,
  ActivityLocationsEditDialog,
} from "@/features/activityLocations/components/ActivityLocationsDialogs";
import type { ActivityLocationItemType } from "../types";

const columns: Array<ColumnDef<ActivityLocationItemType>> = [
  {
    accessorKey: "name",
    header: "Název",
    cell: ({ row }) => <p className="font-semibold">{row.original.name}</p>,
  },
  {
    accessorKey: "restrictedAccess",
    header: "Přístup",
    cell: ({ row }) =>
      row.original.restrictedAccess ? (
        <span className="flex items-center gap-x-2">
          <span className="text-red-300">Přístup pouze pro robinsony</span>
        </span>
      ) : (
        <span className="flex items-center gap-x-2">
          <span className="text-green-300">Přístup pro všechny</span>
        </span>
      ),
  },

  {
    accessorFn: ({ indoor, offsite }) => {
      if (indoor && offsite) {
        return 3;
      }
      if (indoor) {
        return 2;
      }
      if (offsite) {
        return 1;
      }
      return 0;
    },
    id: "properties",
    header: "Vlastnosti",
    cell: ({ row }) => {
      const { indoor, offsite } = row.original;

      if (!indoor && !offsite) {
        return <span className="text-muted-foreground">Bez vlastností</span>;
      }

      return (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {indoor && (
            <span className="flex items-center gap-x-2">
              <LucideUmbrellaOff size={16} className="text-blue-500" />
              <span>Kryté</span>
            </span>
          )}
          {offsite && (
            <span className="flex items-center gap-x-2">
              <LucideMountain size={16} className="text-amber-700" />
              <span>Mimo areál</span>
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableSorting: false,
    header: () => <div className="text-right">Akce</div>,
    cell: ({ row }) => (
      <div className="flex justify-end gap-x-2">
        <ActivityLocationsEditDialog location={row.original} />
        <ActivityLocationsDeleteDialog
          id={row.original.id}
          name={row.original.name}
        />
      </div>
    ),
  },
];

export default function ActivityLocationsList({
  locations,
}: {
  locations: ActivityLocationItemType[];
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <DataTable
        className="bg-card"
        columns={columns}
        data={locations}
        emptyMessage="Nejsou zde žádné lokality."
        defaultSorting={[{ id: "name", desc: false }]}
        singleColumnSort
      />
    </div>
  );
}
