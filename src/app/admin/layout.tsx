import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | BelovedTan Admin" },
  robots: { index: false, follow: false },
};

// Mantine is loaded by the (panel) and login layouts only; the full-screen editor and
// previews render without it so its global styles never touch the Puck canvas.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
