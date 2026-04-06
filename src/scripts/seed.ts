import { createActivityLocation } from "@/features/activityLocations/dal";

// ! TODO: seednout lokace
export const LOCATIONS: Record<string, string> = {
  za_skladem: "Za skladem",
  sklad: "Sklad",
  kuchyn: "Kuchyň",
  jidelna: "Jídelna",
  kresilka: "Křesílka",
  kancl: "Kancl",
  lavicky: "Lavičky",
  fotbalak: "Fotbalák",
  pavilon: "Pavilon",
  bazen: "Bazén",
  joga: "Jóga",
  fortnite_altanek: "Fortnite altánek",
  volejbalove_hriste_u_jogy: "Volejbalové hřiště u jógy",
  volejbalove_hriste_u_lavky: "Volejbalové hřiště u lávky",
  ohniste: "Ohniště",
  lukostrelba: "Lukostřelba",
  safari: "Safari",
  elly_misto: "Elly místo",
  vicmanov: "Vicmanov",
  jablonecek: "Jabloneček",
  obedove_misto: "Obědové místo",
  misto_mladsich: "Místo mladších",
  misto_starsich: "Místo starších",
  koupaliste_bukovina: "Koupaliště Bukovina",
  cele_stredisko: "Celé středisko",
  mimo_tabor: "Mimo tábor",
  jine: "Jiné",
  neurceno: "Neurčeno",
};

async function seedActivitiesLocations() {
  const locations = Object.entries(LOCATIONS).map(([_key, value]) => ({
    name: value,
    indoor: Math.random() > 0.5,
    offsite: Math.random() > 0.5,
    restrictedAccess: Math.random() > 0.5,
  }));

  for (const [i, location] of locations.entries()) {
    await createActivityLocation(location)
      .then(() => {
        console.log(`Vytvořena lokace ${i + 1}/${locations.length}`);
      })
      .catch((e) => {
        console.error(
          `Chyba při vytváření lokace ${i + 1}/${locations.length}`,
        );
        console.error(e);
      });
  }

  process.exit(0);
}

seedActivitiesLocations();
