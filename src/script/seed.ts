import { db } from "@/shared/lib/db";
import { campCategory, term } from "@/schema/camp";
import { activityTemplate } from "@/schema/schedule";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed camp categories
  await db.insert(campCategory).values([
    { id: "minecraft", name: "Minecraft", color: "green", isOffice: false },
    { id: "fortnite", name: "Fortnite", color: "indigo", isOffice: false },
    { id: "cyber", name: "Cyber", color: "blue", isOffice: false },
    { id: "sport", name: "Sport", color: "yellow", isOffice: false },
    { id: "kancl", name: "Kancl", color: "red", isOffice: true },
  ]);
  console.log("✅ Camp categories seeded");

  // Seed terms
  await db.insert(term).values([
    // Testovací turnus
    {
      id: 0,
      startDate: "2026-03-01T00:00:00+01:00",
      endDate: "2026-03-31T23:59:59+02:00",
    },
    {
      id: 1,
      startDate: "2026-07-01T14:00:00+02:00",
      endDate: "2026-07-10T10:30:00+02:00",
    },
    {
      id: 2,
      startDate: "2026-07-10T14:00:00+02:00",
      endDate: "2026-07-19T10:30:00+02:00",
    },
    {
      id: 3,
      startDate: "2026-07-19T14:00:00+02:00",
      endDate: "2026-07-28T10:30:00+02:00",
    },
    {
      id: 4,
      startDate: "2026-07-28T14:00:00+02:00",
      endDate: "2026-08-06T10:30:00+02:00",
    },
    {
      id: 5,
      startDate: "2026-08-06T14:00:00+02:00",
      endDate: "2026-08-15T10:30:00+02:00",
    },
  ]);
  console.log("✅ Terms seeded");

  // Seed Activity Templates
  const activityTypes = ["game", "sport", "organizational", "other"] as const;
  
  const sampleActivities = [
    { name: "Boj o vlajku", type: "game", duration: 90, loc: "Les", mat: "2 vlajky, fáborky" },
    { name: "Fotbal", type: "sport", duration: 60, loc: "Hřiště", mat: "Fotbalový míč" },
    { name: "Ranní nástup", type: "organizational", duration: 15, loc: "Náměstíčko", mat: "Vlajka, kytara" },
    { name: "Osobní volno", type: "other", duration: 60, loc: "Tábor", mat: "" },
    { name: "Stezka odvahy", type: "game", duration: 120, loc: "Les v noci", mat: "Svíčky, strašidelné masky" },
    { name: "Vybíjená", type: "sport", duration: 45, loc: "Hřiště", mat: "Vybíjenkový míč" },
    { name: "Večerka", type: "organizational", duration: 15, loc: "Stany", mat: "" },
    { name: "Zpívání u táboráku", type: "other", duration: 90, loc: "Ohniště", mat: "Dřevo, kytary, zpěvníky" },
    { name: "Šifrovací hra", type: "game", duration: 120, loc: "Okolí tábora", mat: "Zadání šifer, buzola" },
    { name: "Přehazovaná", type: "sport", duration: 60, loc: "Volleyballové hřiště", mat: "Síť, volejbalový míč" },
    { name: "Snídaně", type: "organizational", duration: 30, loc: "Jídelna", mat: "Jídelní potřeby" },
    { name: "Úklid stanů", type: "organizational", duration: 30, loc: "Stany", mat: "Košťata" },
    { name: "Pašeráci", type: "game", duration: 90, loc: "Les", mat: "Papírové peníze, lístečky" },
    { name: "Překážková dráha", type: "sport", duration: 60, loc: "Louka", mat: "Lana, pneumatiky, kužely" },
    { name: "Oběd", type: "organizational", duration: 45, loc: "Jídelna", mat: "Jídelní potřeby" },
    { name: "Oblékání do kostýmu", type: "organizational", duration: 20, loc: "Stany", mat: "Kostýmy" },
    { name: "Honba za pokladem", type: "game", duration: 150, loc: "Široké okolí", map: "Trulhala s odměnami, mapa" },
    { name: "Noční hlídka", type: "organizational", duration: 120, loc: "Tábor", mat: "Baterka" },
    { name: "Turnaj ve stolním tenise", type: "sport", duration: 120, loc: "Herna", mat: "Stoly, pálky, míčky" },
    { name: "Filmový večer", type: "other", duration: 120, loc: "Jídelna", mat: "Projektor, plátno, notebook" },
    { name: "Výlet", type: "other", duration: 240, loc: "Hradsko", mat: "Svačiny, pevné boty" },
    { name: "Sběr borůvek", type: "other", duration: 60, loc: "Les", mat: "Hrnečky" },
    { name: "Pevnost Boyard", type: "game", duration: 180, loc: "Tábor", mat: "Rekvizity ke stanovištím, klíče" },
    { name: "Mölkky", type: "sport", duration: 45, loc: "Louka", mat: "Sada Mölkky" },
    { name: "Svačina", type: "organizational", duration: 15, loc: "Jídelna", mat: "Jídelní potřeby" },
    { name: "Ranní rozcvička", type: "sport", duration: 15, loc: "Louka", mat: "Z reproduktoru hudba" },
    { name: "Vědomostní kvíz", type: "game", duration: 60, loc: "Jídelna", mat: "Papíry, tužky" },
    { name: "Příjezd a ubytování", type: "organizational", duration: 120, loc: "Tábor", mat: "" },
    { name: "Zahajovací oheň", type: "other", duration: 90, loc: "Ohniště", mat: "Slavnostní oblečení, pochmude" },
    { name: "Noční hra", type: "game", duration: 90, loc: "Les", mat: "Svítící náramky" },
    { name: "Házená", type: "sport", duration: 60, loc: "Hřiště", mat: "Házenkářský míč" },
    { name: "Příprava dřeva na oheň", type: "organizational", duration: 60, loc: "Les", mat: "Pily, sekery, vozík" },
    { name: "Diskotéka", type: "other", duration: 180, loc: "Jídelna", mat: "Aparatura, světla" },
    { name: "Stavění bunkrů", type: "game", duration: 90, loc: "Les", mat: "" },
    { name: "Olympiáda", type: "sport", duration: 240, loc: "Všude", mat: "Diplomy, medaile, stopky" },
    { name: "Odjezd domů", type: "organizational", duration: 120, loc: "Tábor", mat: "" },
    { name: "Městečko Palermo", type: "game", duration: 60, loc: "Jídelna", mat: "Karty rolí" },
    { name: "Ruské kuželky", type: "sport", duration: 45, loc: "Louka", mat: "Kuželky, závěsná koule" },
    { name: "Koupání a vodní bitva", type: "sport", duration: 90, loc: "Rybník", mat: "Vodní pistolky, plavky" },
    { name: "Rozšiřování slovní zásoby", type: "game", duration: 45, loc: "Jídelna", mat: "Fixy, papíry" },
    { name: "Hutututu", type: "sport", duration: 30, loc: "Louka", mat: "" },
    { name: "Poznávání přírody", type: "game", duration: 90, loc: "Les", mat: "Klíč k určování rostlin, lupa" },
    { name: "Uzlování", type: "other", duration: 45, loc: "Stany", mat: "Uzlovačky" },
    { name: "Zdravověda", type: "other", duration: 90, loc: "Jídelna", mat: "Lékárnička, figurína, obinadla" },
    { name: "Zpracování kůry", type: "other", duration: 60, loc: "Dílna", mat: "Kůra z borovice, nožíky" },
    { name: "Opejkání buřtů", type: "other", duration: 90, loc: "Ohniště", mat: "Buřty, chleba, klacky, hořčice" },
    { name: "Malování vlajek", type: "other", duration: 60, loc: "Jídelna", mat: "Látky, barvy na textil, štětce" },
    { name: "Ringoturnaj", type: "sport", duration: 120, loc: "Hřiště", mat: "Kroužky jména Ringo, sítě" },
    { name: "Výroba talismanů", type: "other", duration: 90, loc: "Jídelna", mat: "Korálky, šňůrky, dřevo" },
    { name: "Rozdělování do oddílů", type: "organizational", duration: 60, loc: "Náměstíčko", mat: "Kbelíčky, papírky" },
  ];

  const activitiesToInsert = sampleActivities.map((act) => ({
    id: crypto.randomUUID(),
    name: act.name,
    type: act.type as "game" | "sport" | "organizational" | "other",
    durationMinutes: act.duration,
    location: act.loc,
    materials: matToString(act),
    description: "Šablona vygenerovaná seedovacím scriptem...",
  }));

  await db.insert(activityTemplate).values(activitiesToInsert);
  console.log(`✅ ${activitiesToInsert.length} Activity templates seeded`);

  console.log("🌱 Seeding complete!");
}

function matToString(act: any) {
  return act.mat || act.map || "";
}

seed();
