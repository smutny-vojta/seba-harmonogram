"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LucideMountain, LucideUmbrellaOff } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  ActivityLocationsDeleteDialog,
  ActivityLocationsEditDialog,
} from "@/features/activityLocations/components/ActivityLocationsDialogs";
import type { ActivityLocationItemType } from "../types";

type PropertiesFilter = "all" | "none" | "indoor" | "offsite" | "both";
type AccessFilter = "all" | "public" | "restricted";

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
  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [propertiesFilter, setPropertiesFilter] =
    useState<PropertiesFilter>("all");

  const filteredLocations = useMemo(
    () =>
      locations.filter((location) => {
        const searchValue = search.trim().toLocaleLowerCase("cs-CZ");
        const searchSource = [
          location.name,
          location.restrictedAccess
            ? "přístup pouze pro robinsony"
            : "přístup pro všechny",
          location.indoor ? "kryté vnitřní" : "",
          location.offsite ? "mimo areál" : "",
        ]
          .join(" ")
          .toLocaleLowerCase("cs-CZ");

        const matchesSearch =
          searchValue.length === 0 || searchSource.includes(searchValue);

        const matchesProperties =
          propertiesFilter === "all" ||
          (propertiesFilter === "none" &&
            !location.indoor &&
            !location.offsite) ||
          (propertiesFilter === "indoor" &&
            location.indoor &&
            !location.offsite) ||
          (propertiesFilter === "offsite" &&
            !location.indoor &&
            location.offsite) ||
          (propertiesFilter === "both" && location.indoor && location.offsite);

        const matchesAccess =
          accessFilter === "all" ||
          (accessFilter === "public" && !location.restrictedAccess) ||
          (accessFilter === "restricted" && location.restrictedAccess);

        return matchesSearch && matchesProperties && matchesAccess;
      }),
    [accessFilter, locations, propertiesFilter, search],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span>Hledat:</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Název, přístup, vlastnosti..."
            className="w-72"
          />
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Přístup:</span>
          <select
            value={accessFilter}
            onChange={(event) =>
              setAccessFilter(event.target.value as AccessFilter)
            }
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3"
          >
            <option value="all">Všechny</option>
            <option value="public">Přístup pro všechny</option>
            <option value="restricted">Pouze pro robinsony</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Vlastnosti:</span>
          <select
            value={propertiesFilter}
            onChange={(event) =>
              setPropertiesFilter(event.target.value as PropertiesFilter)
            }
            className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-3"
          >
            <option value="all">Všechny</option>
            <option value="none">Bez vlastností</option>
            <option value="indoor">Pouze kryté</option>
            <option value="offsite">Pouze mimo areál</option>
            <option value="both">Kryté i mimo areál</option>
          </select>
        </div>
      </div>

      <DataTable
        className="bg-card"
        columns={columns}
        data={filteredLocations}
        emptyMessage="Nejsou zde žádné lokality."
        defaultSorting={[{ id: "name", desc: false }]}
        singleColumnSort
      />
    </div>
  );
}
