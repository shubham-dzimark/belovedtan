import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { MAX_UPLOAD_BYTES, UPLOAD_TYPES } from "@/lib/uploads";

// Uploads an image or video from the page editor. Admins only.
export async function POST(req: NextRequest) {
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const ext = UPLOAD_TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Use a JPG, PNG, WebP, GIF, AVIF, MP4 or WebM file." },
      { status: 415 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Files must be 50 MB or smaller." }, { status: 413 });
  }

  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  // Paths are spelled out inline so the bundler only traces data/uploads.
  await mkdir(path.join(process.cwd(), "data", "uploads"), { recursive: true });
  await writeFile(path.join(process.cwd(), "data", "uploads", name), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ url: `/uploads/${name}` });
}
