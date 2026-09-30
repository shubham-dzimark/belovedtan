import type { ComponentConfig } from "@puckeditor/core";
import {
  buttonStyleField,
  colorField,
  defaultTypography,
  imageField,
  number,
  text,
  textarea,
  typographyField,
  animationField,
  type SectionAnimation,
  typographyVars,
  videoField,
  type ButtonStyle,
  type SectionTypography,
} from "../fields";
import { featureIconOptions, featureIcons, type FeatureIcon } from "../icons";
import { ArrowLink, Backdrop, Btn, Eyebrow, Img, Multiline, overlayFields } from "./shared";

/** Splits a textarea into paragraphs on blank lines. */
function paragraphs(value: string | undefined) {
  return (value ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// ---------- Page hero (centered, with corner note) ----------

export type PageHeroProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  eyebrow: string;
  heading: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  cornerText: string;
  cornerLinkLabel: string;
  cornerLinkHref: string;
  height: number;
};

export const PageHero: ComponentConfig<PageHeroProps> = {
  label: "Page hero",
  fields: {
    image: imageField("Background image"),
    video: videoField(),
    ...overlayFields,
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    cornerText: textarea("Bottom-right text (optional)"),
    cornerLinkLabel: text("Bottom-right link label"),
    cornerLinkHref: text("Bottom-right link"),
    height: number("Height (% of screen)", 30, 100),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-massage-hero/1920/1080",
    video: "",
    overlayColor: "#000000",
    overlayOpacity: 45,
    eyebrow: "Wellness & recovery at BelovedTan",
    heading: "Massage therapy",
    buttonLabel: "Book a session",
    buttonHref: "#",
    buttonStyle: "accent",
    cornerText: "Rest, restore and reset with hands-on treatments from our wellness team.",
    cornerLinkLabel: "View all services",
    cornerLinkHref: "#",
    height: 85,
  },
  render: ({ typography, animation, eyebrow, heading, buttonLabel, buttonHref, buttonStyle, cornerText, cornerLinkLabel, cornerLinkHref, height, ...bg }) => (
    <section className="lp lp-pagehero" data-anim={animation || undefined} style={{ ...typographyVars(typography), minHeight: `${height}vh` }}>
      <Backdrop {...bg} />
      <div className="lp-pagehero-inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="lp-h1">
          <Multiline text={heading} />
        </h1>
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      {(cornerText || cornerLinkLabel) && (
        <div className="lp-pagehero-corner">
          {cornerText && <p className="lp-body">{cornerText}</p>}
          <ArrowLink label={cornerLinkLabel} href={cornerLinkHref} />
        </div>
      )}
    </section>
  ),
};

// ---------- Icon strip ----------

type IconItem = { icon: FeatureIcon; title: string; text: string };

export type IconStripProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  items: IconItem[];
  background: string;
};

export const IconStrip: ComponentConfig<IconStripProps> = {
  label: "Icon strip",
  fields: {
    items: {
      type: "array",
      label: "Columns",
      arrayFields: {
        icon: { type: "select", label: "Icon", options: featureIconOptions },
        title: text("Title (optional)"),
        text: textarea("Text"),
      },
      defaultItemProps: { icon: "star", title: "", text: "Describe this benefit." },
      getItemSummary: (item) => item.title || item.text?.slice(0, 30) || "Column",
    },
    background: colorField("Background color"),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    background: "",
    items: [
      { icon: "stones", title: "", text: "Unwind with restorative treatments from registered massage therapists, tailored to how your body feels today." },
      { icon: "pulse", title: "", text: "Choose from relaxation, deep tissue, sports recovery and lymphatic techniques, or let your therapist blend them." },
      { icon: "heart", title: "", text: "Book solo or side-by-side couples sessions to ease tension, support recovery and switch off completely." },
      { icon: "pool", title: "", text: "Every treatment includes time in our lounge, infrared sauna and relaxation room." },
    ],
  },
  render: ({ typography, animation, items, background }) => (
    <section
      className="lp lp-iconstrip"
      data-anim={animation || undefined} style={{ ...typographyVars(typography), ["--cols" as string]: Math.max(items.length, 1), background: background || undefined }}
    >
      {items.map((item, i) => (
        <div key={i} className="lp-iconstrip-item">
          {item.icon !== "none" && <div className="lp-feature-icon">{featureIcons[item.icon]}</div>}
          {item.title && <h3 className="lp-label">{item.title}</h3>}
          <p className="lp-body">{item.text}</p>
        </div>
      ))}
    </section>
  ),
};

// ---------- Service intro + locations ----------

type ServiceLocation = { image: string; name: string; address: string; phone: string; linkLabel: string; href: string };

export type ServiceIntroProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  eyebrow: string;
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  locationsLabel: string;
  locations: ServiceLocation[];
};

export const ServiceIntro: ComponentConfig<ServiceIntroProps> = {
  label: "Service intro + locations",
  fields: {
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    text: textarea("Text (blank line = new paragraph)"),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    locationsLabel: text("Locations heading"),
    locations: {
      type: "array",
      label: "Locations",
      arrayFields: {
        image: imageField(),
        name: text("Name"),
        address: text("Address"),
        phone: text("Phone"),
        linkLabel: text("Link label"),
        href: text("Link"),
      },
      defaultItemProps: {
        image: "https://picsum.photos/seed/belovedtan-spa-thumb/380/266",
        name: "New location",
        address: "Street, City",
        phone: "",
        linkLabel: "Book now",
        href: "#",
      },
      getItemSummary: (item) => item.name || "Location",
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    eyebrow: "Unwind from head to toe",
    heading: "Massage\ntherapy",
    text: "Release tension, ease sore muscles and give your mind a proper rest. Every session starts with a short consultation so the pressure and focus are right for you.\n\nOur registered massage therapists combine classic and modern techniques, adjusting each treatment as they go.",
    buttonLabel: "View all treatments",
    buttonHref: "#",
    buttonStyle: "dark",
    locationsLabel: "Available at:",
    locations: [
      {
        image: "https://picsum.photos/seed/belovedtan-spa-thumb/380/266",
        name: "Downtown skin studio",
        address: "100 Main Street, Your City",
        phone: "555-010-0100",
        linkLabel: "Book now",
        href: "#",
      },
    ],
  },
  render: ({ typography, animation, eyebrow, heading, text: body, buttonLabel, buttonHref, buttonStyle, locationsLabel, locations }) => (
    <section className="lp lp-svcintro" data-anim={animation || undefined} style={typographyVars(typography)}>
      <div className="lp-svcintro-main">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h1 lp-svcintro-heading">
          <Multiline text={heading} />
        </h2>
        <div className="lp-svcintro-text">
          {paragraphs(body).map((p, i) => (
            <p key={i} className="lp-body">
              {p}
            </p>
          ))}
        </div>
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      {locations.length > 0 && (
        <aside className="lp-svcintro-aside">
          {locationsLabel && <p className="lp-eyebrow lp-svcintro-label">{locationsLabel}</p>}
          {locations.map((loc, i) => (
            <div key={i} className="lp-svcloc">
              <div className="lp-svcloc-img">
                <Img src={loc.image} alt={loc.name} />
              </div>
              <div className="lp-svcloc-body">
                <h3 className="lp-svcloc-name">{loc.name}</h3>
                <p className="lp-muted">
                  {loc.address}
                  {loc.phone && (
                    <>
                      <br />
                      <a href={`tel:${loc.phone.replace(/[^\d+]/g, "")}`}>{loc.phone}</a>
                    </>
                  )}
                </p>
                <ArrowLink label={loc.linkLabel} href={loc.href} />
              </div>
            </div>
          ))}
        </aside>
      )}
    </section>
  ),
};

// ---------- Split feature (image + text) ----------

export type SplitFeatureProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  imageAlt: string;
  imageSide: "left" | "right";
  heading: string;
  text: string;
  detail: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  background: string;
  minHeight: number;
};

export const SplitFeature: ComponentConfig<SplitFeatureProps> = {
  label: "Split image + text",
  fields: {
    image: imageField(),
    imageAlt: text("Image alt text"),
    imageSide: {
      type: "radio",
      label: "Image side",
      options: [
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    heading: textarea("Heading", true),
    text: textarea("Text (blank line = new paragraph)"),
    detail: text("Detail line (e.g. pressure, duration)"),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    background: colorField("Text side background color"),
    minHeight: number("Minimum height (px)", 200, 1200),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-split/960/620",
    imageAlt: "",
    imageSide: "right",
    heading: "Signature massage",
    text: "Describe this treatment: what it feels like, what it helps with and who it suits best.",
    detail: "Pressure: light – medium",
    buttonLabel: "Book a treatment",
    buttonHref: "#",
    buttonStyle: "dark",
    background: "",
    minHeight: 450,
  },
  render: ({ typography, animation, image, imageAlt, imageSide, heading, text: body, detail, buttonLabel, buttonHref, buttonStyle, background, minHeight }) => (
    <section
      className={`lp lp-split lp-split--image-${imageSide}`}
      data-anim={animation || undefined} style={{ ...typographyVars(typography), minHeight }}
    >
      <div className="lp-split-img">
        <Img src={image} alt={imageAlt} />
      </div>
      <div className="lp-split-text" style={{ background: background || undefined }}>
        <div className="lp-split-copy">
          <h2 className="lp-h2">
            <Multiline text={heading} />
          </h2>
          {paragraphs(body).map((p, i) => (
            <p key={i} className="lp-body">
              {p}
            </p>
          ))}
          {detail && <p className="lp-body lp-split-detail">{detail}</p>}
          <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
        </div>
      </div>
    </section>
  ),
};
