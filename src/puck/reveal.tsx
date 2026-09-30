"use client";

import { useEffect } from "react";

/**
 * Marks each landing section with `lp-in` the first time it scrolls into view,
 * which starts its entrance animation (see "Entrance animations" in landing.css).
 */
export function ScrollReveal() {
  useEffect(() => {
    // Tells the boot script's safety timer that animations are running.
    (window as { __lpRevealReady?: boolean }).__lpRevealReady = true;
    document.documentElement.classList.add("lp-js");
    const sections = [...document.querySelectorAll<HTMLElement>(".lp-page .lp:not(.lp-in)")];

    if (!("IntersectionObserver" in window)) {
      sections.forEach((el) => el.classList.add("lp-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("lp-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

/**
 * Runs before the sections are parsed so hidden-until-visible styles apply on the very
 * first paint (no flash of content). Without JavaScript, nothing is hidden.
 *
 * Safety net: if the page's scripts fail to load (blocked, offline, slow network), ScrollReveal
 * never starts and content would stay hidden. After 2.5s without it, drop `lp-js` so every
 * section simply shows without animation.
 */
export const REVEAL_BOOT_SCRIPT = `document.documentElement.classList.add("lp-js");
setTimeout(function () {
  if (!window.__lpRevealReady) document.documentElement.classList.remove("lp-js");
}, 2500);`;
