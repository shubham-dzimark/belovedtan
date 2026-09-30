import type { ComponentConfig } from "@puckeditor/core";
import NextLink from "next/link";
import {
  buttonStyleField,
  imageField,
  linkArray,
  number,
  text,
  textarea,
  toggle,
  videoField,
  type ButtonStyle,
  type Link,
  colorField,
  defaultTypography,
  typographyField,
  animationField,
  type SectionAnimation,
  typographyVars,
  type SectionTypography,
} from "../fields";
import { UserIcon } from "../icons";
import { ArrowLink, Backdrop, Btn, Eyebrow, Multiline, overlayFields } from "./shared";

// ---------- Site header ----------

export type SiteHeaderProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  logoText: string;
  logoImage: string;
  logoHeight: number;
  menuLinks: Link[];
  loginLabel: string;
  loginHref: string;
  button1Label: string;
  button1Href: string;
  button2Label: string;
  button2Href: string;
  transparent: boolean;
  background: string;
};

export const SiteHeader: ComponentConfig<SiteHeaderProps> = {
  label: "Site header",
  fields: {
    logoText: text("Logo text"),
    logoImage: imageField("Logo image (replaces text)"),
    logoHeight: number("Logo image height (px)", 12, 120),
    menuLinks: linkArray("Menu links (slide-out menu)"),
    loginLabel: text("Account link label"),
    loginHref: text("Account link"),
    button1Label: text("Button 1 label"),
    button1Href: text("Button 1 link"),
    button2Label: text("Button 2 label"),
    button2Href: text("Button 2 link"),
    transparent: toggle("Float over the next section (live site only)"),
    background: colorField("Background color (when not floating)"),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    logoText: "BELOVED TAN",
    logoImage: "",
    logoHeight: 32,
    menuLinks: [
      { label: "Studios", href: "#" },
      { label: "Treatments", href: "#" },
      { label: "Memberships", href: "#" },
      { label: "Journal", href: "#" },
      { label: "Contact", href: "#" },
    ],
    loginLabel: "Log in",
    loginHref: "#",
    button1Label: "Book now",
    button1Href: "#",
    button2Label: "Buy packages",
    button2Href: "#",
    transparent: true,
    background: "#111111",
  },
  render: ({ typography, animation, id, puck, logoText, logoImage, logoHeight, menuLinks, loginLabel, loginHref, ...p }) => {
    const floating = p.transparent && !puck.isEditing;
    const menuId = `menu-${id}`;
    return (
      <header
        className={`lp lp-header${floating ? " lp-header--float" : ""}`}
        data-anim={animation || undefined} style={{ ...typographyVars(typography), ...(floating ? {} : { background: p.background }) }}
      >
        <input type="checkbox" id={menuId} className="lp-menu-toggle" />
        <label htmlFor={menuId} className="lp-burger" aria-label="Open menu">
          <span />
          <span />
          <span />
        </label>
        <nav className="lp-drawer" aria-label="Main">
          <label htmlFor={menuId} className="lp-drawer-close" aria-label="Close menu">
            ×
          </label>
          {menuLinks.map((link, i) => (
            <a key={i} href={link.href || "#"}>
              {link.label}
            </a>
          ))}
        </nav>
        <label htmlFor={menuId} className="lp-drawer-scrim" aria-hidden />

        <NextLink href="/" className="lp-logo">
          {logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoImage} alt={logoText} style={{ height: logoHeight }} />
          ) : (
            logoText
          )}
        </NextLink>

        <div className="lp-header-actions">
          {loginLabel && (
            <a href={loginHref || "#"} className="lp-login">
              <UserIcon /> <span>{loginLabel}</span>
            </a>
          )}
          <Btn label={p.button1Label} href={p.button1Href} variant="outline-light" />
          <Btn label={p.button2Label} href={p.button2Href} variant="light" />
        </div>
      </header>
    );
  },
};

// ---------- Hero ----------

export type HeroBannerProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  heading: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  height: number;
};

export const HeroBanner: ComponentConfig<HeroBannerProps> = {
  label: "Hero banner",
  fields: {
    image: imageField("Background image"),
    video: videoField(),
    ...overlayFields,
    heading: textarea("Heading (new line = line break)", true),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    height: number("Height (% of screen)", 30, 100),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-hero/1920/1080",
    video: "",
    overlayColor: "#2a0a4a",
    overlayOpacity: 55,
    heading: "Glow. Restore.\nBelong.",
    buttonLabel: "Join us",
    buttonHref: "#",
    buttonStyle: "outline-light",
    height: 100,
  },
  render: ({ typography, animation, heading, buttonLabel, buttonHref, buttonStyle, height, ...bg }) => (
    <section className="lp lp-hero" data-anim={animation || undefined} style={{ ...typographyVars(typography), minHeight: `${height}vh` }}>
      <Backdrop {...bg} />
      <div className="lp-hero-inner">
        <h1 className="lp-h1">
          <Multiline text={heading} />
        </h1>
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
    </section>
  ),
};

// ---------- Intro with link list ----------

export type IntroLinksProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  overlayColor: string;
  overlayOpacity: number;
  heading: string;
  links: Link[];
};

export const IntroLinks: ComponentConfig<IntroLinksProps> = {
  label: "Intro + link list",
  fields: {
    image: imageField("Background image"),
    ...overlayFields,
    heading: textarea("Heading", true),
    links: linkArray("Links"),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-intro/1920/600",
    overlayColor: "#0b3a66",
    overlayOpacity: 55,
    heading: "The city's most complete tanning & skin wellness destination",
    links: [
      { label: "Sunless tanning", href: "#" },
      { label: "Skin & recovery", href: "#" },
      { label: "The lounge", href: "#" },
      { label: "Shop", href: "#" },
    ],
  },
  render: ({ typography, animation, heading, links, ...bg }) => (
    <section className="lp lp-intro" data-anim={animation || undefined} style={typographyVars(typography)}>
      <Backdrop {...bg} />
      <div className="lp-intro-inner">
        <h2 className="lp-h2 lp-intro-heading">
          <Multiline text={heading} />
        </h2>
        <ul className="lp-intro-links">
          {links.map((link, i) => (
            <li key={i}>
              <ArrowLink label={link.label} href={link.href} className="lp-arrow--lg" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  ),
};

// ---------- Classes / services showcase ----------

type ShowcaseItem = { title: string; text: string; linkLabel: string; href: string; image: string };

export type ServicesShowcaseProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  overlayColor: string;
  overlayOpacity: number;
  eyebrow: string;
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  items: ShowcaseItem[];
  hoverBackground: string;
  hoverTextColor: string;
  hoverAccent: string;
  hoverPattern: boolean;
};

export const ServicesShowcase: ComponentConfig<ServicesShowcaseProps> = {
  label: "Services showcase",
  fields: {
    image: imageField("Background image"),
    ...overlayFields,
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    text: textarea("Text"),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    items: {
      type: "array",
      label: "Services (right column)",
      arrayFields: {
        title: text("Title"),
        text: textarea("Text"),
        linkLabel: text("Link label"),
        href: text("Link"),
        image: imageField("Background on hover (optional)"),
      },
      defaultItemProps: {
        title: "New service",
        text: "Describe it here.",
        linkLabel: "Learn more",
        href: "#",
        image: "",
      },
      getItemSummary: (item) => item.title || "Service",
    },
    hoverBackground: colorField("Hovered row: background"),
    hoverTextColor: colorField("Hovered row: text color"),
    hoverAccent: colorField("Hovered row: link underline"),
    hoverPattern: toggle("Hovered row: patterned background"),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-studio/1920/1100",
    overlayColor: "#000000",
    overlayOpacity: 50,
    eyebrow: "Find your glow",
    heading: "120+ treatments every week",
    text: "Spray tans, skin treatments and recovery sessions under one roof, with certified artists at every studio and flexible booking seven days a week.",
    buttonLabel: "See availability",
    buttonHref: "#",
    buttonStyle: "light",
    items: [
      {
        title: "Custom spray tan",
        text: "A tailored, streak-free colour mixed for your skin tone.",
        linkLabel: "Learn more",
        href: "#",
        image: "https://picsum.photos/seed/belovedtan-svc1/1920/1100",
      },
      {
        title: "Express tan",
        text: "Rinse in as little as two hours, ready for tonight.",
        linkLabel: "Learn more",
        href: "#",
        image: "https://picsum.photos/seed/belovedtan-svc2/1920/1100",
      },
      {
        title: "Contour tan",
        text: "Hand-sculpted shading that defines and highlights.",
        linkLabel: "Learn more",
        href: "#",
        image: "https://picsum.photos/seed/belovedtan-svc3/1920/1100",
      },
      {
        title: "Skin prep & facials",
        text: "Exfoliate, hydrate and prime for a longer-lasting result.",
        linkLabel: "Learn more",
        href: "#",
        image: "https://picsum.photos/seed/belovedtan-svc4/1920/1100",
      },
    ],
    hoverBackground: "#ffffff",
    hoverTextColor: "#000000",
    hoverAccent: "#c9a063",
    hoverPattern: true,
  },
  render: ({
    typography,
    animation,
    eyebrow,
    heading,
    text: body,
    buttonLabel,
    buttonHref,
    buttonStyle,
    items,
    hoverBackground,
    hoverTextColor,
    hoverAccent,
    hoverPattern,
    ...bg
  }) => (
    <section
      className="lp lp-showcase"
      data-anim={animation || undefined}
      style={{
        ...typographyVars(typography),
        // Older pages saved before these settings existed fall back to the CSS defaults.
        ...(hoverBackground ? { ["--lp-hover-bg" as string]: hoverBackground } : {}),
        ...(hoverTextColor ? { ["--lp-hover-text" as string]: hoverTextColor } : {}),
        ...(hoverAccent ? { ["--lp-hover-accent" as string]: hoverAccent } : {}),
      }}
    >
      <Backdrop {...bg} />
      <div className="lp-showcase-main">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2">
          <Multiline text={heading} />
        </h2>
        {body && <p className="lp-body">{body}</p>}
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      <div className="lp-showcase-list">
        {items.map((item, i) => (
          <div key={i} className="lp-showcase-item">
            {/* Covers the whole section while this row is hovered. */}
            {item.image && (
              <div className="lp-showcase-swap">
                <Backdrop image={item.image} overlayColor={bg.overlayColor} overlayOpacity={bg.overlayOpacity} />
              </div>
            )}
            <div className={`lp-showcase-card${hoverPattern === false ? "" : " lp-showcase-card--pattern"}`}>
              <h3 className="lp-h3">{item.title}</h3>
              <p className="lp-body">{item.text}</p>
              <ArrowLink label={item.linkLabel} href={item.href} />
            </div>
          </div>
        ))}
      </div>
    </section>
  ),
};
