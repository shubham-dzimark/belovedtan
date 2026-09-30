import { readFile } from "node:fs/promises";
import path from "node:path";
import { EXT_TYPES, UPLOAD_NAME } from "@/lib/uploads";

// Serves files uploaded through the editor. Names are random, so they can be cached forever.
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (!UPLOAD_NAME.test(name)) return new Response("Not found", { status: 404 });

  try {
    const body = await readFile(path.join(process.cwd(), "data", "uploads", name));
    return new Response(body, {
      headers: {
        "Content-Type": EXT_TYPES[name.split(".").pop()!],
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
