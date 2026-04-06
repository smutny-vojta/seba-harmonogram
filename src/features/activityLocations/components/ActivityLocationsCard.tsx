/**
 * Soubor: src/features/activityLocations/components/ActivityLocationsCard.tsx
 * Ucel: UI komponenta feature "activityLocations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ActivityLocationsDeleteDialog,
  ActivityLocationsEditDialog,
} from "@/features/activityLocations/components/ActivityLocationsDialogs";
import { LucideMountain, LucideUmbrellaOff } from "lucide-react";
import type { ActivityLocationItemType } from "../types";

export default function ActivityLocationsCard({
  location,
}: {
  location: ActivityLocationItemType;
}) {
  return (
    <Card
      className={`border-l-8 ${
        location.restrictedAccess ? "border-red-500" : "border-green-500"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{location.name}</CardTitle>
        <div className="flex gap-x-2">
          <ActivityLocationsEditDialog location={location} />
          <ActivityLocationsDeleteDialog
            id={location.id}
            name={location.name}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-x-4">
          {location.indoor && (
            <span className="flex items-center gap-x-2">
              <LucideUmbrellaOff size={16} className="text-blue-500" />
              <span>Kryté</span>
            </span>
          )}
          {location.offsite && (
            <span className="flex items-center gap-x-2">
              <LucideMountain size={16} className="text-amber-700" />
              <span>Mimo areál</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
