/**
 * Soubor: src/features/activityLocations/components/ActivityLocationsMenu.tsx
 * Ucel: UI komponenta feature "activityLocations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

"use client";

import { LucideLayoutGrid, LucideList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityLocationsAddDialog } from "@/features/activityLocations/components/ActivityLocationsDialogs";

export type ActivityLocationsViewMode = "grid" | "list";

export default function ActivityLocationsMenu({
  viewMode,
  onViewModeChange,
}: {
  viewMode: ActivityLocationsViewMode;
  onViewModeChange: (viewMode: ActivityLocationsViewMode) => void;
}) {
  return (
    <div className="flex h-fit shrink-0 flex-wrap items-center justify-between gap-3">
      <ActivityLocationsAddDialog />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => onViewModeChange("grid")}
          aria-pressed={viewMode === "grid"}
        >
          <LucideLayoutGrid size={16} />
          Mřížka
        </Button>
        <Button
          size="sm"
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => onViewModeChange("list")}
          aria-pressed={viewMode === "list"}
        >
          <LucideList size={16} />
          Seznam
        </Button>
      </div>
    </div>
  );
}
