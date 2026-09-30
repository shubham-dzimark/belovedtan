import type { ComponentConfig } from "@puckeditor/core";
import {
  buttonStyleField,
  imageField,
  linkArray,
  lines,
  number,
  text,
  textarea,
  toggle,
  videoField,
  type ButtonStyle,
  type Link,
  defaultTypography,
  typographyField,
  animationField,
  type SectionAnimation,
  typographyVars,
  type SectionTypography,
} from "../fields";
import { socialIcons, type SocialNetwork } from "../icons";
import { ScrollRow } from "./scroll-row";
import { ArrowLink, Backdrop, Btn, Eyebrow, Img, Multiline, overlayFields } from "./shared";

// ---------- Promo banner ----------

export type PromoBannerProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  image: string;
  video: string;
  overlayColor: string;
  overlayOpacity: number;
  eyebrow: string;
  heading: string;
  linkLabel: string;
  href: string;
  height: number;
};

export const PromoBanner: ComponentConfig<PromoBannerProps> = {
  label: "Promo banner",
  fields: {
    image: imageField("Background image"),
    video: videoField(),
    ...overlayFields,
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    linkLabel: text("Link label"),
    href: text("Link"),
    height: number("Height (px)", 240, 1200),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    image: "https://picsum.photos/seed/belovedtan-promo/1920/700",
    video: "",
    overlayColor: "#12002a",
    overlayOpacity: 45,
    eyebrow: "Our signature experience",
    heading: "Bronze, buff, breathe",
    linkLabel: "Discover the ritual",
    href: "#",
    height: 610,
  },
  render: ({ typography, animation, eyebrow, heading, linkLabel, href, height, ...bg }) => (
    <section className="lp lp-promo" data-anim={animation || undefined} style={{ ...typographyVars(typography), minHeight: height }}>
      <Backdrop {...bg} />
      <div className="lp-promo-inner">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2">
          <Multiline text={heading} />
        </h2>
        <ArrowLink label={linkLabel} href={href} />
      </div>
    </section>
  ),
};

// ---------- Product showcase ----------

type Product = { image: string; name: string; price: string; comparePrice: string; href: string };

export type ProductShowcaseProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  eyebrow: string;
  heading: string;
  buttonLabel: string;
  buttonHref: string;
  buttonStyle: ButtonStyle;
  products: Product[];
};

export const ProductShowcase: ComponentConfig<ProductShowcaseProps> = {
  label: "Product showcase",
  fields: {
    eyebrow: text("Small label"),
    heading: textarea("Heading", true),
    buttonLabel: text("Button label"),
    buttonHref: text("Button link"),
    buttonStyle: buttonStyleField(),
    products: {
      type: "array",
      label: "Products",
      arrayFields: {
        image: imageField(),
        name: text("Name"),
        price: text("Price"),
        comparePrice: text("Original price (shown crossed out, optional)"),
        href: text("Link"),
      },
      defaultItemProps: {
        image: "https://picsum.photos/seed/belovedtan-product/830/1030",
        name: "New product",
        price: "$0.00",
        comparePrice: "",
        href: "#",
      },
      getItemSummary: (item) => item.name || "Product",
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    eyebrow: "BelovedTan shop",
    heading: "Keep your glow going at home",
    buttonLabel: "Shop now",
    buttonHref: "#",
    buttonStyle: "dark",
    products: [
      { image: "https://picsum.photos/seed/belovedtan-prod1/830/1030", name: "Glow Extender Lotion", price: "$38.00", comparePrice: "$48.00", href: "#" },
      { image: "https://picsum.photos/seed/belovedtan-prod2/830/1030", name: "Silk Exfoliating Mitt", price: "$22.00", comparePrice: "$28.00", href: "#" },
    ],
  },
  render: ({ typography, animation, eyebrow, heading, buttonLabel, buttonHref, buttonStyle, products }) => (
    <section className="lp lp-shop" data-anim={animation || undefined} style={typographyVars(typography)}>
      <div className="lp-shop-intro">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2">
          <Multiline text={heading} />
        </h2>
        <Btn label={buttonLabel} href={buttonHref} variant={buttonStyle} />
      </div>
      <div className="lp-shop-products">
        {products.map((product, i) => (
          <a key={i} href={product.href || "#"} className="lp-product">
            <div className="lp-product-img">
              <Img src={product.image} alt={product.name} />
            </div>
            <p className="lp-product-name">{product.name}</p>
            <p className="lp-product-price">
              <strong>{product.price}</strong>
              {product.comparePrice && <s>{product.comparePrice}</s>}
            </p>
          </a>
        ))}
      </div>
    </section>
  ),
};

// ---------- Social feed ----------

export type SocialFeedProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  eyebrow: string;
  handle: string;
  href: string;
  pattern: boolean;
  posts: { image: string; href: string }[];
};

export const SocialFeed: ComponentConfig<SocialFeedProps> = {
  label: "Social feed",
  fields: {
    eyebrow: text("Small label"),
    handle: text("Handle / heading"),
    href: text("Profile link"),
    pattern: toggle("Patterned background"),
    posts: {
      type: "array",
      label: "Posts",
      arrayFields: { image: imageField(), href: text("Post link (optional)") },
      defaultItemProps: { image: "https://picsum.photos/seed/belovedtan-post/640/640", href: "" },
      getItemSummary: (_item, i) => `Post ${(i ?? 0) + 1}`,
    },
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    eyebrow: "Follow & tag us to share your glow",
    handle: "@belovedtan",
    href: "#",
    pattern: true,
    posts: Array.from({ length: 8 }, (_, i) => ({
      image: `https://picsum.photos/seed/belovedtan-post${i + 1}/640/640`,
      href: "",
    })),
  },
  render: ({ typography, animation, eyebrow, handle, href, pattern, posts }) => (
    <section className={`lp lp-social${pattern ? " lp-pattern" : ""}`} data-anim={animation || undefined} style={typographyVars(typography)}>
      <div className="lp-section-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="lp-h2 lp-handle">
          <a href={href || "#"}>{handle}</a>
        </h2>
      </div>
      <ScrollRow>
        {posts.map((post, i) =>
          post.href ? (
            <a key={i} href={post.href} className="lp-post">
              <Img src={post.image} />
            </a>
          ) : (
            <div key={i} className="lp-post">
              <Img src={post.image} />
            </div>
          ),
        )}
      </ScrollRow>
    </section>
  ),
};

// ---------- Footer ----------

type FooterColumn = { title: string; links: Link[] };
type FooterLocation = {
  name: string;
  address: string;
  phone: string;
  directionsLabel: string;
  directionsHref: string;
  hoursTitle: string;
  hours: string;
};

export type SiteFooterProps = {
  typography: SectionTypography;
  animation: SectionAnimation;
  columns: FooterColumn[];
  locations: FooterLocation[];
  newsletterHeading: string;
  newsletterText: string;
  newsletterAction: string;
  newsletterButton: string;
  appHeading: string;
  appStoreLabel: string;
  appStoreHref: string;
  playStoreLabel: string;
  playStoreHref: string;
  phoneImage: string;
  socials: { network: SocialNetwork; href: string }[];
  copyright: string;
  legalLinks: Link[];
};

const socialOptions = (Object.keys(socialIcons) as SocialNetwork[]).map((value) => ({
  label: value[0].toUpperCase() + value.slice(1),
  value,
}));

export const SiteFooter: ComponentConfig<SiteFooterProps> = {
  label: "Site footer",
  fields: {
    columns: {
      type: "array",
      label: "Link columns",
      arrayFields: { title: text("Column title"), links: linkArray("Links") },
      defaultItemProps: { title: "New column", links: [{ label: "Link", href: "#" }] },
      getItemSummary: (item) => item.title || "Column",
    },
    locations: {
      type: "array",
      label: "Locations & hours",
      arrayFields: {
        name: text("Name"),
        address: textarea("Address (one line per row)"),
        phone: text("Phone"),
        directionsLabel: text("Directions link label"),
        directionsHref: text("Directions link"),
        hoursTitle: text("Hours heading"),
        hours: textarea("Hours (one per line)"),
      },
      defaultItemProps: {
        name: "New location",
        address: "Street, City",
        phone: "",
        directionsLabel: "Get directions",
        directionsHref: "#",
        hoursTitle: "Open:",
        hours: "Monday – Friday: 9 AM – 8 PM",
      },
      getItemSummary: (item) => item.name || "Location",
    },
    newsletterHeading: text("Newsletter heading"),
    newsletterText: textarea("Newsletter text"),
    newsletterAction: text("Newsletter form URL (e.g. your Mailchimp form action)"),
    newsletterButton: text("Newsletter button label"),
    appHeading: text("App heading (leave blank to hide)"),
    appStoreLabel: text("App Store badge label"),
    appStoreHref: text("App Store link"),
    playStoreLabel: text("Google Play badge label"),
    playStoreHref: text("Google Play link"),
    phoneImage: imageField("App screenshot"),
    socials: {
      type: "array",
      label: "Social links",
      arrayFields: { network: { type: "select", label: "Network", options: socialOptions }, href: text("Link") },
      defaultItemProps: { network: "instagram", href: "#" },
      getItemSummary: (item) => item.network,
    },
    copyright: text("Copyright text"),
    legalLinks: linkArray("Legal links"),
    typography: typographyField,
    animation: animationField,
  },
  defaultProps: {
    typography: defaultTypography,
    animation: "",
    columns: [
      { title: "Book", links: [{ label: "Book a tan", href: "#" }, { label: "Packages & credits", href: "#" }, { label: "Memberships", href: "#" }, { label: "Gift cards", href: "#" }, { label: "Group bookings", href: "#" }] },
      { title: "Explore", links: [{ label: "Our studios", href: "#" }, { label: "Treatments", href: "#" }, { label: "The lounge", href: "#" }, { label: "Skin studio", href: "#" }, { label: "Shop", href: "#" }] },
      { title: "About", links: [{ label: "Our story", href: "#" }, { label: "Artists", href: "#" }, { label: "Locations", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
      { title: "Support", links: [{ label: "Contact us", href: "#" }, { label: "FAQs", href: "#" }, { label: "Terms & conditions", href: "#" }, { label: "Privacy policy", href: "#" }, { label: "Aftercare guide", href: "#" }, { label: "Accessibility", href: "#" }] },
    ],
    locations: [
      { name: "Uptown", address: "250 Park Avenue", phone: "", directionsLabel: "", directionsHref: "", hoursTitle: "Coming soon", hours: "" },
      { name: "Downtown", address: "100 Main Street, Your City", phone: "555-010-0100", directionsLabel: "Get directions", directionsHref: "#", hoursTitle: "Open:", hours: "Monday – Friday: 8 AM – 9 PM\nSaturday: 9 AM – 7 PM\nSunday: 10 AM – 6 PM" },
      { name: "Riverside", address: "48 River Road, Your City", phone: "555-010-0300", directionsLabel: "Get directions", directionsHref: "#", hoursTitle: "Open:", hours: "Monday – Friday: 9 AM – 8 PM\nSaturday – Sunday: 10 AM – 6 PM" },
    ],
    newsletterHeading: "Stay in the glow",
    newsletterText: "Get new offers, skin tips and studio news from BelovedTan. Unsubscribe any time.",
    newsletterAction: "",
    newsletterButton: "Sign up",
    appHeading: "Book on the go",
    appStoreLabel: "App Store",
    appStoreHref: "#",
    playStoreLabel: "Google Play",
    playStoreHref: "#",
    phoneImage: "https://picsum.photos/seed/belovedtan-app/300/420",
    socials: [
      { network: "facebook", href: "#" },
      { network: "instagram", href: "#" },
      { network: "tiktok", href: "#" },
      { network: "linkedin", href: "#" },
    ],
    copyright: "© 2026 BelovedTan",
    legalLinks: [
      { label: "Privacy policy", href: "#" },
      { label: "Terms of service", href: "#" },
      { label: "Refund policy", href: "#" },
    ],
  },
  render: (p) => (
    <footer className="lp lp-footer" data-anim={p.animation || undefined} style={typographyVars(p.typography)}>
      <div className="lp-footer-cols" style={{ ["--cols" as string]: Math.max(p.columns.length, 1) }}>
        {p.columns.map((col, i) => (
          <div key={i}>
            <p className="lp-gold-label">{col.title}</p>
            <ul>
              {col.links.map((link, j) => (
                <li key={j}>
                  <a href={link.href || "#"}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="lp-footer-mid">
        <div className="lp-footer-locations">
          {p.locations.map((loc, i) => (
            <div key={i} className="lp-footer-location">
              <div>
                <h3 className="lp-h3">{loc.name}</h3>
                <p className="lp-gold">
                  {lines(loc.address).map((line, j) => (
                    <span key={j}>
                      {line}
                      <br />
                    </span>
                  ))}
                  {loc.phone && (
                    <>
                      {loc.phone}
                      <br />
                    </>
                  )}
                  {loc.directionsLabel && <a href={loc.directionsHref || "#"}>{loc.directionsLabel}</a>}
                </p>
              </div>
              <div>
                {loc.hoursTitle && <p className="lp-footer-hours-title">{loc.hoursTitle}</p>}
                <p className="lp-footer-hours">
                  {lines(loc.hours).map((line, j) => (
                    <span key={j}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lp-footer-side">
          <form className="lp-newsletter" action={p.newsletterAction || undefined} method="post">
            <h3 className="lp-h3">{p.newsletterHeading}</h3>
            <p>{p.newsletterText}</p>
            <input name="firstName" placeholder="First name" aria-label="First name" />
            <input name="lastName" placeholder="Last name" aria-label="Last name" />
            <input name="email" type="email" required placeholder="Email address" aria-label="Email address" />
            <button type="submit" className="lp-btn lp-btn--outline-light lp-btn--block">
              {p.newsletterButton}
            </button>
          </form>

          {p.appHeading && (
            <div className="lp-app">
              <h3 className="lp-h3">{p.appHeading}</h3>
              <div className="lp-app-row">
                <div className="lp-badges">
                  {p.appStoreLabel && (
                    <a href={p.appStoreHref || "#"} className="lp-badge">
                      <small>Download on the</small>
                      {p.appStoreLabel}
                    </a>
                  )}
                  {p.playStoreLabel && (
                    <a href={p.playStoreHref || "#"} className="lp-badge">
                      <small>Get it on</small>
                      {p.playStoreLabel}
                    </a>
                  )}
                </div>
                {p.phoneImage && (
                  <div className="lp-phone">
                    <Img src={p.phoneImage} alt="App preview" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="lp-footer-bottom">
        <div className="lp-socials">
          {p.socials.map((s, i) => (
            <a key={i} href={s.href || "#"} aria-label={s.network}>
              {socialIcons[s.network]}
            </a>
          ))}
        </div>
        <div className="lp-legal">
          <span>{p.copyright}</span>
          {p.legalLinks.map((link, i) => (
            <a key={i} href={link.href || "#"}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  ),
};
