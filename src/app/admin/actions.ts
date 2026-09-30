"use server";

import type { Data } from "@puckeditor/core";
import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/db";
import { globalBlocks, pages, siteParts, users, type SitePartKey } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { createSession, deleteSession } from "@/lib/session";
import { normalizeSlug, slugError } from "@/lib/slug";
import config from "@/puck/config";
import { canBeGlobal, detachGlobal } from "@/puck/global-blocks";
import { templatePageData } from "@/puck/landing-template";
import { emptyPageData } from "@/puck/templates";

export type FormState = { error?: string; success?: string } | undefined;

const MAX_PAGE_BYTES = 4 * 1024 * 1024;

function refreshAll() {
  revalidatePath("/", "layout");
}

function serializePageData(data: Data) {
  if (!data || !Array.isArray(data.content) || typeof data.root !== "object") {
    throw new Error("Invalid page data.");
  }
  const json = JSON.stringify(data);
  if (json.length > MAX_PAGE_BYTES) throw new Error("Page is too large.");
  return json;
}

async function isSlugTaken(slug: string, exceptId?: number) {
  const [row] = await db
    .select({ id: pages.id })
    .from(pages)
    .where(exceptId ? and(eq(pages.slug, slug), ne(pages.id, exceptId)) : eq(pages.slug, slug));
  return Boolean(row);
}

const idSchema = z.coerce.number().int().positive();

// ---------- Auth ----------

const loginSchema = z.object({
  email: z.email("Enter a valid email.").transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1, "Enter your password."),
});

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email));
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) return { error: "Incorrect email or password." };

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await deleteSession();
  redirect("/admin/login");
}

// ---------- Pages ----------

const pageFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  slug: z.string().max(200).transform(normalizeSlug),
});

const templateSchema = z.enum(["blank", "landing", "service"]).catch("blank");

export async function createPage(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const parsed = pageFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { title } = parsed.data;
  // "/" means the home page; a blank URL is generated from the title.
  const template = templateSchema.parse(formData.get("template"));
  const isHome = String(formData.get("slug") ?? "").trim() === "/";
  const slug = isHome ? "" : parsed.data.slug || normalizeSlug(title);
  const reserved = slugError(slug);
  if (reserved) return { error: reserved };
  if (await isSlugTaken(slug)) return { error: `A page already uses "/${slug}".` };

  const [page] = await db
    .insert(pages)
    .values({
      title,
      slug,
      draftData: JSON.stringify(template === "blank" ? emptyPageData : templatePageData(template)),
    })
    .returning({ id: pages.id });

  refreshAll();
  redirect(`/admin/editor/${page.id}`);
}

export async function updatePageSettings(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  const parsed = pageFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { title, slug } = parsed.data;
  const reserved = slugError(slug);
  if (reserved) return { error: reserved };
  if (await isSlugTaken(slug, id)) return { error: `A page already uses "/${slug}".` };

  await db
    .update(pages)
    .set({ title, slug, updatedAt: new Date() })
    .where(eq(pages.id, id));

  refreshAll();
  return { success: "Settings saved." };
}

export async function deletePage(formData: FormData) {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  await db.delete(pages).where(eq(pages.id, id));
  refreshAll();
  redirect("/admin");
}

export async function duplicatePage(formData: FormData) {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  const [page] = await db.select().from(pages).where(eq(pages.id, id));
  if (!page) redirect("/admin");

  let slug = `${page.slug || "home"}-copy`;
  for (let n = 2; await isSlugTaken(slug); n++) slug = `${page.slug || "home"}-copy-${n}`;

  await db.insert(pages).values({
    title: `${page.title} (copy)`,
    slug,
    draftData: page.draftData,
  });
  refreshAll();
  redirect("/admin");
}

export async function unpublishPage(formData: FormData) {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  await db
    .update(pages)
    .set({ status: "draft", publishedData: null, updatedAt: new Date() })
    .where(eq(pages.id, id));
  refreshAll();
}

// Called from the Puck editor (client component).
export async function saveDraft(id: number, data: Data) {
  await requireUser();
  await db
    .update(pages)
    .set({ draftData: serializePageData(data), updatedAt: new Date() })
    .where(eq(pages.id, idSchema.parse(id)));
  refreshAll();
  return { savedAt: new Date().toISOString() };
}

export async function publishPage(id: number, data: Data) {
  await requireUser();
  const json = serializePageData(data);
  const now = new Date();
  await db
    .update(pages)
    .set({
      draftData: json,
      publishedData: json,
      status: "published",
      updatedAt: now,
      publishedAt: now,
    })
    .where(eq(pages.id, idSchema.parse(id)));
  refreshAll();
  return { publishedAt: now.toISOString() };
}

// ---------- Users ----------

const userFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100),
  email: z.email("Enter a valid email.").transform((v) => v.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function createUser(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const parsed = userFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { name, email, password } = parsed.data;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) return { error: "That email already has an account." };

  await db.insert(users).values({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  refreshAll();
  return { success: `Added ${email}.` };
}

export async function deleteUser(formData: FormData) {
  const me = await requireUser();
  const id = idSchema.parse(formData.get("id"));
  if (id === me.id) return; // Never let an admin lock themselves out.
  await db.delete(users).where(eq(users.id, id));
  refreshAll();
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Enter your current password."),
    next: z.string().min(8, "New password must be at least 8 characters."),
  });

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const me = await requireUser();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const [user] = await db.select().from(users).where(eq(users.id, me.id));
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { error: "Current password is incorrect." };
  }
  await db
    .update(users)
    .set({ passwordHash: await bcrypt.hash(parsed.data.next, 12) })
    .where(eq(users.id, me.id));
  return { success: "Password updated." };
}

// ---------- Site header / footer ----------

const sitePartSchema = z.enum(["header", "footer"]);

// Called from the Header / Footer editors (client component).
export async function saveSitePartDraft(key: SitePartKey, data: Data) {
  await requireUser();
  const json = serializePageData(data);
  const now = new Date();
  await db
    .insert(siteParts)
    .values({ key: sitePartSchema.parse(key), draftData: json, updatedAt: now })
    .onConflictDoUpdate({ target: siteParts.key, set: { draftData: json, updatedAt: now } });
  refreshAll();
  return { savedAt: now.toISOString() };
}

export async function publishSitePart(key: SitePartKey, data: Data) {
  await requireUser();
  const json = serializePageData(data);
  const now = new Date();
  await db
    .insert(siteParts)
    .values({ key: sitePartSchema.parse(key), draftData: json, publishedData: json, updatedAt: now, publishedAt: now })
    .onConflictDoUpdate({
      target: siteParts.key,
      set: { draftData: json, publishedData: json, updatedAt: now, publishedAt: now },
    });
  refreshAll();
  return { publishedAt: now.toISOString() };
}

// ---------- Global widgets ----------

const MAX_BLOCK_BYTES = 1024 * 1024;

/** Section settings without Puck's per-instance id. */
function blockProps(props: unknown) {
  if (!props || typeof props !== "object" || Array.isArray(props)) throw new Error("Invalid widget settings.");
  const rest = { ...(props as Record<string, unknown>) };
  delete rest.id;
  const json = JSON.stringify(rest);
  if (json.length > MAX_BLOCK_BYTES) throw new Error("Widget is too large.");
  return json;
}

const createGlobalSchema = z.object({
  name: z.string().trim().min(1, "Give the widget a name.").max(80),
  type: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
});

// Called from the page editor's "Save as global widget" button.
export async function createGlobalBlock(input: { name: string; type: string; props: Record<string, unknown> }) {
  await requireUser();
  const { name, type, props } = createGlobalSchema.parse(input);
  if (!canBeGlobal(config as never, type)) throw new Error("This section can't be saved as a global widget.");

  const json = blockProps(props);
  const now = new Date();
  const [row] = await db
    .insert(globalBlocks)
    .values({ name, type, draftProps: json, publishedProps: json, updatedAt: now, publishedAt: now })
    .returning();
  refreshAll();
  return { id: row.id, name: row.name, type: row.type, props: JSON.parse(json) as Record<string, unknown> };
}

/** The global-widget editor holds one section; pull its settings out and check the type didn't change. */
async function editedBlock(id: number, data: Data) {
  const [row] = await db.select().from(globalBlocks).where(eq(globalBlocks.id, idSchema.parse(id)));
  if (!row) throw new Error("Widget not found.");
  const item = data?.content?.[0];
  if (!item || item.type !== row.type) throw new Error("The widget's section is missing.");
  return { row, json: blockProps(item.props) };
}

export async function saveGlobalBlockDraft(id: number, data: Data) {
  await requireUser();
  const { row, json } = await editedBlock(id, data);
  const now = new Date();
  await db.update(globalBlocks).set({ draftProps: json, updatedAt: now }).where(eq(globalBlocks.id, row.id));
  refreshAll();
  return { savedAt: now.toISOString() };
}

export async function publishGlobalBlock(id: number, data: Data) {
  await requireUser();
  const { row, json } = await editedBlock(id, data);
  const now = new Date();
  await db
    .update(globalBlocks)
    .set({ draftProps: json, publishedProps: json, updatedAt: now, publishedAt: now })
    .where(eq(globalBlocks.id, row.id));
  refreshAll();
  return { publishedAt: now.toISOString() };
}

const renameSchema = z.object({ name: z.string().trim().min(1, "Give the widget a name.").max(80) });

export async function renameGlobalBlock(_: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  const parsed = renameSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.update(globalBlocks).set({ name: parsed.data.name }).where(eq(globalBlocks.id, id));
  refreshAll();
  return { success: `Renamed to "${parsed.data.name}".` };
}

/** Deletes a widget after turning every placed copy into a normal section, so no page loses content. */
export async function deleteGlobalBlock(formData: FormData) {
  await requireUser();
  const id = idSchema.parse(formData.get("id"));
  const [row] = await db.select().from(globalBlocks).where(eq(globalBlocks.id, id));
  if (!row) return;

  const block = { type: row.type, props: JSON.parse(row.publishedProps ?? row.draftProps) as Record<string, unknown> };
  const detach = (json: string | null) => (json ? JSON.stringify(detachGlobal(JSON.parse(json), id, block)) : json);

  for (const page of await db.select().from(pages)) {
    const draftData = detach(page.draftData)!;
    const publishedData = detach(page.publishedData);
    if (draftData !== page.draftData || publishedData !== page.publishedData) {
      await db.update(pages).set({ draftData, publishedData }).where(eq(pages.id, page.id));
    }
  }
  for (const part of await db.select().from(siteParts)) {
    const draftData = detach(part.draftData)!;
    const publishedData = detach(part.publishedData);
    if (draftData !== part.draftData || publishedData !== part.publishedData) {
      await db.update(siteParts).set({ draftData, publishedData }).where(eq(siteParts.key, part.key));
    }
  }

  await db.delete(globalBlocks).where(eq(globalBlocks.id, id));
  refreshAll();
}
