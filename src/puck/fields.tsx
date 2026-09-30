import type { CustomField, Field } from "@puckeditor/core";
import type { CSSProperties } from "react";
import { ColorInput } from "./color-field";
import { fontFamily, fontOptions, type FontKey } from "./fonts";
import { MediaInput } from "./image-field";

export function imageField(label = "Image"): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <MediaInput label={label} value={value ?? ""} onChange={onChange} readOnly={readOnly} accept="image/*" />
    ),
  };
}

export function videoField(label = "Background video (optional)"): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <MediaInput
        label={label}
        value={value ?? ""}
        onChange={onChange}
        readOnly={readOnly}
        accept="video/mp4,video/webm"
      />
    ),
  };
}

export const text = (label: string, contentEditable = false): Field<string> => ({
  type: "text",
  label,
  contentEditable,
});

export const textarea = (label: string, contentEditable = false): Field<string> => ({
  type: "textarea",
  label,
  contentEditable,
});

export const number = (label: string, min?: number, max?: number): Field<number> => ({
  type: "number",
  label,
  min,
  max,
});

export const toggle = (label: string): Field<boolean> => ({
  type: "radio",
  label,
  options: [
    { label: "On", value: true },
    { label: "Off", value: false },
  ],
});

export type ButtonStyle = "outline-light" | "light" | "dark" | "outline-dark" | "accent";

export const buttonStyleField = (label = "Button style"): Field<ButtonStyle> => ({
  type: "select",
  label,
  options: [
    { label: "Outline (white)", value: "outline-light" },
    { label: "Solid white", value: "light" },
    { label: "Solid black", value: "dark" },
    { label: "Outline (black)", value: "outline-dark" },
    { label: "Accent (gold)", value: "accent" },
  ],
});

export type Link = { label: string; href: string };

export const linkArray = (label: string): Field<Link[]> => ({
  type: "array",
  label,
  arrayFields: { label: text("Label"), href: text("Link") },
  defaultItemProps: { label: "New link", href: "#" },
  getItemSummary: (item) => item.label || "Link",
});

/** Turns "line one\nline two" into separate lines, since textarea values are plain text. */
export function lines(value: string | undefined) {
  return (value ?? "").split("\n").filter((line) => line.trim() !== "");
}

export function colorField(label: string): CustomField<string> {
  return {
    type: "custom",
    label,
    render: ({ value, onChange, readOnly }) => (
      <ColorInput label={label} value={value ?? ""} onChange={onChange} readOnly={readOnly} />
    ),
  };
}

export const fontField = (label: string, withDefault = false): Field<FontKey | ""> => ({
  type: "select",
  label,
  options: withDefault ? [{ label: "Page default", value: "" }, ...fontOptions] : fontOptions,
});

export const weightOptions = [
  { label: "Default", value: 0 },
  { label: "Light (300)", value: 300 },
  { label: "Regular (400)", value: 400 },
  { label: "Medium (500)", value: 500 },
  { label: "Semibold (600)", value: 600 },
  { label: "Bold (700)", value: 700 },
];

// ---------- Per-section typography ----------

export type SectionTypography = {
  headingFont: FontKey | "";
  headingSize: number;
  headingWeight: number;
  headingColor: string;
  textSize: number;
  textColor: string;
  labelColor: string;
};

export const defaultTypography: SectionTypography = {
  headingFont: "",
  headingSize: 0,
  headingWeight: 0,
  headingColor: "",
  textSize: 0,
  textColor: "",
  labelColor: "",
};

export const typographyField: Field<SectionTypography> = {
  type: "object",
  label: "Typography (blank or 0 = page default)",
  objectFields: {
    headingFont: fontField("Heading font", true),
    headingSize: number("Heading size (px at desktop width)", 0, 200),
    headingWeight: { type: "select", label: "Heading weight", options: weightOptions },
    headingColor: colorField("Heading color"),
    textSize: number("Text size (px)", 0, 40),
    textColor: colorField("Text color"),
    labelColor: colorField("Small label color"),
  },
};

/** Responsive size: the chosen px at 1920px wide, scaling down on smaller screens. */
export function fluid(px: number, minRatio = 0.55) {
  return `clamp(${Math.round(px * minRatio)}px, ${(px / 19.2).toFixed(2)}vw, ${px}px)`;
}

/** CSS custom properties read by landing.css to apply one section's typography. */
export function typographyVars(t: Partial<SectionTypography> | undefined): CSSProperties {
  const vars: Record<string, string | number> = {};
  if (!t) return vars;
  if (t.headingFont) vars["--lp-sec-h-font"] = fontFamily(t.headingFont) ?? "";
  if (t.headingSize) vars["--lp-sec-h-size"] = fluid(t.headingSize);
  if (t.headingWeight) vars["--lp-sec-h-weight"] = t.headingWeight;
  if (t.headingColor) vars["--lp-sec-h-color"] = t.headingColor;
  if (t.textSize) vars["--lp-sec-text-size"] = `${t.textSize}px`;
  if (t.textColor) vars["--lp-sec-text-color"] = t.textColor;
  if (t.labelColor) vars["--lp-sec-label-color"] = t.labelColor;
  return vars as CSSProperties;
}

// ---------- Entrance animations ----------

export type SectionAnimation = "" | "none" | "fade-up" | "fade-in" | "slide-left" | "slide-right" | "zoom";

export const animationOptions = [
  { label: "Fade up", value: "fade-up" },
  { label: "Fade in", value: "fade-in" },
  { label: "Slide in from left", value: "slide-left" },
  { label: "Slide in from right", value: "slide-right" },
  { label: "Zoom in", value: "zoom" },
  { label: "None", value: "none" },
] satisfies { label: string; value: SectionAnimation }[];

export const animationField: Field<SectionAnimation> = {
  type: "select",
  label: "Entrance animation (plays when scrolled into view)",
  options: [{ label: "Page default", value: "" }, ...animationOptions],
};
