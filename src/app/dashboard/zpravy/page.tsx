import { db } from "@/lib/db";
import { message } from "@/schema/message";
import { desc } from "drizzle-orm";

export default async function ZpravyPage() {
  const messages = await db
    .select()
    .from(message)
    .orderBy(desc(message.createdAt));

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 text-left font-medium">Titulek</th>
              <th className="p-4 text-left font-medium">Obsah</th>
              <th className="p-4 text-left font-medium">Priorita</th>
              <th className="p-4 text-left font-medium">Kategorie</th>
              <th className="p-4 text-left font-medium">Publikováno</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-muted-foreground p-4 text-center"
                >
                  Žádné zprávy
                </td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr
                  key={msg.id}
                  className="hover:bg-muted/50 border-b last:border-0"
                >
                  <td className="p-4">{msg.title}</td>
                  <td className="max-w-50 truncate p-4">{msg.content}</td>
                  <td className="p-4">{msg.priority}</td>
                  <td className="p-4">{msg.category ?? "-"}</td>
                  <td className="p-4">
                    {new Date(msg.publishAt).toLocaleString("cs-CZ")}
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
