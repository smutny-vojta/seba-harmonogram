import { Suspense } from "react";
import { PageLoadingSpinner } from "@/components/PageLoadingSpinner";
import { LocationsView } from "@/features/locations";

export default async function LocationsPage() {
  return (
    <Suspense fallback={<PageLoadingSpinner />}>
      <LocationsView />
    </Suspense>
  );
}
