import { listActivityLocations } from "@/features/activityLocations/dal";
import ActivitiesGrid from "@features/activities/components/ActivitiesGrid";
import ActivitiesMenu from "@features/activities/components/ActivitiesMenu";
import { listActivities } from "./dal";

export default async function ActivitiesView() {
  const [activities, locations] = await Promise.all([
    listActivities(),
    listActivityLocations(),
  ]);

  const locationsById = Object.fromEntries(
    locations.map((location) => [location.id, location.name]),
  );

  return (
    <div className="flex h-full flex-col gap-y-4">
      <ActivitiesMenu count={activities.length} locations={locations} />
      <ActivitiesGrid activities={activities} locationsById={locationsById} />
    </div>
  );
}
