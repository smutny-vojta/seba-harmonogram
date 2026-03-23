import {
  createActivityLocation,
  listActivityLocations,
  updateActivityLocation,
} from "@/features/activities/dal";

export default async function AktivityPage() {
  const LOCATIONS = [
    "Za skladem",
    "Sklad",
    "Kuchyň",
    "Jídelna",
    "Křesílka",
    "Kancl",
    "Lavičky",
    "Fotbalák",
    "Pavilon",
    "Bazén",
    "Jóga",
    "Fortnite altánek",
    "Volejbalové hřiště u jógy",
    "Volejbalové hřiště u lávky",
    "Ohniště",
    "Lukostřelba",
    "Safari",
    "Elly místo",
    "Vicmanov",
    "Jabloneček",
    "Obědové místo",
    "Místo mladších",
    "Místo starších",
    "Koupaliště Bukovina",
    "Celé středisko",
    "Mimo tábor",
    "Jiné",
    "Neurčeno",
  ];

  // await Promise.all(
  //   LOCATIONS.map((location) => {
  //     createActivityLocation({
  //       name: location,
  //       indoor: Math.random() < 0.3,
  //       restrictedAccess: Math.random() < 0.1,
  //     });
  //   }),
  // ).then(() => {
  //   console.log("Hotovo");
  // });

  // await updateActivityLocation({
  //   id: "69c0e4480d0aee498cff8f91",
  //   data: {
  //     name: "Obědové místo",
  //     indoor: false,
  //     restrictedAccess: false,
  //   },
  // });

  return (
    <div>
      {await listActivityLocations().then((locations) =>
        locations.map((location) => (
          <div key={location.id}>
            {location.id} {location.name}{" "}
            {location.indoor ? "(vnitřní)" : "(venkovní)"}{" "}
            {location.restrictedAccess ? "(omezený přístup)" : ""}
          </div>
        )),
      )}
    </div>
  );
}
