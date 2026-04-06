import type { ActivityItemType } from "../types";
import ActivitiesCard from "./ActivitiesCard";

export default function ActivitiesGrid({
  activities,
  locationsById,
}: {
  activities: ActivityItemType[];
  locationsById: Record<string, string>;
}) {
  const locations = Object.entries(locationsById).map(([id, name]) => ({
    id,
    name,
  }));

  return (
    <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-3 gap-4 overflow-y-auto">
      {activities.length === 0 && (
        <div className="col-span-3 text-center">
          <p>Nejsou zde žádné aktivity.</p>
        </div>
      )}
      {activities.map((activity) => (
        <ActivitiesCard
          key={activity.id}
          activity={activity}
          locationName={locationsById[activity.locationId]}
          locations={locations}
        />
      ))}
    </div>
  );
}
