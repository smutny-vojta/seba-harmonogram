import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  unique,
} from "drizzle-orm/sqlite-core";
import { instructorAssignment } from "./assignment";
import { scheduleEntry } from "./schedule";
import { meal } from "./meal";
import { message } from "./message";

// ---------------------------------------------------------------------------
// Camp Category (Kategorie tábora)
// ---------------------------------------------------------------------------

export const campCategory = sqliteTable("camp_category", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ---------------------------------------------------------------------------
// Term (Turnus)
// ---------------------------------------------------------------------------

export const term = sqliteTable("term", {
  id: text("id").primaryKey(),
  number: integer("number").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  year: integer("year").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// ---------------------------------------------------------------------------
// Term ↔ Camp Category (Aktivní kategorie v turnusu)
// ---------------------------------------------------------------------------

export const termCampCategory = sqliteTable(
  "term_camp_category",
  {
    id: text("id").primaryKey(),
    termId: text("term_id")
      .notNull()
      .references(() => term.id, { onDelete: "cascade" }),
    campCategoryId: text("camp_category_id")
      .notNull()
      .references(() => campCategory.id, { onDelete: "cascade" }),
  },
  (table) => [
    unique("term_camp_category_uniq").on(table.termId, table.campCategoryId),
    index("term_camp_category_termId_idx").on(table.termId),
  ],
);

// ---------------------------------------------------------------------------
// Group (Oddíl)
// ---------------------------------------------------------------------------

export const group = sqliteTable(
  "group",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    termId: text("term_id")
      .notNull()
      .references(() => term.id, { onDelete: "cascade" }),
    campCategoryId: text("camp_category_id").references(
      () => campCategory.id,
      { onDelete: "set null" },
    ),
    isOffice: integer("is_office", { mode: "boolean" })
      .default(false)
      .notNull(),
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

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const campCategoryRelations = relations(campCategory, ({ many }) => ({
  termCampCategories: many(termCampCategory),
  groups: many(group),
}));

export const termRelations = relations(term, ({ many }) => ({
  termCampCategories: many(termCampCategory),
  groups: many(group),
  messages: many(message),
}));

export const termCampCategoryRelations = relations(
  termCampCategory,
  ({ one }) => ({
    term: one(term, {
      fields: [termCampCategory.termId],
      references: [term.id],
    }),
    campCategory: one(campCategory, {
      fields: [termCampCategory.campCategoryId],
      references: [campCategory.id],
    }),
  }),
);

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
