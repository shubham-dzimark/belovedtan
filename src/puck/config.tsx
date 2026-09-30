import type { Config, Data, Slot } from "@puckeditor/core";
import type { CSSProperties } from "react";
import {
  OfferCards,
  FeatureColumns,
  FullImage,
  Locations,
  ServiceListHero,
  type FeatureColumnsProps,
  type FullImageProps,
  type LocationsProps,
  type OfferCardsProps,
  type ServiceListHeroProps,
} from "./blocks/middle";
import {
  ProductShowcase,
  PromoBanner,
  SiteFooter,
  SocialFeed,
  type ProductShowcaseProps,
  type PromoBannerProps,
  type SiteFooterProps,
  type SocialFeedProps,
} from "./blocks/bottom";
import {
  HeroBanner,
  IntroLinks,
  ServicesShowcase,
  SiteHeader,
  type HeroBannerProps,
  type IntroLinksProps,
  type ServicesShowcaseProps,
  type SiteHeaderProps,
} from "./blocks/top";
import {
  IconStrip,
  PageHero,
  ServiceIntro,
  SplitFeature,
  type IconStripProps,
  type PageHeroProps,
  type ServiceIntroProps,
  type SplitFeatureProps,
} from "./blocks/service";
import {
  animationOptions,
  colorField,
  fluid,
  fontField,
  imageField,
  weightOptions,
  type SectionAnimation,
} from "./fields";
import { REVEAL_BOOT_SCRIPT, ScrollReveal } from "./reveal";
import { fontFamily, googleFontsUrl, type FontKey } from "./fonts";

type Align = "left" | "center" | "right";
type TextCase = "" | "uppercase" | "none" | "capitalize";

// Pages saved before these settings existed have none of them, so rootVars() treats every value as optional.
export type RootProps = {
  title: string;
  bodyFont: FontKey | "";
  headingFont: FontKey | "";
  headingWeight: number;
  headingTracking: number;
  headingCase: TextCase;
  headingScale: number;
  bodySize: number;
  textColor: string;
  pageBackground: string;
  accentColor: string;
  animation: SectionAnimation;
  animationDuration: number;
  animationStagger: number;
  showHeader: boolean;
  showFooter: boolean;
};

// Starting offset for each entrance animation; sections can override it with data-anim (landing.css).
const ANIMATION_FROM: Record<string, string> = {
  "fade-up": "translateY(48px)",
  "fade-in": "none",
  "slide-left": "translateX(-64px)",
  "slide-right": "translateX(64px)",
  zoom: "scale(0.92)",
};

const caseField = (label: string) =>
  ({
    type: "select",
    label,
    options: [
      { label: "Default", value: "" },
      { label: "UPPERCASE", value: "uppercase" },
      { label: "Normal", value: "none" },
      { label: "Capitalize Each Word", value: "capitalize" },
    ],
  }) as const;

/** Page-wide typography as CSS variables that every section reads. Unset values keep the defaults. */
function rootVars(p: Partial<RootProps>) {
  const vars: Record<string, string | number> = {};
  if (p.bodyFont) vars["--lp-body-font"] = fontFamily(p.bodyFont) ?? "";
  if (p.headingFont) vars["--lp-heading-font"] = fontFamily(p.headingFont) ?? "";
  if (p.headingWeight) vars["--lp-heading-weight"] = p.headingWeight;
  if (typeof p.headingTracking === "number") vars["--lp-heading-tracking"] = `${p.headingTracking / 100}em`;
  if (p.headingCase) vars["--lp-heading-transform"] = p.headingCase;
  if (p.headingScale) vars["--lp-heading-scale"] = p.headingScale / 100;
  if (p.bodySize) vars["--lp-body-size"] = `${p.bodySize}px`;
  if (p.accentColor) vars["--lp-accent"] = p.accentColor;
  if (p.bodyFont) vars.fontFamily = fontFamily(p.bodyFont) ?? "";
  if (p.textColor) vars.color = p.textColor;
  if (p.pageBackground) vars.background = p.pageBackground;
  if (p.animation && ANIMATION_FROM[p.animation]) vars["--lp-from"] = ANIMATION_FROM[p.animation];
  if (p.animationDuration) vars["--lp-anim-dur"] = `${p.animationDuration}ms`;
  if (typeof p.animationStagger === "number") vars["--lp-stagger"] = `${p.animationStagger}ms`;
  return vars as CSSProperties;
}

type Props = {
  SiteHeader: SiteHeaderProps;
  HeroBanner: HeroBannerProps;
  IntroLinks: IntroLinksProps;
  ServicesShowcase: ServicesShowcaseProps;
  OfferCards: OfferCardsProps;
  ServiceListHero: ServiceListHeroProps;
  FeatureColumns: FeatureColumnsProps;
  FullImage: FullImageProps;
  Locations: LocationsProps;
  PromoBanner: PromoBannerProps;
  ProductShowcase: ProductShowcaseProps;
  SocialFeed: SocialFeedProps;
  SiteFooter: SiteFooterProps;
  PageHero: PageHeroProps;
  IconStrip: IconStripProps;
  ServiceIntro: ServiceIntroProps;
  SplitFeature: SplitFeatureProps;
  Section: {
    content: Slot;
    background: string;
    paddingY: number;
    maxWidth: number;
  };
  Columns: {
    left: Slot;
    right: Slot;
    gap: number;
    ratio: "1:1" | "1:2" | "2:1";
  };
  Heading: {
    text: string;
    level: "h1" | "h2" | "h3" | "h4";
    align: Align;
    color: string;
    font: FontKey | "";
    size: number;
    weight: number;
    letterSpacing: number;
    transform: TextCase;
    lineHeight: number;
  };
  Text: {
    text: string;
    align: Align;
    color: string;
    size: number;
    font: FontKey | "";
    weight: number;
    lineHeight: number;
    letterSpacing: number;
  };
  Button: {
    label: string;
    href: string;
    variant: "primary" | "outline";
    align: Align;
    background: string;
    textColor: string;
  };
  Image: {
    src: string;
    alt: string;
    width: number;
    radius: number;
  };
  Spacer: {
    height: number;
  };
  Divider: {
    color: string;
    thickness: number;
    style: "solid" | "dashed" | "dotted";
  };
};

const alignField = {
  type: "radio",
  label: "Alignment",
  options: [
    { label: "Left", value: "left" },
    { label: "Center", value: "center" },
    { label: "Right", value: "right" },
  ],
} as const;

const ratioColumns = {
  "1:1": "1fr 1fr",
  "1:2": "1fr 2fr",
  "2:1": "2fr 1fr",
};

export type PageData = Data<Props, RootProps>;

export const config: Config<Props, RootProps> = {
  root: {
    fields: {
      title: { type: "text", label: "Page title (browser tab uses the title from page settings)" },
      bodyFont: fontField("Body font"),
      headingFont: fontField("Heading font", true),
      headingWeight: { type: "select", label: "Heading weight", options: weightOptions },
      headingTracking: { type: "number", label: "Heading letter spacing (% of size, e.g. 10)", min: -10, max: 50 },
      headingCase: caseField("Heading capitalization"),
      headingScale: { type: "number", label: "Heading size scale (%, 100 = default)", min: 50, max: 200 },
      bodySize: { type: "number", label: "Body text size (px)", min: 10, max: 30 },
      textColor: colorField("Text color"),
      pageBackground: colorField("Page background"),
      accentColor: colorField("Accent color (gold details, prices)"),
      animation: {
        type: "select",
        label: "Entrance animations (sections animate in on scroll)",
        options: animationOptions,
      },
      animationDuration: { type: "number", label: "Animation duration (ms)", min: 100, max: 3000 },
      animationStagger: { type: "number", label: "Delay between items (ms)", min: 0, max: 1000 },
      showHeader: {
        type: "radio",
        label: "Show site header",
        options: [
          { label: "Show", value: true },
          { label: "Hide", value: false },
        ],
      },
      showFooter: {
        type: "radio",
        label: "Show site footer",
        options: [
          { label: "Show", value: true },
          { label: "Hide", value: false },
        ],
      },
    },
    defaultProps: {
      title: "",
      bodyFont: "jost",
      headingFont: "",
      headingWeight: 0,
      headingTracking: 10,
      headingCase: "",
      headingScale: 100,
      bodySize: 0,
      textColor: "",
      pageBackground: "",
      accentColor: "",
      animation: "fade-up",
      animationDuration: 900,
      animationStagger: 110,
      showHeader: true,
      showFooter: true,
    },
    render: ({ children, puck, bodyFont, headingFont, ...rest }) => {
      const fontsUrl = googleFontsUrl([bodyFont, headingFont]);
      // Animations only run on the live site/preview, never in the editor canvas.
      const animate = !puck?.isEditing && rest.animation !== "none";
      return (
        <div
          className={`lp-page${animate ? " lp-page--animate" : ""}`}
          style={rootVars({ bodyFont, headingFont, ...rest })}
        >
          {animate && <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOT_SCRIPT }} />}
          {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}
          {children}
          {animate && <ScrollReveal />}
        </div>
      );
    },
  },
  categories: {
    sections: {
      title: "Page sections",
      components: [
        "HeroBanner",
        "PageHero",
        "IntroLinks",
        "ServicesShowcase",
        "OfferCards",
        "ServiceListHero",
        "FeatureColumns",
        "FullImage",
        "Locations",
        "IconStrip",
        "ServiceIntro",
        "SplitFeature",
        "PromoBanner",
        "ProductShowcase",
        "SocialFeed",
      ],
    },
    layout: { title: "Layout", components: ["Section", "Columns", "Spacer", "Divider"] },
    basic: { title: "Basic", components: ["Heading", "Text", "Button", "Image"] },
    // Anything not listed above (the site header and footer) is hidden from the page editor.
    other: { visible: false },
  },
  components: {
    SiteHeader,
    HeroBanner,
    IntroLinks,
    ServicesShowcase,
    OfferCards,
    ServiceListHero,
    FeatureColumns,
    FullImage,
    Locations,
    PromoBanner,
    ProductShowcase,
    SocialFeed,
    SiteFooter,
    PageHero,
    IconStrip,
    ServiceIntro,
    SplitFeature,
    Section: {
      fields: {
        content: { type: "slot" },
        background: colorField("Background color"),
        paddingY: { type: "number", label: "Vertical padding (px)", min: 0 },
        maxWidth: { type: "number", label: "Max width (px)", min: 0 },
      },
      defaultProps: {
        content: [],
        background: "#ffffff",
        paddingY: 48,
        maxWidth: 1140,
      },
      render: ({ content: Content, background, paddingY, maxWidth }) => (
        <section style={{ background, padding: `${paddingY}px 16px` }}>
          <Content style={{ maxWidth, margin: "0 auto", minHeight: 40 }} />
        </section>
      ),
    },
    Columns: {
      fields: {
        left: { type: "slot" },
        right: { type: "slot" },
        ratio: {
          type: "select",
          label: "Column ratio",
          options: [
            { label: "50 / 50", value: "1:1" },
            { label: "33 / 67", value: "1:2" },
            { label: "67 / 33", value: "2:1" },
          ],
        },
        gap: { type: "number", label: "Gap (px)", min: 0 },
      },
      defaultProps: { left: [], right: [], ratio: "1:1", gap: 24 },
      render: ({ left: Left, right: Right, ratio, gap }) => (
        <div
          className="bt-columns"
          style={{ gridTemplateColumns: ratioColumns[ratio], gap }}
        >
          <Left style={{ minHeight: 40 }} />
          <Right style={{ minHeight: 40 }} />
        </div>
      ),
    },
    Heading: {
      fields: {
        text: { type: "text", label: "Text", contentEditable: true },
        level: {
          type: "select",
          label: "Level",
          options: [
            { label: "H1", value: "h1" },
            { label: "H2", value: "h2" },
            { label: "H3", value: "h3" },
            { label: "H4", value: "h4" },
          ],
        },
        align: alignField,
        color: colorField("Color"),
        font: fontField("Font", true),
        size: { type: "number", label: "Size (px at desktop, 0 = default)", min: 0, max: 200 },
        weight: { type: "select", label: "Weight", options: weightOptions },
        letterSpacing: { type: "number", label: "Letter spacing (% of size)", min: -10, max: 50 },
        transform: caseField("Capitalization"),
        lineHeight: { type: "number", label: "Line height (%, 0 = default)", min: 0, max: 300 },
      },
      defaultProps: {
        text: "Heading",
        level: "h2",
        align: "left",
        color: "#111111",
        font: "",
        size: 0,
        weight: 0,
        letterSpacing: 0,
        transform: "",
        lineHeight: 0,
      },
      render: ({ text, level: Tag, align, color, font, size, weight, letterSpacing, transform, lineHeight }) => (
        <Tag
          style={{
            textAlign: align,
            color: color || undefined,
            margin: "0 0 12px",
            fontFamily: fontFamily(font),
            fontSize: size ? fluid(size, 0.6) : undefined,
            fontWeight: weight || undefined,
            letterSpacing: letterSpacing ? `${letterSpacing / 100}em` : undefined,
            textTransform: transform || undefined,
            lineHeight: lineHeight ? lineHeight / 100 : undefined,
          }}
        >
          {text}
        </Tag>
      ),
    },
    Text: {
      fields: {
        text: { type: "textarea", label: "Text", contentEditable: true },
        align: alignField,
        color: colorField("Color"),
        size: { type: "number", label: "Font size (px)", min: 8 },
        font: fontField("Font", true),
        weight: { type: "select", label: "Weight", options: weightOptions },
        lineHeight: { type: "number", label: "Line height (%)", min: 80, max: 300 },
        letterSpacing: { type: "number", label: "Letter spacing (% of size)", min: -10, max: 50 },
      },
      defaultProps: {
        text: "Write something here.",
        align: "left",
        color: "#444444",
        size: 16,
        font: "",
        weight: 0,
        lineHeight: 160,
        letterSpacing: 0,
      },
      render: ({ text, align, color, size, font, weight, lineHeight, letterSpacing }) => (
        <p
          style={{
            textAlign: align,
            color: color || undefined,
            fontSize: size,
            fontFamily: fontFamily(font),
            fontWeight: weight || undefined,
            lineHeight: lineHeight ? lineHeight / 100 : 1.6,
            letterSpacing: letterSpacing ? `${letterSpacing / 100}em` : undefined,
            margin: "0 0 12px",
          }}
        >
          {text}
        </p>
      ),
    },
    Button: {
      fields: {
        label: { type: "text", label: "Label" },
        href: { type: "text", label: "Link" },
        variant: {
          type: "radio",
          label: "Style",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Outline", value: "outline" },
          ],
        },
        align: alignField,
        background: colorField("Button color (blank = style default)"),
        textColor: colorField("Text color (blank = style default)"),
      },
      defaultProps: {
        label: "Click me",
        href: "#",
        variant: "primary",
        align: "left",
        background: "",
        textColor: "",
      },
      render: ({ label, href, variant, align, background, textColor, puck }) => (
        <div style={{ textAlign: align, margin: "0 0 12px" }}>
          <a
            className={`bt-button bt-button--${variant}`}
            href={href}
            tabIndex={puck.isEditing ? -1 : undefined}
            style={{
              background: variant === "primary" ? background || undefined : undefined,
              borderColor: background || undefined,
              color: textColor || (variant === "outline" ? background : "") || undefined,
            }}
          >
            {label}
          </a>
        </div>
      ),
    },
    Image: {
      fields: {
        src: imageField("Image"),
        alt: { type: "text", label: "Alt text" },
        width: { type: "number", label: "Width (%)", min: 1, max: 100 },
        radius: { type: "number", label: "Border radius (px)", min: 0 },
      },
      defaultProps: {
        src: "https://placehold.co/800x450",
        alt: "",
        width: 100,
        radius: 8,
      },
      render: ({ src, alt, width, radius }) => (
        // Image URLs are entered freely in the editor, so next/image remote patterns do not apply.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{ display: "block", width: `${width}%`, borderRadius: radius, margin: "0 auto 12px" }}
        />
      ),
    },
    Spacer: {
      fields: {
        height: { type: "number", label: "Height (px)", min: 0 },
      },
      defaultProps: { height: 32 },
      render: ({ height }) => <div style={{ height }} />,
    },
    Divider: {
      fields: {
        style: {
          type: "select",
          label: "Style",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Dashed", value: "dashed" },
            { label: "Dotted", value: "dotted" },
          ],
        },
        thickness: { type: "number", label: "Thickness (px)", min: 1 },
        color: colorField("Color"),
      },
      defaultProps: { style: "solid", thickness: 1, color: "#e5e7eb" },
      render: ({ style, thickness, color }) => (
        <hr
          className="bt-divider"
          style={{ borderTopStyle: style, borderTopWidth: thickness, borderTopColor: color }}
        />
      ),
    },
  },
};

export default config;
