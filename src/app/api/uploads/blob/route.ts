import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { MAX_UPLOAD_BYTES, UPLOAD_TYPES, uploadMode } from "@/lib/uploads";

/**
 * Vercel Blob client uploads: the editor asks this route for a short-lived upload token, then
 * sends the file straight to Blob storage (so large files skip Vercel's request-size limit).
 * Only signed-in admins get a token, and only for the allowed image/video types and size.
 */
export async function POST(req: NextRequest) {
  if (uploadMode() !== "blob") {
    return NextResponse.json({ error: "Blob storage isn't configured." }, { status: 400 });
  }
  const session = await decrypt(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session?.userId) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const body = (await req.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: Object.keys(UPLOAD_TYPES),
        maximumSizeInBytes: MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
