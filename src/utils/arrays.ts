export function getCyclicValue<T>(items: T[], index: number): T {
  const value = items[index % items.length];

  if (!value) {
    throw new Error("Seed data je neplatna nebo prazdna.");
  }

  return value;
}
