import type {
  LocationItemType,
  LocationType,
  NewLocationType,
} from "@/features/locations/types";
import { mapMongoIdToId } from "@/utils/mongo";
import { randomBool } from "@/utils/random";

const LOCATIONS: Record<string, string> = {
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

export function parseLocationFormData(formData: FormData): NewLocationType {
  return {
    name: String(formData.get("name") ?? "").trim(),
    restrictedAccess: formData.get("restrictedAccess") === "on",
    indoor: formData.get("indoor") === "on",
    offsite: formData.get("offsite") === "on",
  };
}

export function mapLocationToItem(location: LocationType): LocationItemType {
  return mapMongoIdToId(location);
}

export function buildLocationSeedData(): NewLocationType[] {
  return Object.values(LOCATIONS).map((name) => ({
    name,
    indoor: randomBool(),
    offsite: randomBool(),
    restrictedAccess: randomBool(),
  }));
}
