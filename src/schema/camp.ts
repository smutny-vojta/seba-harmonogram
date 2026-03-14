import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";
import { instructorAssignment } from "./assignment";
import { scheduleEntry } from "./schedule";
import { meal } from "./meal";
import { message } from "./message";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// ---------------------------------------------------------------------------
// Camp Category (Kategorie tábora)
// ---------------------------------------------------------------------------

export const campCategory = sqliteTable("camp_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  isOffice: integer("is_office", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const campCategorySelectSchema = createSelectSchema(campCategory);
export const campCategoryInsertSchema = createInsertSchema(campCategory);
export const campCategoryUpdateSchema = createUpdateSchema(campCategory);

// ---------------------------------------------------------------------------
// Term (Turnus)
// ---------------------------------------------------------------------------

export const term = sqliteTable("term", {
  id: integer("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const termSelectSchema = createSelectSchema(term);
export const termInsertSchema = createInsertSchema(term);
export const termUpdateSchema = createUpdateSchema(term);

// ---------------------------------------------------------------------------
// Group (Oddíl)
// ---------------------------------------------------------------------------

export const group = sqliteTable(
  "group",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    termId: integer("term_id")
      .notNull()
      .references(() => term.id, { onDelete: "cascade" }),
    campCategoryId: text("camp_category_id")
      .notNull()
      .references(() => campCategory.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("group_termId_idx").on(table.termId),
    index("group_campCategoryId_idx").on(table.campCategoryId),
  ],
);

export const groupSelectSchema = createSelectSchema(group);
export const groupInsertSchema = createInsertSchema(group);
export const groupUpdateSchema = createUpdateSchema(group);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const campCategoryRelations = relations(campCategory, ({ many }) => ({
  groups: many(group),
}));

export const termRelations = relations(term, ({ many }) => ({
  groups: many(group),
  messages: many(message),
}));

export const groupRelations = relations(group, ({ one, many }) => ({
  term: one(term, {
    fields: [group.termId],
    references: [term.id],
  }),
  campCategory: one(campCategory, {
    fields: [group.campCategoryId],
    references: [campCategory.id],
  }),
  instructorAssignments: many(instructorAssignment),
  scheduleEntries: many(scheduleEntry),
  meals: many(meal),
  messages: many(message),
}));
