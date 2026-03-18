import { db } from "@/lib/db";
import { campCategory } from "@/schema/camp";
import { desc } from "drizzle-orm";

export default async function TaboryPage() {
  const categories = await db
    .select()
    .from(campCategory)
    .orderBy(desc(campCategory.createdAt));

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Název</th>
              <th className="p-4 text-left font-medium">Barva</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-muted-foreground p-4 text-center"
                >
                  Žádné tábory (kategorie)
                </td>
              </tr>
            ) : (
              categories
                .filter((cat) => !cat.isOffice)
                .map((cat) => (
                  <tr
                    key={cat.id}
                    className="hover:bg-muted/50 border-b last:border-0"
                  >
                    <td className="p-4 font-medium">{cat.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-4 rounded-full border"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.color}
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
