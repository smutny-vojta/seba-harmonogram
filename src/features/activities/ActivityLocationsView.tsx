import ActivityLocationsGrid from "@/features/activities/components/ActivityLocationsGrid";
import ActivityLocationsMenu from "@/features/activities/components/ActivityLocationsMenu";
import { listActivityLocations } from "@/features/activities/dal";

export default async function ActivityLocationsView() {
  const locations = await listActivityLocations();

  return (
    <div className="flex h-full flex-col gap-y-4">
      <ActivityLocationsMenu count={locations.length} />
      <ActivityLocationsGrid locations={locations} />
    </div>
  );
}
