import { Geist, Jost } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Geometric sans used by the landing-page sections.
export const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const fontVariables = `${geistSans.variable} ${jost.variable}`;
