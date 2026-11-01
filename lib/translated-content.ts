import {
  ANDROID_BETA_LINKS,
  BETA_PLATFORM_CONFIG,
  FEATURE_CONFIG,
  FOOTER_LINK_CONFIG,
  HERO_CTA_CONFIG,
  NAV_LINK_CONFIG,
  QUICK_START_LINK_CONFIG,
  type AndroidBetaContent,
  type BetasPageContent,
  type FaqContent,
  type FaqItem,
  type FeatureItem,
  type FinalCtaContent,
  type FooterContent,
  type HeroBadge,
  type HeroContent,
  type HonestCon,
  type HowItWorksStep,
  type NavLink,
  type PhoneStripContent,
  type QuickStartContent,
  type SecurityContent,
  type SectionContent,
} from "@/lib/content";

type TranslationValues = Record<string, string | number | Date>;

export interface Translator {
  (key: string, values?: TranslationValues): string;
  raw(key: string): unknown;
}

function rawArray<T>(t: Translator, key: string): T[] {
  const value = t.raw(key);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function getHeroContent(t: Translator): HeroContent {
  const ctas = rawArray<Pick<HeroContent["ctas"][number], "label">>(t, "ctas");

  return {
    eyebrow: t("eyebrow"),
    headline: t("headline"),
    subheadline: t("subheadline"),
    primaryButtonLabel: t("primaryButtonLabel"),
    videoLabel: t("videoLabel"),
    videoDescription: t("videoDescription"),
    badges: rawArray<HeroBadge>(t, "badges"),
    ctas: HERO_CTA_CONFIG.map((config, index) => ({
      ...config,
      label: ctas[index]?.label ?? "",
    })),
  };
}

export function getHowItWorksContent(t: Translator): {
  content: {
    eyebrow: string;
    heading: string;
    steps: HowItWorksStep[];
    trustNote: string;
  };
} {
  return {
    content: {
      eyebrow: t("eyebrow"),
      heading: t("heading"),
      trustNote: t("trustNote"),
      steps: rawArray<HowItWorksStep>(t, "steps"),
    },
  };
}

export function getFeaturesContent(t: Translator): {
  section: SectionContent;
  features: FeatureItem[];
} {
  const items = rawArray<Omit<FeatureItem, "icon" | "surfaceTags">>(t, "items");

  return {
    section: {
      eyebrow: t("section.eyebrow"),
      heading: t("section.heading"),
    },
    features: FEATURE_CONFIG.map((config, index) => ({
      ...config,
      ...items[index],
    })),
  };
}

export function getHonestConsContent(t: Translator): {
  section: SectionContent;
  items: HonestCon[];
} {
  return {
    section: {
      heading: t("section.heading"),
    },
    items: rawArray<HonestCon>(t, "items"),
  };
}

export function getFaqContent(t: Translator): FaqContent {
  return {
    heading: t("heading"),
    intro: t("intro"),
    supportLinkLabel: t("supportLinkLabel"),
    items: rawArray<FaqItem>(t, "items"),
  };
}

export function getPhoneStripContent(t: Translator): PhoneStripContent {
  return {
    heading: t("heading"),
    items: rawArray<string>(t, "items"),
  };
}

export function getSecurityContent(t: Translator): SecurityContent {
  return {
    heading: t("heading"),
    description: t("description"),
    cantSeeHeading: t("cantSeeHeading"),
    cantSee: rawArray<string>(t, "cantSee"),
    scopeNote: t("scopeNote"),
    highlights: rawArray<string>(t, "highlights"),
  };
}

export function getFinalCtaContent(t: Translator): FinalCtaContent {
  return {
    heading: t("heading"),
    description: t("description"),
    ctaLabel: t("ctaLabel"),
  };
}

export function getQuickStartContent(t: Translator): QuickStartContent {
  const links = rawArray<{ label: string }>(t, "links");

  return {
    eyebrow: t("eyebrow"),
    heading: t("heading"),
    steps: rawArray<string>(t, "steps"),
    operatorNote: t("operatorNote"),
    links: QUICK_START_LINK_CONFIG.map((config, index) => ({
      ...config,
      label: links[index]?.label ?? "",
    })),
  };
}

export function getNavLinks(t: Translator): NavLink[] {
  return NAV_LINK_CONFIG.map((config) => ({
    ...config,
    label: t(`links.${config.id}`),
  }));
}

export function getFooterContent(t: Translator): FooterContent {
  return {
    productName: t("productName"),
    licenseText: t("licenseText"),
    tagline: t("tagline"),
    disclaimer: t("disclaimer"),
    links: FOOTER_LINK_CONFIG.map((config) => ({
      ...config,
      label: t(`links.${config.id}`),
    })),
  };
}

export function getBetasPageContent(t: Translator): BetasPageContent {
  const platforms = rawArray<
    Omit<BetasPageContent["platforms"][number], "id" | "primaryCta"> & {
      primaryCta: string;
    }
  >(t, "platforms");

  return {
    kicker: t("kicker"),
    headline: t("headline"),
    intro: t("intro"),
    platforms: BETA_PLATFORM_CONFIG.map((config, index) => ({
      id: config.id,
      ...platforms[index],
      primaryCta: {
        label: platforms[index]?.primaryCta ?? "",
        href: config.primaryHref,
      },
    })),
  };
}

export function getAndroidBetaContent(t: Translator): AndroidBetaContent {
  return {
    eyebrow: t("eyebrow"),
    headline: t("headline"),
    intro: t("intro"),
    groupUrl: ANDROID_BETA_LINKS.groupUrl,
    playUrl: ANDROID_BETA_LINKS.playUrl,
    groupCta: t("groupCta"),
    playCta: t("playCta"),
    howToJoinHeading: t("howToJoinHeading"),
    stepLabel: t("stepLabel", { number: "{number}" }),
    steps: rawArray<AndroidBetaContent["steps"][number]>(t, "steps"),
    fallback: {
      title: t("fallback.title"),
      body: t("fallback.body"),
    },
    closing: t("closing"),
  };
}
