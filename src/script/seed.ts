import { db } from "@/lib/db";
import { campCategory, term } from "@/schema/camp";

async function seed() {
  console.log("🌱 Seeding database...");

  // Seed camp categories
  await db.insert(campCategory).values([
    { id: "minecraft", name: "Minecraft", color: "green", isOffice: false },
    { id: "fortnite", name: "Fortnite", color: "indigo", isOffice: false },
    { id: "cyber", name: "Cyber", color: "blue", isOffice: false },
    { id: "sport", name: "Sport", color: "yellow", isOffice: false },
    { id: "kancl", name: "Kancelář", color: "red", isOffice: true },
  ]);
  console.log("✅ Camp categories seeded");

  // Seed terms
  await db.insert(term).values([
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

  console.log("🌱 Seeding complete!");
}

seed();
