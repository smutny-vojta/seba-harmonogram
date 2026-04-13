/**
 * Soubor: src/features/locations/components/LocationsCard.tsx
 * Ucel: UI komponenta feature "locations".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import { LucideMountain, LucideUmbrellaOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LocationsDeleteDialog,
  LocationsEditDialog,
} from "@/features/locations/components/LocationsDialogs";
import type { LocationItemType } from "../types";

export default function LocationsCard({
  location,
}: {
  location: LocationItemType;
}) {
  return (
    <Card
      className={`border-l-8 ${
        location.restrictedAccess ? "border-red-400" : "border-green-400"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{location.name}</CardTitle>
        <div className="flex gap-x-2">
          <LocationsEditDialog location={location} />
          <LocationsDeleteDialog id={location.id} name={location.name} />
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
