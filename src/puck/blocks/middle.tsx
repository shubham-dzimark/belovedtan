import type { ComponentConfig } from "@puckeditor/core";
import {
  buttonStyleField,
  imageField,
  lines,
  number,
  text,
  textarea,
  toggle,
  videoField,
  type ButtonStyle,
  defaultTypography,
  typographyField,
  animationField,
  type SectionAnimation,
  typographyVars,
  type SectionTypography,
} from "../fields";
import { Check, featureIconOptions, featureIcons, type FeatureIcon } from "../icons";
import { ArrowLink, Backdrop, Btn, Eyebrow, Img, Multiline, overlayFields } from "./shared";

// ---------- Offer cards ----------

type OfferCard = { image: string; title: string; text: string; meta1: string; meta2: string; href: string };

export type OfferCardsProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  eyebrow: string;
  heading: string;
  pattern: boolean;
  cards: OfferCard[];
};

export const OfferCards: ComponentConfig<OfferCardsProps> = {
  label: "Offer cards",
  fields: {
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    pattern: toggle("Patterned background"),
    cards: {
      type: "array",
      label: "Cards",
      arrayFields: {
        image: imageField(),
        title: text("Title"),
        text: textarea("Text"),
        meta1: text("Detail 1 (small grey text)"),
        meta2: text("Detail 2 (optional)"),
        href: text("Link (optional)"),
      },
      defaultItemProps: {
        image: "https://picsum.photos/seed/belovedtan-card/960/720",
        title: "New offer",
        text: "Describe the offer.",
        meta1: "Location: all studios",
        meta2: "",
        href: "",
      },
      getItemSummary: (item) => item.title || "Card",
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    eyebrow: "Latest offers",
    heading: "Catch the glow",
    pattern: true,
    cards: [
      { image: "https://picsum.photos/seed/belovedtan-offer1/960/720", title: "New studio opening", text: "Our newest location opens this season. Join the list for launch-week perks.", meta1: "Location: Uptown", meta2: "", href: "#" },
      { image: "https://picsum.photos/seed/belovedtan-offer2/960/720", title: "First tan on us", text: "New clients enjoy a complimentary express tan with any package.", meta1: "Location: all studios", meta2: "Limited spots", href: "#" },
      { image: "https://picsum.photos/seed/belovedtan-offer3/960/720", title: "20% off bridal parties", text: "Book a group session for four or more and save on every appointment.", meta1: "Location: Downtown", meta2: "Ends Dec 31", href: "#" },
      { image: "https://picsum.photos/seed/belovedtan-offer4/960/720", title: "Now hiring artists", text: "Love skin and people? Join a team that takes both seriously.", meta1: "Location: all studios", meta2: "", href: "#" },
    ],
  },
  render: ({ typography, animation, eyebrow, heading, pattern, cards }) => (
    <section className={`lp lp-offers${pattern ? " lp-pattern" : ""}`} data-anim={animation || undefined} style={typographyVars(typography)}>
      <div className="lp-section-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2">
          <Multiline text={heading} />
        </h2>
      </div>
      <div className="lp-offers-grid" style={{ ["--cols" as string]: Math.max(cards.length, 1) }}>
        {cards.map((card, i) => {
          const Tag = card.href ? "a" : "div";
          return (
            <Tag key={i} className="lp-offer" {...(card.href ? { href: card.href } : {})}>
              <div className="lp-offer-img">
                <Img src={card.image} alt={card.title} />
              </div>
              <div className="lp-offer-body">
                <h3 className="lp-h4">{card.title}</h3>
                <p className="lp-body">{card.text}</p>
                <div className="lp-meta">
                  {card.meta1 && <span>{card.meta1}</span>}
                  {card.meta2 && <span>{card.meta2}</span>}
                </div>
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  ),
};

// ---------- Service list over image (wellness hub) ----------

type ListItem = { label: string; note: string; href: string };

export type ServiceListHeroProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  eyebrow: string;
  heading: string;
  text: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  items: ListItem[];
  moreLabel: string;
  allLabel: string;
  allHref: string;
  height: number;
};

export const ServiceListHero: ComponentConfig<ServiceListHeroProps> = {
  label: "Service list over image",
  fields: {
    image: imageField("Background image"),
    video: videoField(),
    ...overlayFields,
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    text: textarea("Text"),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    items: {
      type: "array",
      label: "List rows",
      arrayFields: { label: text("Label"), note: text("Note on the right (optional)"), href: text("Link (optional)") },
      defaultItemProps: { label: "New service", note: "", href: "" },
      getItemSummary: (item) => item.label || "Row",
    },
    moreLabel: text("Last row: left text"),
    allLabel: text("Last row: link label"),
    allHref: text("Last row: link"),
    height: number("Height (% of screen)", 40, 150),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-spa/1920/1200",
    video: "",
    overlayColor: "#1a0f08",
    overlayOpacity: 55,
    eyebrow: "The skin studio",
    heading: "Skin & recovery lounge",
    text: "Unwind between sessions with treatments designed to prep, protect and extend your glow.",
    buttonLabel: "Book a treatment",
    buttonHref: "#",
    buttonStyle: "light",
    items: [
      { label: "Infrared sauna suites", note: "", href: "" },
      { label: "Hydrating body wraps", note: "", href: "" },
      { label: "LED skin therapy", note: "", href: "" },
      { label: "Lymphatic massage", note: "Downtown only", href: "" },
      { label: "Skin analysis", note: "Downtown only", href: "" },
      { label: "Cold plunge", note: "Downtown only", href: "" },
    ],
    moreLabel: "+8 more",
    allLabel: "See all services",
    allHref: "#",
    height: 130,
  },
  render: ({ typography, animation, eyebrow, heading, text: body, buttonLabel, buttonHref, buttonStyle, items, moreLabel, allLabel, allHref, height, ...bg }) => (
    <section className="lp lp-listhero" data-anim={animation || undefined} style={{ ...typographyVars(typography), minHeight: `${height}vh` }}>
      <Backdrop {...bg} />
      <div className="lp-listhero-main">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2">
          <Multiline text={heading} />
        </h2>
        {body && <p className="lp-body">{body}</p>}
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      <ul className="lp-listhero-rows">
        {items.map((item, i) => (
          <li key={i}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
            {item.note && <em>{item.note}</em>}
          </li>
        ))}
        {(moreLabel || allLabel) && (
          <li>
            <span>{moreLabel}</span>
            <ArrowLink label={allLabel} href={allHref} />
          </li>
        )}
      </ul>
    </section>
  ),
};

// ---------- Section heading + feature columns ----------

type Feature = { icon: FeatureIcon; title: string; text: string };

export type FeatureColumnsProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  eyebrow: string;
  heading: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  pattern: boolean;
  features: Feature[];
};

export const FeatureColumns: ComponentConfig<FeatureColumnsProps> = {
  label: "Heading + feature columns",
  fields: {
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    pattern: toggle("Patterned background behind columns"),
    features: {
      type: "array",
      label: "Columns",
      arrayFields: {
        icon: { type: "select", label: "Icon", options: featureIconOptions },
        title: text("Title"),
        text: textarea("Text"),
      },
      defaultItemProps: { icon: "star", title: "New feature", text: "Describe it here." },
      getItemSummary: (item) => item.title || "Column",
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    eyebrow: "The lounge",
    heading: "Members' lounge & café",
    buttonLabel: "Learn more",
    buttonHref: "#",
    buttonStyle: "dark",
    pattern: true,
    features: [
      { icon: "chat", title: "Relax", text: "Settle in with a botanical tea or fresh juice while your tan develops." },
      { icon: "briefcase", title: "Work", text: "Quiet corners with fast Wi-Fi and charging at every seat." },
      { icon: "heart", title: "Connect", text: "Meet the community at monthly skin talks and member evenings." },
      { icon: "celebrate", title: "Celebrate", text: "Host bridal parties and birthdays in our private event suite." },
    ],
  },
  render: ({ typography, animation, eyebrow, heading, buttonLabel, buttonHref, buttonStyle, pattern, features }) => (
    <section className="lp lp-features" data-anim={animation || undefined} style={typographyVars(typography)}>
      <div className="lp-section-head lp-section-head--row">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="lp-h2">
            <Multiline text={heading} />
          </h2>
        </div>
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      <div
        className={`lp-features-grid${pattern ? " lp-pattern" : ""}`}
        style={{ ["--cols" as string]: Math.max(features.length, 1) }}
      >
        {features.map((feature, i) => (
          <div key={i} className="lp-feature">
            {feature.icon !== "none" && <div className="lp-feature-icon">{featureIcons[feature.icon]}</div>}
            <h3 className="lp-label">{feature.title}</h3>
            <p className="lp-body">{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  ),
};

// ---------- Full-width image ----------

export type FullImageProps = { image: string; alt: string; aspect: string; typography: SectionTypography; animation: SectionAnimation };

export const FullImage: ComponentConfig<FullImageProps> = {
  label: "Full-width image",
  fields: {
    image: imageField(),
    alt: text("Alt text (describes the image)"),
    aspect: {
      type: "select",
      label: "Shape",
      options: [
        { label: "3 : 2", value: "3 / 2" },
        { label: "16 : 9", value: "16 / 9" },
        { label: "21 : 9 (wide)", value: "21 / 9" },
        { label: "4 : 3", value: "4 / 3" },
      ],
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-lounge/1920/1280",
    alt: "",
    aspect: "3 / 2",
  },
  render: ({ typography, animation, image, alt, aspect }) => (
    <div className="lp lp-fullimg" data-anim={animation || undefined} style={{ ...typographyVars(typography), aspectRatio: aspect }}>
      <Img src={image} alt={alt} />
    </div>
  ),
};

// ---------- Locations ----------

type Location = { image: string; name: string; text: string; address: string; phone: string; services: string };

export type LocationsProps = { listTitle: string; locations: Location[]; typography: SectionTypography; animation: SectionAnimation };

export const Locations: ComponentConfig<LocationsProps> = {
  label: "Locations",
  fields: {
    listTitle: text("List heading"),
    locations: {
      type: "array",
      label: "Locations",
      arrayFields: {
        image: imageField(),
        name: text("Name"),
        text: textarea("Description"),
        address: text("Address"),
        phone: text("Phone"),
        services: textarea("Services (one per line)"),
      },
      defaultItemProps: {
        image: "https://picsum.photos/seed/belovedtan-location/960/560",
        name: "New location",
        text: "Describe this studio.",
        address: "Street, City",
        phone: "000-000-0000",
        services: "Service one\nService two",
      },
      getItemSummary: (item) => item.name || "Location",
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    listTitle: "Services include:",
    locations: [
      {
        image: "https://picsum.photos/seed/belovedtan-loc1/960/560",
        name: "Downtown",
        text: "Our flagship studio: two floors of private tanning suites, a skin lab and the members' lounge.",
        address: "100 Main Street, Your City",
        phone: "555-010-0100",
        services: "Custom spray tan\nExpress tan\nContour tan\nLounge & café\nInfrared sauna\nLED skin therapy",
      },
      {
        image: "https://picsum.photos/seed/belovedtan-loc2/960/560",
        name: "Uptown",
        text: "A calm, light-filled boutique with same-day appointments and late openings.",
        address: "250 Park Avenue, Your City",
        phone: "555-010-0200",
        services: "Custom spray tan\nExpress tan\nSkin prep & facials\nLounge & café\nBody wraps",
      },
    ],
  },
  render: ({ typography, animation, listTitle, locations }) => (
    <section className="lp lp-locations" data-anim={animation || undefined} style={{ ...typographyVars(typography), ["--cols" as string]: Math.max(locations.length, 1) }}>
      {locations.map((loc, i) => (
        <article key={i} className="lp-location">
          <div className="lp-location-img">
            <Img src={loc.image} alt={loc.name} />
          </div>
          <div className="lp-location-body">
            <div className="lp-location-main">
              <h3 className="lp-h3">{loc.name}</h3>
              <p className="lp-body lp-strong">{loc.text}</p>
              <p className="lp-muted">
                {loc.address}
                {loc.phone && (
                  <>
                    <br />
                    <a href={`tel:${loc.phone.replace(/[^\d+]/g, "")}`}>{loc.phone}</a>
                  </>
                )}
              </p>
            </div>
            <aside className="lp-location-aside">
              <p className="lp-gold-label">{listTitle}</p>
              <ul className="lp-checks">
                {lines(loc.services).map((service, j) => (
                  <li key={j}>
                    <Check />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </article>
      ))}
    </section>
  ),
};
