import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ACTIVITY_CATEGORIES } from "@/features/activities/consts";
import {
  ActivitiesDeleteDialog,
  ActivitiesEditDialog,
} from "@features/activities/components/ActivitiesDialogs";
import { LucideMapPin } from "lucide-react";
import type { ActivityItemType } from "../types";

export default function ActivitiesCard({
  activity,
  locationName,
  locations,
}: {
  activity: ActivityItemType;
  locationName?: string;
  locations: Array<{ id: string; name: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
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
        <div className="flex gap-x-2">
          <ActivitiesEditDialog activity={activity} locations={locations} />
          <ActivitiesDeleteDialog id={activity.id} title={activity.title} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-muted-foreground flex items-center gap-x-2 text-sm">
          <LucideMapPin size={16} />
          <span>{locationName ?? "Neznámá lokace"}</span>
        </div>
        {activity.description && (
          <p className="text-sm whitespace-pre-wrap">{activity.description}</p>
        )}
        {activity.defaultMaterials.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {activity.defaultMaterials.map((material) => (
              <Badge key={material} variant="secondary">
                {material}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
