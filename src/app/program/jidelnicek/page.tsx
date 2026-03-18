import { mealDal } from "@/dal/meal.dal";

export default async function JidelnicekPage() {
  const meals = await mealDal.listMeals();

  const translateMealType = (type: string) => {
    switch (type) {
      case "breakfast": return "Snídaně";
      case "morning_snack": return "Dopolední svačina";
      case "lunch": return "Oběd";
      case "afternoon_snack": return "Odpolední svačina";
      case "dinner": return "Večeře";
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="p-4 text-left font-medium">Oddíl</th>
              <th className="p-4 text-left font-medium">Datum</th>
              <th className="p-4 text-left font-medium">Jídlo</th>
              <th className="p-4 text-left font-medium">Výdej od</th>
              <th className="p-4 text-left font-medium">Výdej do</th>
            </tr>
          </thead>
          <tbody>
            {meals.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  Žádný jídelníček
                </td>
              </tr>
            ) : (
              meals.map((m) => (
                <tr key={m.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="p-4">{m.group.name}</td>
                  <td className="p-4">{new Date(m.date).toLocaleDateString("cs-CZ")}</td>
                  <td className="p-4">{translateMealType(m.mealType)}</td>
                  <td className="p-4">{m.startTime}</td>
                  <td className="p-4">{m.endTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
