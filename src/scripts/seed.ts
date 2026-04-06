import { ACTIVITY_CATEGORIES_ARRAY } from "@/features/activities/consts";
import { createActivity } from "@/features/activities/dal";
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

const ACTIVITY_TEMPLATES: Array<{
  title: string;
  description?: string;
  defaultMaterials: string[];
}> = [
  {
    title: "Ranní rozcvička",
    description: "Lehká pohybová aktivita na probuzení celého tábora.",
    defaultMaterials: ["Reproduktor", "Playlist"],
  },
  {
    title: "Turnaj ve vybíjené",
    description: "Mezioddílový turnaj ve vybíjené.",
    defaultMaterials: ["Míč", "Píšťalka"],
  },
  {
    title: "Orientační běh",
    description: "Hledání kontrol podle mapy v okolí tábora.",
    defaultMaterials: ["Mapa", "Kontrolní kartičky"],
  },
  {
    title: "Výroba náramků",
    description: "Kreativní dílna pro mladší i starší oddíly.",
    defaultMaterials: ["Provázky", "Korálky", "Nůžky"],
  },
  {
    title: "Malování táborového erbu",
    defaultMaterials: ["Papír A3", "Tempery", "Štětce"],
  },
  {
    title: "Táborový kvíz",
    description: "Vědomostní soutěž po oddílech.",
    defaultMaterials: ["Otázky", "Tabule", "Fixy"],
  },
  {
    title: "Šifrovací hra",
    description: "Týmová hra zaměřená na logiku a spolupráci.",
    defaultMaterials: ["Šifrovací listy", "Tužky"],
  },
  {
    title: "Přetahovaná lanem",
    defaultMaterials: ["Lano", "Kužely"],
  },
  {
    title: "Vodní štafeta",
    description: "Štafetová hra s vodními úkoly.",
    defaultMaterials: ["Kbelíky", "Kelímky", "Houbičky"],
  },
  {
    title: "Bojovka po areálu",
    defaultMaterials: ["Stanoviště", "Bodovací list"],
  },
  {
    title: "Večerní táborák",
    description: "Společné zpívání a program u ohně.",
    defaultMaterials: ["Kytara", "Zpěvníky", "Dřevo"],
  },
  {
    title: "Noční stezka odvahy",
    defaultMaterials: ["Čelovky", "Reflexní pásky"],
  },
  {
    title: "Turnaj v přehazované",
    defaultMaterials: ["Míč", "Síť"],
  },
  {
    title: "Lekce první pomoci",
    description: "Praktická ukázka základů první pomoci.",
    defaultMaterials: ["Lékárnička", "Obvazy"],
  },
  {
    title: "Stopovaná",
    description: "Hledání trasy podle značek v terénu.",
    defaultMaterials: ["Křída", "Provázky"],
  },
  {
    title: "Kreslení mapy tábora",
    defaultMaterials: ["Papíry", "Pastelky"],
  },
  {
    title: "Překážková dráha",
    defaultMaterials: ["Kužely", "Lano", "Žíněnky"],
  },
  {
    title: "Hra na pašeráky",
    description: "Strategická hra s přesunem zásob mezi stanovišti.",
    defaultMaterials: ["Kartičky", "Bodovací tabulka"],
  },
  {
    title: "Scénky oddílů",
    defaultMaterials: ["Kostýmy", "Rekvizity"],
  },
  {
    title: "Táborový tanec",
    defaultMaterials: ["Reproduktor"],
  },
  {
    title: "Volejbalový miniturnaj",
    defaultMaterials: ["Volejbalový míč", "Síť"],
  },
  {
    title: "Úklid areálu",
    description: "Společná organizovaná údržba tábora.",
    defaultMaterials: ["Pytle na odpad", "Rukavice"],
  },
  {
    title: "Výlet do okolí",
    defaultMaterials: ["Mapa trasy", "Pitný režim"],
  },
  {
    title: "Odpočinkové čtení",
    defaultMaterials: ["Knihy", "Deka"],
  },
];

async function seedActivityLocations() {
  const locations = Object.entries(LOCATIONS).map(([_key, value]) => ({
    name: value,
    indoor: Math.random() > 0.5,
    offsite: Math.random() > 0.5,
    restrictedAccess: Math.random() > 0.5,
  }));
  const locationIds: string[] = [];

  for (const [i, location] of locations.entries()) {
    try {
      const result = await createActivityLocation(location);
      locationIds.push(result.insertedId.toString());
      console.log(`Vytvořena lokace ${i + 1}/${locations.length}`);
    } catch (error) {
      console.error(`Chyba při vytváření lokace ${i + 1}/${locations.length}`);
      console.error(error);
    }
  }

  return locationIds;
}

async function seedActivities(locationIds: string[]) {
  if (locationIds.length === 0) {
    throw new Error("Nelze seedovat aktivity bez lokací.");
  }

  if (ACTIVITY_CATEGORIES_ARRAY.length === 0) {
    throw new Error("Nelze seedovat aktivity bez kategorií.");
  }

  for (const [i, activity] of ACTIVITY_TEMPLATES.entries()) {
    const locationId = locationIds[i % locationIds.length];
    const category =
      ACTIVITY_CATEGORIES_ARRAY[i % ACTIVITY_CATEGORIES_ARRAY.length];

    if (!locationId || !category) {
      throw new Error(
        "Nepodařilo se určit lokaci nebo kategorii pro seed aktivity.",
      );
    }

    try {
      await createActivity({
        title: activity.title,
        description: activity.description,
        locationId,
        category,
        defaultMaterials: activity.defaultMaterials,
      });
      console.log(`Vytvořena aktivita ${i + 1}/${ACTIVITY_TEMPLATES.length}`);
    } catch (error) {
      console.error(
        `Chyba při vytváření aktivity ${i + 1}/${ACTIVITY_TEMPLATES.length}`,
      );
      console.error(error);
    }
  }
}

async function runSeed() {
  try {
    const locationIds = await seedActivityLocations();
    await seedActivities(locationIds);
    process.exit(0);
  } catch (error) {
    console.error("Seed selhal.");
    console.error(error);
    process.exit(1);
  }
}

runSeed();
