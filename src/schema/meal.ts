import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { group } from "./camp";

// ---------------------------------------------------------------------------
// Meal (Jídlo)
// ---------------------------------------------------------------------------

export const meal = sqliteTable(
  "meal",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    mealType: text("meal_type", {
      enum: [
        "breakfast",
        "morning_snack",
        "lunch",
        "afternoon_snack",
        "dinner",
      ],
    }).notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("meal_groupId_idx").on(table.groupId),
    index("meal_date_idx").on(table.date),
    index("meal_groupId_date_idx").on(table.groupId, table.date),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const mealRelations = relations(meal, ({ one }) => ({
  group: one(group, {
    fields: [meal.groupId],
    references: [group.id],
  }),
}));
