import { asc } from "drizzle-orm";
import type { Metadata } from "next";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireUser } from "@/lib/dal";
import { UsersScreen } from "./user-forms";

export const metadata: Metadata = { title: "Users" };

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default async function UsersPage() {
  const me = await requireUser();
  const rows = await db
    .select({ id: users.id, name: users.name, email: users.email, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.createdAt));

  return (
    <UsersScreen
      meId={me.id}
      users={rows.map((u) => ({ id: u.id, name: u.name, email: u.email, added: dateFormat.format(u.createdAt) }))}
    />
  );
}
