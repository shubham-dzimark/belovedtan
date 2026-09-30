import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamp = (name: string) =>
  integer(name, { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at"),
});

export const pages = sqliteTable("pages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  // "" is the home page; otherwise a path like "about" or "services/web".
  slug: text("slug").notNull().unique(),
  // Puck JSON being edited in the admin panel.
  draftData: text("draft_data").notNull(),
  // Puck JSON served to visitors; null until first publish.
  publishedData: text("published_data"),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
});

export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;

// Site-wide parts edited once and shown on every page (e.g. the header and footer).
export const siteParts = sqliteTable("site_parts", {
  key: text("key", { enum: ["header", "footer"] }).primaryKey(),
  // Puck JSON being edited in the admin panel.
  draftData: text("draft_data").notNull(),
  // Puck JSON shown on the live site; null until first publish.
  publishedData: text("published_data"),
  updatedAt: timestamp("updated_at"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
});

export type SitePart = typeof siteParts.$inferSelect;
export type SitePartKey = SitePart["key"];

// Reusable sections ("global widgets"): saved once, placed on any page, edited in one place.
export const globalBlocks = sqliteTable("global_blocks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  // The section type it renders, e.g. "HeroBanner".
  type: text("type").notNull(),
  // Section settings (JSON) being edited in the admin panel.
  draftProps: text("draft_props").notNull(),
  // Section settings (JSON) shown on pages; pages always use the published version.
  publishedProps: text("published_props"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  publishedAt: integer("published_at", { mode: "timestamp" }),
});

export type GlobalBlock = typeof globalBlocks.$inferSelect;
