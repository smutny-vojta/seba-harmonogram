"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { LucideCheck, LucideChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

type AccessFilter = "all" | "public" | "restricted";
type BooleanFilter = "all" | "yes" | "no";

function FilterableHeaderMenu({
  title,
  value,
  options,
  onValueChange,
}: {
  title: string;
  value: string;
  options: HeaderFilterOption[];
  onValueChange: (value: string) => void;
}) {
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
        <DropdownMenuItem onClick={() => onValueChange("all")}>
          <span>Všechny</span>
          {value === "all" ? (
            <LucideCheck size={14} className="ml-auto" />
          ) : null}
        </DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onValueChange(option.value)}
          >
            <span>{option.label}</span>
            {value === option.value ? (
              <LucideCheck size={14} className="ml-auto" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ActivityLocationsList({
  locations,
}: {
  locations: ActivityLocationItemType[];
}) {
  const [search, setSearch] = useState("");
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("all");
  const [offsiteFilter, setOffsiteFilter] = useState<BooleanFilter>("all");
  const [indoorFilter, setIndoorFilter] = useState<BooleanFilter>("all");

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

        const matchesAccess =
          accessFilter === "all" ||
          (accessFilter === "public" && !location.restrictedAccess) ||
          (accessFilter === "restricted" && location.restrictedAccess);

        const matchesOffsite =
          offsiteFilter === "all" ||
          (offsiteFilter === "yes" && location.offsite) ||
          (offsiteFilter === "no" && !location.offsite);

        const matchesIndoor =
          indoorFilter === "all" ||
          (indoorFilter === "yes" && location.indoor) ||
          (indoorFilter === "no" && !location.indoor);

        return (
          matchesSearch && matchesAccess && matchesOffsite && matchesIndoor
        );
      }),
    [accessFilter, indoorFilter, locations, offsiteFilter, search],
  );

  const columns: Array<ColumnDef<ActivityLocationItemType>> = [
    {
      accessorKey: "name",
      header: "Název",
      cell: ({ row }) => <p className="font-semibold">{row.original.name}</p>,
    },
    {
      accessorKey: "restrictedAccess",
      enableSorting: false,
      header: () => (
        <FilterableHeaderMenu
          title="Přístup"
          value={accessFilter}
          onValueChange={(value) => setAccessFilter(value as AccessFilter)}
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
      header: () => (
        <FilterableHeaderMenu
          title="Mimo areál"
          value={offsiteFilter}
          onValueChange={(value) => setOffsiteFilter(value as BooleanFilter)}
          options={[
            { value: "yes", label: "Ano" },
            { value: "no", label: "Ne" },
          ]}
        />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-x-2">
          {row.original.offsite ? (
            <span>Ano</span>
          ) : (
            <span className="text-muted-foreground">Ne</span>
          )}
        </span>
      ),
    },
    {
      accessorKey: "indoor",
      enableSorting: false,
      header: () => (
        <FilterableHeaderMenu
          title="Je krytá"
          value={indoorFilter}
          onValueChange={(value) => setIndoorFilter(value as BooleanFilter)}
          options={[
            { value: "yes", label: "Ano" },
            { value: "no", label: "Ne" },
          ]}
        />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-x-2">
          {row.original.indoor ? (
            <span>Ano</span>
          ) : (
            <span className="text-muted-foreground">Ne</span>
          )}
        </span>
      ),
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
