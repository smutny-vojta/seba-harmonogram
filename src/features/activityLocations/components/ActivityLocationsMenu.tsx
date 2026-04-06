import { ActivityLocationsAddDialog } from "@/features/activityLocations/components/ActivityLocationsDialogs";

export default function ActivityLocationsMenu({ count }: { count: number }) {
  return (
    <div className="flex h-fit shrink-0 items-center justify-between">
      <div>Celkový počet lokací: {count}</div>
      <div className="flex items-center gap-x-4">
        <div className="flex items-center gap-x-2">
          <div className="h-5 w-5 rounded-full bg-green-500"></div>
          <span>Přístup pro všechny</span>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="h-5 w-5 rounded-full bg-red-500"></div>
          <span>Přístup pouze pro robinsony</span>
        </div>
      </div>
      <ActivityLocationsAddDialog />
    </div>
  );
}
