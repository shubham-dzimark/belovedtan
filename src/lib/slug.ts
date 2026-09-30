const RESERVED = new Set(["admin", "api", "uploads", "_next"]);

/** Turns user input like "/About Us/" into "about-us". "" is the home page. */
export function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .split("/")
    .map((part) =>
      part
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
    )
    .filter(Boolean)
    .join("/");
}

export function slugError(slug: string) {
  if (RESERVED.has(slug.split("/")[0])) {
    return `"/${slug}" is reserved. Choose a different URL.`;
  }
  return null;
}

export function pagePath(slug: string) {
  return `/${slug}`;
}
