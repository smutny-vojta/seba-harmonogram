import ActivityLocationsCard from "./ActivityLocationsCard";
import { ActivityLocationItemType } from "../types";

export default function ActivityLocationsGrid({
  locations,
}: {
  locations: ActivityLocationItemType[];
}) {
  return (
    <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-3 gap-4 overflow-y-auto">
      {locations.length === 0 && (
        <div className="col-span-3 text-center">
          <p>Nejsou zde žádné lokality.</p>
        </div>
      )}
      {locations.map((location) => (
        <ActivityLocationsCard key={location.id} location={location} />
      ))}
    </div>
  );
}
