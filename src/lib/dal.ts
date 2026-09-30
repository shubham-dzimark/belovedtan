import "server-only";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { decrypt, SESSION_COOKIE } from "./session";

/**
 * Returns the signed-in admin, or redirects to the login page.
 * Call this in every admin page and every server action: the proxy is only
 * an optimistic first line of defence.
 */
export const requireUser = cache(async () => {
  const session = await decrypt((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session?.userId) redirect("/admin/login");

  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user) redirect("/admin/login");
  return user;
});
