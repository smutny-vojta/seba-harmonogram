import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { group } from "./camp";

// ---------------------------------------------------------------------------
// Activity Template (Šablona aktivity)
// ---------------------------------------------------------------------------

export const activityTemplate = sqliteTable("activity_template", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  materials: text("materials"),
  type: text("type", {
    enum: ["game", "sport", "organizational", "other"],
  }).notNull(),
  durationMinutes: integer("duration_minutes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ---------------------------------------------------------------------------
// Schedule Entry (Naplánovaná aktivita v harmonogramu)
// ---------------------------------------------------------------------------

export const scheduleEntry = sqliteTable(
  "schedule_entry",
  {
    id: text("id").primaryKey(),
    groupId: text("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    activityTemplateId: text("activity_template_id").references(
      () => activityTemplate.id,
      { onDelete: "set null" },
    ),
    name: text("name").notNull(),
    description: text("description"),
    location: text("location"),
    materials: text("materials"),
    date: text("date").notNull(),
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
    index("schedule_entry_groupId_idx").on(table.groupId),
    index("schedule_entry_date_idx").on(table.date),
    index("schedule_entry_groupId_date_idx").on(table.groupId, table.date),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const activityTemplateRelations = relations(
  activityTemplate,
  ({ many }) => ({
    scheduleEntries: many(scheduleEntry),
  }),
);

export const scheduleEntryRelations = relations(scheduleEntry, ({ one }) => ({
  group: one(group, {
    fields: [scheduleEntry.groupId],
    references: [group.id],
  }),
  activityTemplate: one(activityTemplate, {
    fields: [scheduleEntry.activityTemplateId],
    references: [activityTemplate.id],
  }),
}));
