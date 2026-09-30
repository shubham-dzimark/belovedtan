// Fonts offered in the editor. "jost" is self-hosted through next/font; the rest load from Google Fonts on demand.
export const FONTS = {
  jost: { label: "Jost (default)", family: "var(--font-jost), 'Jost', sans-serif", google: null },
  montserrat: { label: "Montserrat", family: "'Montserrat', sans-serif", google: "Montserrat:wght@300;400;500;600;700" },
  poppins: { label: "Poppins", family: "'Poppins', sans-serif", google: "Poppins:wght@300;400;500;600;700" },
  inter: { label: "Inter", family: "'Inter', sans-serif", google: "Inter:wght@300;400;500;600;700" },
  dmsans: { label: "DM Sans", family: "'DM Sans', sans-serif", google: "DM+Sans:wght@300;400;500;600;700" },
  raleway: { label: "Raleway", family: "'Raleway', sans-serif", google: "Raleway:wght@300;400;500;600;700" },
  josefin: { label: "Josefin Sans", family: "'Josefin Sans', sans-serif", google: "Josefin+Sans:wght@300;400;500;600;700" },
  worksans: { label: "Work Sans", family: "'Work Sans', sans-serif", google: "Work+Sans:wght@300;400;500;600;700" },
  oswald: { label: "Oswald", family: "'Oswald', sans-serif", google: "Oswald:wght@300;400;500;600;700" },
  bebas: { label: "Bebas Neue", family: "'Bebas Neue', sans-serif", google: "Bebas+Neue" },
  playfair: { label: "Playfair Display", family: "'Playfair Display', serif", google: "Playfair+Display:wght@400;500;600;700" },
  cormorant: { label: "Cormorant Garamond", family: "'Cormorant Garamond', serif", google: "Cormorant+Garamond:wght@300;400;500;600;700" },
  lora: { label: "Lora", family: "'Lora', serif", google: "Lora:wght@400;500;600;700" },
  baskerville: { label: "Libre Baskerville", family: "'Libre Baskerville', serif", google: "Libre+Baskerville:wght@400;700" },
} as const;

export type FontKey = keyof typeof FONTS;

export const fontOptions = (Object.keys(FONTS) as FontKey[]).map((value) => ({
  label: FONTS[value].label,
  value,
}));

export function fontFamily(key: string | undefined) {
  return key && key in FONTS ? FONTS[key as FontKey].family : undefined;
}

/** Google Fonts stylesheet URL for the given fonts, or null if none need loading. */
export function googleFontsUrl(keys: (string | undefined)[]) {
  const families = [...new Set(keys)]
    .map((key) => (key && key in FONTS ? FONTS[key as FontKey].google : null))
    .filter(Boolean);
  if (families.length === 0) return null;
  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
}
