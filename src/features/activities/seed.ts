import { ACTIVITY_CATEGORIES_ARRAY } from "@/features/activities/consts";
import { createActivity } from "@/features/activities/dal";
import type { NewActivityType } from "@/features/activities/types";

type NewActivityTemplate = Pick<
  NewActivityType,
  "title" | "description" | "defaultMaterials"
>;

const ACTIVITY_TEMPLATES: NewActivityTemplate[] = [
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

function getCyclicValue<T>(items: T[], index: number): T {
  const value = items[index % items.length];

  if (!value) {
    throw new Error("Seed data je neplatná nebo prázdná.");
  }

  return value;
}

function ensureActivitiesSeedPreconditions(locationIds: string[]) {
  if (locationIds.length === 0) {
    throw new Error("Nelze seedovat aktivity bez lokací.");
  }

  if (ACTIVITY_CATEGORIES_ARRAY.length === 0) {
    throw new Error("Nelze seedovat aktivity bez kategorií.");
  }
}

export async function seedActivitiesFeature(locationIds: string[]) {
  ensureActivitiesSeedPreconditions(locationIds);

  for (const [i, activity] of ACTIVITY_TEMPLATES.entries()) {
    const locationId = getCyclicValue(locationIds, i);
    const category = getCyclicValue(ACTIVITY_CATEGORIES_ARRAY, i);

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
