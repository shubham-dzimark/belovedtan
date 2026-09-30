"use client";

import { FieldLabel } from "@puckeditor/core";
import { useId, useState } from "react";

const isVideo = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url);

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "video/mp4", "video/webm"];
const MAX_BYTES = 50 * 1024 * 1024;

// Asked once per editor session: "blob" when hosted with Vercel Blob, "local" otherwise.
let uploadModePromise: Promise<"blob" | "local"> | null = null;
function getUploadMode() {
  uploadModePromise ??= fetch("/api/uploads")
    .then((res) => res.json() as Promise<{ mode?: "blob" | "local" }>)
    .then((json) => json.mode ?? "local")
    .catch(() => "local" as const);
  return uploadModePromise;
}

async function uploadFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error("Use a JPG, PNG, WebP, GIF, AVIF, MP4 or WebM file.");
  if (file.size > MAX_BYTES) throw new Error("Files must be 50 MB or smaller.");

  if ((await getUploadMode()) === "blob") {
    // Straight from the browser to Vercel Blob, using a token from /api/uploads/blob.
    const { upload } = await import("@vercel/blob/client");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "") || "upload";
    const blob = await upload(`uploads/${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/uploads/blob",
      contentType: file.type,
    });
    return blob.url;
  }

  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  const json = (await res.json()) as { url?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Upload failed.");
  return json.url;
}

/** Puck field: paste a URL or upload an image/video from your computer. */
export function MediaInput({
  label,
  value,
  onChange,
  accept,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept: string;
  readOnly?: boolean;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      onChange(await uploadFile(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FieldLabel label={label} el="div">
      <div style={{ display: "grid", gap: 8 }}>
        {value &&
          (isVideo(value) ? (
            <video src={value} muted style={previewStyle} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" style={previewStyle} />
          ))}
        <input
          type="text"
          value={value}
          placeholder="https://… or upload"
          readOnly={readOnly}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <label htmlFor={inputId} style={buttonStyle} aria-disabled={busy || readOnly}>
            {busy ? "Uploading…" : "Upload"}
          </label>
          <input
            id={inputId}
            type="file"
            accept={accept}
            disabled={busy || readOnly}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void upload(file);
              e.target.value = "";
            }}
          />
          {value && !readOnly && (
            <button type="button" style={buttonStyle} onClick={() => onChange("")}>
              Remove
            </button>
          )}
        </div>
        {error && <span style={{ color: "#dc2626", fontSize: 12 }}>{error}</span>}
      </div>
    </FieldLabel>
  );
}

const previewStyle = {
  width: "100%",
  maxHeight: 140,
  objectFit: "cover",
  borderRadius: 4,
  background: "#f3f4f6",
} as const;

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  font: "inherit",
  fontSize: 13,
} as const;

const buttonStyle = {
  padding: "6px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
} as const;
