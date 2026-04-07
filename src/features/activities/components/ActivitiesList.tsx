"use client";

import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "@features/activities/components/ActivitiesDialogs";
import type { ColumnDef } from "@tanstack/react-table";
import {
  LucideCheck,
  LucideChevronDown,
  LucideMapPin,
  LucideShapes,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
      <DropdownMenuContent align="start" className="w-56">
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

function FilterableMultiHeaderMenu({
  title,
  options,
  selectedValues,
  onToggleValue,
  onClear,
}: {
  title: string;
  options: HeaderFilterOption[];
  selectedValues: string[];
  onToggleValue: (value: string) => void;
  onClear: () => void;
}) {
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
          onCheckedChange={onClear}
        >
          Všechny
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.value}
            checked={selectedValues.includes(option.value)}
            onCheckedChange={() => onToggleValue(option.value)}
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

  const toggleMaterialFilter = (value: string) => {
    setMaterialFilters((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  };

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
      header: () => (
        <FilterableSingleHeaderMenu
          title="Kategorie"
          value={categoryFilter}
          onValueChange={setCategoryFilter}
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
      header: () => (
        <FilterableSingleHeaderMenu
          title="Lokace"
          value={locationFilter}
          onValueChange={setLocationFilter}
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
      header: () => (
        <FilterableMultiHeaderMenu
          title="Materiál"
          options={materialOptions}
          selectedValues={materialFilters}
          onToggleValue={toggleMaterialFilter}
          onClear={() => setMaterialFilters([])}
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
