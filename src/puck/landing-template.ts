import config, { type PageData } from "./config";

type SectionType = keyof typeof config.components;
type Section = SectionType | { type: SectionType; props: Record<string, unknown> };

// Section order for each template, top to bottom. Plain names use the section's default content.
// The site header and footer are added to every page automatically (edited under Header / Footer).
const TEMPLATES = {
  landing: [
    "HeroBanner",
    "IntroLinks",
    "ServicesShowcase",
    "OfferCards",
    "ServiceListHero",
    "FeatureColumns",
    "FullImage",
    "Locations",
    "PromoBanner",
    "ProductShowcase",
    "SocialFeed",
  ],
  service: [
    "PageHero",
    "IconStrip",
    "ServiceIntro",
    {
      type: "SplitFeature",
      props: {
        imageSide: "right",
        image: "https://picsum.photos/seed/belovedtan-treat1/960/620",
        heading: "Signature\nrelaxation massage",
        text: "Our most requested treatment. Long, flowing strokes and warm botanical oils ease everyday tension while calming music and low light help you switch off completely.",
        detail: "Pressure: light – medium",
      },
    },
    {
      type: "SplitFeature",
      props: {
        imageSide: "left",
        image: "https://picsum.photos/seed/belovedtan-treat2/960/620",
        heading: "Deep tissue massage",
        text: "Slow, firm work that reaches deeper muscle layers to release knots and chronic tightness. A good choice after heavy training or long days at a desk.",
        detail: "Pressure: medium – firm",
      },
    },
    {
      type: "SplitFeature",
      props: {
        imageSide: "right",
        image: "https://picsum.photos/seed/belovedtan-treat3/960/620",
        heading: "Sports recovery\nmassage",
        text: "Built for active bodies. Your therapist combines targeted massage with assisted stretching to loosen tight areas and help you recover between sessions.\n\nIdeal before an event, after a race or as part of a regular training plan.",
        detail: "",
      },
    },
    {
      type: "SplitFeature",
      props: {
        imageSide: "left",
        image: "https://picsum.photos/seed/belovedtan-treat4/960/620",
        heading: "Hot stone massage",
        text: "Smooth heated stones glide over the body and rest on key points, letting warmth sink into the muscles so tension melts away faster than with hands alone.",
        detail: "Pressure: light – medium",
      },
    },
    {
      type: "SplitFeature",
      props: {
        imageSide: "right",
        image: "https://picsum.photos/seed/belovedtan-treat5/960/620",
        heading: "Lymphatic drainage",
        text: "Gentle, rhythmic movements encourage natural circulation to reduce puffiness and leave skin feeling lighter and refreshed.\n\nAvailable as a full-body or face-only treatment.",
        detail: "",
      },
    },
  ],
} satisfies Record<string, Section[]>;

export type TemplateName = keyof typeof TEMPLATES;

/** A complete page built from a template, using each section's default content plus any overrides. */
export function templatePageData(name: TemplateName): PageData {
  const sections: readonly Section[] = TEMPLATES[name];
  return {
    root: { props: structuredClone(config.root!.defaultProps!) },
    content: sections.map((section) => {
      const type = typeof section === "string" ? section : section.type;
      const overrides = typeof section === "string" ? {} : section.props;
      return {
        type,
        props: {
          ...structuredClone(config.components[type].defaultProps),
          ...structuredClone(overrides),
          id: `${type}-${crypto.randomUUID()}`,
        },
      };
    }) as PageData["content"],
  };
}

/** The full landing page (kept for existing callers). */
export function landingPageData(): PageData {
  return templatePageData("landing");
}
