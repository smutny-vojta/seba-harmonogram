import { ActivitiesAddDialog } from "@features/activities/components/ActivitiesDialogs";

export default function ActivitiesMenu({
  count,
  locations,
}: {
  count: number;
  locations: Array<{ id: string; name: string }>;
}) {
  return (
    <div className="flex h-fit shrink-0 items-center justify-between">
      <div>Celkový počet aktivit: {count}</div>
      <ActivitiesAddDialog locations={locations} />
    </div>
  );
}
