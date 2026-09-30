import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import type { Metadata } from "next";
import "./globals.css";
import "@/puck/landing.css";
import { DEV_EXTENSION_CLEANUP_SCRIPT } from "./dev-extension-cleanup";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: { default: "BelovedTan", template: "%s | BelovedTan" },
  description: "BelovedTan",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables} {...mantineHtmlProps}>
      <head>
        {process.env.NODE_ENV === "development" && (
          // Must run before React hydrates, so it's an inline script at the top of <head>.
          <script dangerouslySetInnerHTML={{ __html: DEV_EXTENSION_CLEANUP_SCRIPT }} />
        )}
        {/* Applies the admin panel's light/dark choice before paint (no effect on the public site). */}
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>{children}</body>
    </html>
  );
}
