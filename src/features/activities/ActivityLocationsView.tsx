import ActivityLocationsCard from "@/features/activities/components/ActivityLocationsCard";
import { listActivityLocations } from "@/features/activities/dal";

export default async function ActivityLocationsView() {
  const locations = await listActivityLocations();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {locations.map((location) => (
        <ActivityLocationsCard key={location.id} location={location} />
      ))}
    </div>
  );
}
