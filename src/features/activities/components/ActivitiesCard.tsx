/**
 * Soubor: src/features/activities/components/ActivitiesCard.tsx
 * Ucel: UI komponenta feature "activities".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

import { LucideMapPin, LucideShapes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVITY_CATEGORIES } from "@/features/activities/config";
import type { ActivityItemType } from "../types";
import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "./ActivitiesDialogs";

export type ActivityCardMode = "admin" | "user";

export default function ActivitiesCard({
  activity,
  locationName,
  locations,
  mode = "user",
}: {
  activity: ActivityItemType;
  locationName?: string;
  locations: Array<{ id: string; name: string }>;
  mode?: ActivityCardMode;
}) {
  return (
    <Card className="flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        {mode === "admin" ? (
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold">
              {activity.title}
            </CardTitle>
            <Badge
              style={{
                backgroundColor: ACTIVITY_CATEGORIES[activity.category].color,
              }}
              className="text-white"
            >
              {ACTIVITY_CATEGORIES[activity.category].name}
            </Badge>
          </div>
        ) : (
          <CardTitle className="text-lg font-semibold">
            {activity.title}
          </CardTitle>
        )}
        {mode === "admin" ? (
          <div className="flex gap-x-2">
            <ActivitiesEditDialog activity={activity} locations={locations} />
            <ActivitiesDeleteDialog id={activity.id} title={activity.title} />
          </div>
        ) : (
          <Badge
            style={{
              backgroundColor: ACTIVITY_CATEGORIES[activity.category].color,
            }}
            className="text-white"
          >
            {ACTIVITY_CATEGORIES[activity.category].name}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3">
        {activity.description ? (
          <p className="flex-1 text-sm whitespace-pre-wrap">
            {activity.description}
          </p>
        ) : (
          <p className="text-muted-foreground flex-1 text-sm italic">
            Žádný popis.
          </p>
        )}
        <div className="text-muted-foreground flex items-center gap-x-2 text-sm">
          <LucideMapPin size={16} />
          <span>{locationName ?? "Neznámá lokace"}</span>
        </div>
        {activity.defaultMaterials.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <LucideShapes size={16} className="text-muted-foreground" />
            {activity.defaultMaterials.map((material) => (
              <Badge
                key={`${material.amount}-${material.name}`}
                variant="secondary"
              >
                {material.amount} {material.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
