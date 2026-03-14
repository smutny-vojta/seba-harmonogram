import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { group, term } from "./camp";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

// ---------------------------------------------------------------------------
// Message (Zpráva)
// ---------------------------------------------------------------------------

export const message = sqliteTable(
  "message",
  {
    id: text("id").primaryKey(),
    termId: integer("term_id")
      .notNull()
      .references(() => term.id, { onDelete: "cascade" }),
    groupId: text("group_id").references(() => group.id, {
      onDelete: "cascade",
    }),
    authorId: text("author_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content").notNull(),
    priority: text("priority", {
      enum: ["low", "normal", "high", "urgent"],
    })
      .default("normal")
      .notNull(),
    category: text("category"),
    publishAt: integer("publish_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("message_termId_idx").on(table.termId),
    index("message_groupId_idx").on(table.groupId),
    index("message_authorId_idx").on(table.authorId),
    index("message_publishAt_idx").on(table.publishAt),
  ],
);

export const messageSelectSchema = createSelectSchema(message);
export const messageInsertSchema = createInsertSchema(message);
export const messageUpdateSchema = createUpdateSchema(message);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const messageRelations = relations(message, ({ one }) => ({
  term: one(term, {
    fields: [message.termId],
    references: [term.id],
  }),
  group: one(group, {
    fields: [message.groupId],
    references: [group.id],
  }),
  author: one(user, {
    fields: [message.authorId],
    references: [user.id],
  }),
}));
