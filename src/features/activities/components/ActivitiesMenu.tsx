/**
 * Soubor: src/features/activities/components/ActivitiesMenu.tsx
 * Ucel: UI komponenta feature "activities".
 * Parametry/Vstupy: Props pro vykresleni dat a obsluhu uzivatelskych akci.
 * Pozadavky: Drzet komponentu zamerenou na prezentaci/UX a respektovat feature schema.
 */

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
