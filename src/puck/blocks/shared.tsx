import { Fragment, type CSSProperties, type ReactNode } from "react";
import { colorField, type ButtonStyle } from "../fields";
import { Arrow } from "../icons";

export function Btn({ label, href, variant }: { label: string; href: string; variant: ButtonStyle }) {
  if (!label) return null;
  return (
    <a href={href || "#"} className={`lp-btn lp-btn--${variant}`}>
      {label}
    </a>
  );
}

export function ArrowLink({ label, href, className = "" }: { label: string; href: string; className?: string }) {
  if (!label) return null;
  return (
    <a href={href || "#"} className={`lp-arrow ${className}`}>
      {label} <Arrow />
    </a>
  );
}

/** Renders text with line breaks where the editor typed them. */
export function Multiline({ text }: { text: string | ReactNode }) {
  // Fields with inline (on-canvas) editing arrive as a React element inside the editor.
  if (typeof text !== "string") return <>{text}</>;
  const parts = text.split("\n");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** Full-bleed background image (or looping video) with a color overlay. */
export function Backdrop({
  image,
  video,
  overlayColor = "#000000",
  overlayOpacity = 40,
}: {
  image?: string;
  video?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}) {
  return (
    <div className="lp-backdrop" aria-hidden>
      {video ? (
        <video src={video} poster={image || undefined} autoPlay muted loop playsInline />
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" />
      ) : null}
      <span style={{ background: overlayColor, opacity: overlayOpacity / 100 }} />
    </div>
  );
}

export function Img({ src, alt = "", style }: { src: string; alt?: string; style?: CSSProperties }) {
  if (!src) return <div className="lp-img-empty" style={style} />;
  // Image URLs are entered freely in the editor, so next/image remote patterns don't apply.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={style} loading="lazy" />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  if (!children) return null;
  return <p className="lp-eyebrow">{children}</p>;
}

export const overlayFields = {
  overlayColor: colorField("Overlay color"),
  overlayOpacity: { type: "number", label: "Overlay darkness (0–100)", min: 0, max: 100 } as const,
};
