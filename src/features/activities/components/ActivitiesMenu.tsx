/**
 * Soubor: src/features/activities/components/ActivitiesMenu.tsx
 * Ucel: UI komponenta feature "activities".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

"use client";

import { ActivitiesAddDialog } from "@features/activities/components/ActivitiesDialogs";
import { LucideLayoutGrid, LucideList } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ActivitiesViewMode = "grid" | "list";

export default function ActivitiesMenu({
  locations,
  viewMode,
  onViewModeChange,
}: {
  locations: Array<{ id: string; name: string }>;
  viewMode: ActivitiesViewMode;
  onViewModeChange: (viewMode: ActivitiesViewMode) => void;
}) {
  return (
    <div className="flex h-fit shrink-0 flex-wrap items-center justify-between gap-3">
      <ActivitiesAddDialog locations={locations} />
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
