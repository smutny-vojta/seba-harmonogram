"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import { LucideChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  ActivityLocationsDeleteDialog,
  ActivityLocationsEditDialog,
} from "@/features/activityLocations/components/ActivityLocationsDialogs";
import type { ActivityLocationItemType } from "../types";

type HeaderFilterOption = {
  value: string;
  label: string;
};

function FilterableHeaderMenu({
  column,
  title,
  options,
}: {
  column: Column<ActivityLocationItemType, unknown>;
  title: string;
  options: HeaderFilterOption[];
}) {
  const filterValue = (column.getFilterValue() as string | undefined) ?? "all";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-1.5">
          <span>{title}</span>
          <LucideChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Filtr</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={filterValue}
          onValueChange={(value) =>
            column.setFilterValue(value === "all" ? undefined : value)
          }
        >
          <DropdownMenuRadioItem value="all">Všechny</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: Array<ColumnDef<ActivityLocationItemType>> = [
  {
    accessorKey: "name",
    header: "Název",
    cell: ({ row }) => <p className="font-semibold">{row.original.name}</p>,
  },
  {
    accessorKey: "restrictedAccess",
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }

      const value = row.getValue<boolean>(columnId);
      if (filterValue === "public") {
        return !value;
      }
      if (filterValue === "restricted") {
        return value;
      }

      return true;
    },
    meta: { disableAutoSortTrigger: true },
    header: ({ column }) => (
      <FilterableHeaderMenu
        column={column}
        title="Přístup"
        options={[
          { value: "public", label: "Přístup pro všechny" },
          { value: "restricted", label: "Pouze pro robinsony" },
        ]}
      />
    ),
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
    accessorKey: "offsite",
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }

      const value = row.getValue<boolean>(columnId);
      if (filterValue === "yes") {
        return value;
      }
      if (filterValue === "no") {
        return !value;
      }

      return true;
    },
    meta: { disableAutoSortTrigger: true },
    header: ({ column }) => (
      <FilterableHeaderMenu
        column={column}
        title="Mimo areál"
        options={[
          { value: "yes", label: "Ano" },
          { value: "no", label: "Ne" },
        ]}
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-x-2">
          {row.original.offsite ? (
            <>
              <span>Ano</span>
            </>
          ) : (
            <span className="text-muted-foreground">Ne</span>
          )}
        </span>
      );
    },
  },
  {
    accessorKey: "indoor",
    enableSorting: false,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue) {
        return true;
      }

      const value = row.getValue<boolean>(columnId);
      if (filterValue === "yes") {
        return value;
      }
      if (filterValue === "no") {
        return !value;
      }

      return true;
    },
    meta: { disableAutoSortTrigger: true },
    header: ({ column }) => (
      <FilterableHeaderMenu
        column={column}
        title="Je krytá"
        options={[
          { value: "yes", label: "Ano" },
          { value: "no", label: "Ne" },
        ]}
      />
    ),
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-x-2">
          {row.original.indoor ? (
            <>
              <span>Ano</span>
            </>
          ) : (
            <span className="text-muted-foreground">Ne</span>
          )}
        </span>
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

        return matchesSearch;
      }),
    [locations, search],
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
