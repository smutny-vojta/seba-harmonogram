import ActivityLocationsCard from "@/features/activities/components/ActivityLocationsCard";
import { listActivityLocations } from "@/features/activities/dal";

export default async function ActivityLocationsView() {
  const locations = await listActivityLocations();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(locations);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-3 mb-2 flex gap-x-4">
        <div className="flex items-center gap-x-2">
          <div className="h-5 w-5 bg-green-500"></div>
          <span>Přístup mají všichni</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="h-5 w-5 bg-red-500"></div>
          <span>Přístup mají pouze instři</span>
        </div>
      </div>
      {locations.map((location) => (
        <ActivityLocationsCard key={location.id} location={location} />
      ))}
    </div>
  );
}
