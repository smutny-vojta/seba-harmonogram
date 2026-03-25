import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLocationItemType } from "../types";
import {
  LucideBrickWall,
  LucideHouse,
  LucideLock,
  LucidePencil,
  LucideTrash2,
  LucideTrees,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ActivityLocationsCard({
  location,
}: {
  location: ActivityLocationItemType;
}) {
  return (
    <Card
    // className={`border-l-8 ${
    //   location.restrictedAccess ? "border-destructive" : "border-green-500"
    // }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <span className="text-lg">{location.name}</span>
            {Math.random() > 0.5 && (
              <LucideLock size={16} className="text-destructive" />
            )}
          </div>
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
        {location.indoor ? (
          <div className="flex items-center gap-x-2">
            <LucideHouse size={16} />
            <span>Vnitřní</span>
          </div>
        ) : (
          <div className="flex items-center gap-x-2">
            <LucideTrees size={16} />
            <span>Venkovní</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
