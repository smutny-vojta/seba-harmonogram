import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLocationItemType } from "../types";
import {
  LucideHome,
  LucideMountain,
  LucidePencil,
  LucideTrash2,
  LucideUmbrella,
  LucideUmbrellaOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="text-lg font-semibold">{location.name}</span>
          <div className="flex gap-x-2">
            <Button variant="secondary" size="icon-sm">
              <LucidePencil size={16} />
            </Button>
            <Button variant="destructive" size="icon-sm">
              <LucideTrash2 size={16} />
            </Button>
          </div>
        </CardTitle>
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
