"use client";

import { useRef, type ReactNode } from "react";
import { Arrow } from "../icons";

/** Horizontal scroller with a "next" arrow, used by the social feed. */
export function ScrollRow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const next = () => {
    const el = ref.current;
    if (!el) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="lp-scroll">
      <div ref={ref} className="lp-scroll-track">
        {children}
      </div>
      <button type="button" className="lp-scroll-next" onClick={next} aria-label="Show more">
        <Arrow />
      </button>
    </div>
  );
}
