import { listActivityLocations } from "@/features/activities/dal";

export default async function AktivityPage() {
  return (
    <div>
      {
        await listActivityLocations().then((locations) =>
          locations.map((location) => (
            <div key={location.id}>
              {location.id} {location.name}{" "}
              {location.indoor ? "(vnitřní)" : "(venkovní)"}{" "}
              {location.restrictedAccess ? "(omezený přístup)" : ""}
            </div>
          )),
        )
      }
    </div>
  );
}
