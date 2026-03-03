import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  unique,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { campCategory, group, term } from "./camp";

// ---------------------------------------------------------------------------
// Instructor Assignment (Přiřazení instruktora k oddílu)
// ---------------------------------------------------------------------------

export const instructorAssignment = sqliteTable(
  "instructor_assignment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    groupId: text("group_id")
      .notNull()
      .references(() => group.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("instructor_assignment_uniq").on(table.userId, table.groupId),
    index("instructor_assignment_userId_idx").on(table.userId),
    index("instructor_assignment_groupId_idx").on(table.groupId),
  ],
);

// ---------------------------------------------------------------------------
// Camp Category Manager (Přiřazení programového vedoucího ke kategorii)
// ---------------------------------------------------------------------------

export const campCategoryManager = sqliteTable(
  "camp_category_manager",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    campCategoryId: text("camp_category_id")
      .notNull()
      .references(() => campCategory.id, { onDelete: "cascade" }),
    termId: text("term_id")
      .notNull()
      .references(() => term.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    unique("camp_category_manager_uniq").on(
      table.userId,
      table.campCategoryId,
      table.termId,
    ),
    index("camp_category_manager_userId_idx").on(table.userId),
    index("camp_category_manager_termId_idx").on(table.termId),
  ],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const instructorAssignmentRelations = relations(
  instructorAssignment,
  ({ one }) => ({
    user: one(user, {
      fields: [instructorAssignment.userId],
      references: [user.id],
    }),
    group: one(group, {
      fields: [instructorAssignment.groupId],
      references: [group.id],
    }),
  }),
);

export const campCategoryManagerRelations = relations(
  campCategoryManager,
  ({ one }) => ({
    user: one(user, {
      fields: [campCategoryManager.userId],
      references: [user.id],
    }),
    campCategory: one(campCategory, {
      fields: [campCategoryManager.campCategoryId],
      references: [campCategory.id],
    }),
    term: one(term, {
      fields: [campCategoryManager.termId],
      references: [term.id],
    }),
  }),
);
