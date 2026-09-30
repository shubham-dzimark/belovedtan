"use client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { createTheme, MantineProvider, type MantineColorsTuple } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import type { ReactNode } from "react";

// Brand violet, matching the site's accent buttons.
const brand: MantineColorsTuple = [
  "#f4efff",
  "#e4dbfa",
  "#c6b3f1",
  "#a688e9",
  "#8b64e2",
  "#7a4dde",
  "#7141dd",
  "#6d28d9",
  "#5424ad",
  "#471f92",
];

const theme = createTheme({
  primaryColor: "brand",
  colors: { brand },
  primaryShade: { light: 7, dark: 5 },
  defaultRadius: "md",
  fontFamily: "var(--font-geist-sans), system-ui, -apple-system, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, 'Segoe UI', sans-serif",
    fontWeight: "650",
  },
  cursorType: "pointer",
  components: {
    Paper: { defaultProps: { withBorder: true } },
    Card: { defaultProps: { withBorder: true } },
    Table: { defaultProps: { verticalSpacing: "sm", highlightOnHover: true } },
    TextInput: { defaultProps: { size: "md" } },
    PasswordInput: { defaultProps: { size: "md" } },
  },
});

/**
 * Mantine styles + providers for the admin screens (dashboard, forms, login).
 * The full-screen Puck editor and previews deliberately stay outside this.
 */
export function MantineRoot({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <ModalsProvider>
        <Notifications position="top-right" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
