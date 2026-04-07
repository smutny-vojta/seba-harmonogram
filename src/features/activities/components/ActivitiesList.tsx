"use client";

import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "@features/activities/components/ActivitiesDialogs";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { LucideChevronDown, LucideMapPin, LucideShapes } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ACTIVITY_CATEGORIES } from "@/features/activities/consts";
import type { ActivityItemType } from "@/features/activities/types";

type ActivityLocationOption = {
  id: string;
  name: string;
};

type HeaderFilterOption = {
  value: string;
  label: string;
};

function FilterableSingleHeaderMenu({
  column,
  title,
  options,
}: {
  column: Column<ActivityItemType, unknown>;
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
      <DropdownMenuContent align="start" className="w-56">
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

function FilterableMultiHeaderMenu({
  column,
  title,
  options,
}: {
  column: Column<ActivityItemType, unknown>;
  title: string;
  options: HeaderFilterOption[];
}) {
  const selectedValues =
    (column.getFilterValue() as string[] | undefined) ?? [];

  const toggleValue = (value: string) => {
    const alreadySelected = selectedValues.includes(value);
    const nextValues = alreadySelected
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    column.setFilterValue(nextValues.length > 0 ? nextValues : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1 px-1.5">
          <span>{title}</span>
          <LucideChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Filtr (více hodnot)</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={selectedValues.length === 0}
          onCheckedChange={() => column.setFilterValue(undefined)}
        >
          Všechny
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => toggleValue(option.value)}
          >
            {option.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

        return matchesSearch;
      }),
    [activities, locationsById, search],
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

  const columns: Array<ColumnDef<ActivityItemType>> = [
    {
      accessorKey: "title",
      header: "Název",
      cell: ({ row }) => <p className="font-semibold">{row.original.title}</p>,
    },
    {
      accessorKey: "category",
      id: "category",
      enableSorting: false,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) {
          return true;
        }

        return row.getValue<string>(columnId) === filterValue;
      },
      meta: { disableAutoSortTrigger: true },
      header: ({ column }) => (
        <FilterableSingleHeaderMenu
          column={column}
          title="Kategorie"
          options={categoryOptions}
        />
      ),
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
      accessorKey: "locationId",
      id: "locationId",
      enableSorting: false,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) {
          return true;
        }

        return row.getValue<string>(columnId) === filterValue;
      },
      meta: { disableAutoSortTrigger: true },
      header: ({ column }) => (
        <FilterableSingleHeaderMenu
          column={column}
          title="Lokace"
          options={locationOptions}
        />
      ),
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
      id: "materials",
      accessorFn: (activity) =>
        activity.defaultMaterials.map((material) => material.name),
      enableSorting: false,
      filterFn: (row, _columnId, filterValue) => {
        const selectedMaterials = (filterValue as string[] | undefined) ?? [];

        if (selectedMaterials.length === 0) {
          return true;
        }

        const rowMaterialNames = row.original.defaultMaterials.map(
          (material) => material.name,
        );

        return selectedMaterials.some((selectedMaterial) =>
          rowMaterialNames.includes(selectedMaterial),
        );
      },
      meta: { disableAutoSortTrigger: true },
      header: ({ column }) => (
        <FilterableMultiHeaderMenu
          column={column}
          title="Materiál"
          options={materialOptions}
        />
      ),
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
        <div className="flex items-center gap-2 text-sm">
          <span>Hledat:</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Název, popis, kategorie, lokace..."
            className="w-72"
          />
        </div>
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
