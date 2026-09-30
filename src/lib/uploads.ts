import "server-only";
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

// SVG is deliberately excluded: it can carry scripts.
export const UPLOAD_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const EXT_TYPES = Object.fromEntries(
  Object.entries(UPLOAD_TYPES).map(([type, ext]) => [ext, type]),
);

export const UPLOAD_NAME = /^[a-f0-9]{32}\.(jpg|png|webp|gif|avif|mp4|webm)$/;
