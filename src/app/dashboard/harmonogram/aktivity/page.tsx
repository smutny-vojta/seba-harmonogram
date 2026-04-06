import { LucideLoader2 } from "lucide-react";
import { Suspense } from "react";
import ActivitiesView from "@/features/activities/ActivitiesView";

export default async function ActivitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center">
          <LucideLoader2 className="animate-spin" size={32} />
        </div>
      }
    >
      <ActivitiesView />
    </Suspense>
  );
}
