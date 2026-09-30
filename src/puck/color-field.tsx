"use client";

import { FieldLabel } from "@puckeditor/core";
import { useState } from "react";

const SWATCHES = [
  "#000000",
  "#ffffff",
  "#111111",
  "#6b7280",
  "#e8e8e8",
  "#c9a063",
  "#6d28d9",
  "#2a0a4a",
  "#0b3a66",
  "#1a0f08",
];

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

function toSixDigits(hex: string) {
  if (!HEX.test(hex)) return "#000000";
  if (hex.length === 4) return `#${[...hex.slice(1)].map((c) => c + c).join("")}`;
  return hex;
}

/** Puck field: color picker + hex input + preset swatches. Empty means "use the default". */
export function ColorInput({
  label,
  value,
  onChange,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  // While typing, show the draft so half-typed hex values aren't saved; otherwise show the saved value.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? value ?? "";

  return (
    <FieldLabel label={label} el="div">
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ ...swatchStyle, width: 36, height: 36, background: value || checkerboard }} title="Pick a color">
            <input
              type="color"
              value={toSixDigits(value)}
              disabled={readOnly}
              onChange={(e) => onChange(e.target.value)}
              style={{ opacity: 0, width: "100%", height: "100%", cursor: "pointer", border: 0, padding: 0 }}
            />
          </label>
          <input
            type="text"
            value={text}
            placeholder="Default"
            readOnly={readOnly}
            onChange={(e) => {
              setDraft(e.target.value);
              if (e.target.value === "" || HEX.test(e.target.value)) onChange(e.target.value);
            }}
            onBlur={() => setDraft(null)}
            style={inputStyle}
          />
          {value && !readOnly && (
            <button type="button" onClick={() => onChange("")} style={clearStyle} title="Use default color">
              Clear
            </button>
          )}
        </div>
        {!readOnly && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {SWATCHES.map((swatch) => (
              <button
                key={swatch}
                type="button"
                title={swatch}
                aria-label={`Use ${swatch}`}
                onClick={() => onChange(swatch)}
                style={{
                  ...swatchStyle,
                  background: swatch,
                  outline: value?.toLowerCase() === swatch ? "2px solid #2563eb" : "none",
                  outlineOffset: 1,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </FieldLabel>
  );
}

const checkerboard = "repeating-conic-gradient(#e5e7eb 0 25%, #ffffff 0 50%) 50% / 10px 10px";

const swatchStyle = {
  display: "block",
  width: 22,
  height: 22,
  padding: 0,
  border: "1px solid #d1d5db",
  borderRadius: 4,
  cursor: "pointer",
  overflow: "hidden",
  flexShrink: 0,
} as const;

const inputStyle = {
  flex: 1,
  minWidth: 0,
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  font: "inherit",
  fontSize: 13,
} as const;

const clearStyle = {
  padding: "7px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
} as const;
