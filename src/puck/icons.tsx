import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const featureIcons = {
  chat: (
    <svg {...base}>
      <path d="M4 17.5V9a7 7 0 0 1 14 0 7 7 0 0 1-7 7H7.5L4 19.5z" />
      <path d="M14 20a6 6 0 0 0 6-6" />
    </svg>
  ),
  briefcase: (
    <svg {...base}>
      <rect x="3" y="7" width="18" height="13" rx="1.5" />
      <path d="M8.5 7V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v2M8 7v13M16 7v13" />
    </svg>
  ),
  heart: (
    <svg {...base}>
      <path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.6 12 20 12 20z" />
      <path d="M8.5 12.5 11 15l4.5-4.5" />
    </svg>
  ),
  celebrate: (
    <svg {...base}>
      <path d="M4 20 8.5 8.5l7 7z" />
      <path d="M14 4v2M19 9h-2M17.5 5.5l-1.5 1.5M20 14l-1.5-.5M10 3.5l.5 1.5" />
    </svg>
  ),
  leaf: (
    <svg {...base}>
      <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z" />
      <path d="M5 19 13 11" />
    </svg>
  ),
  sun: (
    <svg {...base}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  ),
  drop: (
    <svg {...base}>
      <path d="M12 3.5s6 6.3 6 10.5a6 6 0 0 1-12 0c0-4.2 6-10.5 6-10.5z" />
    </svg>
  ),
  star: (
    <svg {...base}>
      <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  ),
  stones: (
    <svg {...base}>
      <ellipse cx="12" cy="18.5" rx="7" ry="2" />
      <ellipse cx="12" cy="14.5" rx="5" ry="1.8" />
      <ellipse cx="12" cy="11" rx="3.2" ry="1.4" />
      <path d="M12 3v3M8.5 4.5l1 2M15.5 4.5l-1 2" />
    </svg>
  ),
  pulse: (
    <svg {...base}>
      <path d="M2.5 12h4l1.5-4 2.5 9 2.5-12 2 10 1.5-3h5" />
    </svg>
  ),
  pool: (
    <svg {...base}>
      <path d="M8 16V5.5a1.5 1.5 0 0 1 3 0M14 16V5.5a1.5 1.5 0 0 1 3 0M8 9h6M8 12.5h6" />
      <path d="M3 17.5c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <path d="M3 20.5c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
    </svg>
  ),
} as const;

export type FeatureIcon = keyof typeof featureIcons | "none";

export const featureIconOptions = [
  { label: "Chat", value: "chat" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Heart", value: "heart" },
  { label: "Celebrate", value: "celebrate" },
  { label: "Leaf", value: "leaf" },
  { label: "Sun", value: "sun" },
  { label: "Drop", value: "drop" },
  { label: "Star", value: "star" },
  { label: "Stones", value: "stones" },
  { label: "Pulse", value: "pulse" },
  { label: "Pool", value: "pool" },
  { label: "None", value: "none" },
] satisfies { label: string; value: FeatureIcon }[];

export function Arrow() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M0 5h12.5M8.5 1l4 4-4 4" />
    </svg>
  );
}

export function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M2 7.5 5.5 11 12 3" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

const social: SVGProps<SVGSVGElement> = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const socialIcons = {
  facebook: (
    <svg {...social}>
      <path d="M14.5 3.5h-2a3.5 3.5 0 0 0-3.5 3.5v3H7v3.5h2v7h3.5v-7H15l.5-3.5h-3V7.5a1 1 0 0 1 1-1h2z" />
    </svg>
  ),
  instagram: (
    <svg {...social}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r=".6" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg {...social}>
      <path d="M13 3.5v11.5a3.5 3.5 0 1 1-3.5-3.5M13 3.5c.5 2.7 2.4 4.5 5 4.8" />
    </svg>
  ),
  linkedin: (
    <svg {...social}>
      <path d="M5 9.5v10M5 5.2v.1M9.5 19.5v-10M9.5 13.5a4 4 0 0 1 8 0v6" />
    </svg>
  ),
  youtube: (
    <svg {...social}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9 5 3-5 3z" />
    </svg>
  ),
  x: (
    <svg {...social}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  ),
} as const;

export type SocialNetwork = keyof typeof socialIcons;
