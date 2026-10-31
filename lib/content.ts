export interface SiteMetadata {
  title: string;
  description: string;
}

export interface HeroBadge {
  label: string;
}

export interface HeroCta {
  label: string;
  href: string;
  variant: "primary" | "outline";
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  badges: HeroBadge[];
  ctas: HeroCta[];
  primaryButtonLabel: string;
  videoLabel: string;
  videoDescription: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  postscript?: string;
}

export interface HowItWorksContent {
  eyebrow: string;
  heading: string;
  steps: HowItWorksStep[];
  trustNote: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  surfaceTags: string[];
}

export interface HonestCon {
  title: string;
  description: string;
}

export interface SecurityContent {
  heading: string;
  description: string;
  cantSeeHeading: string;
  cantSee: string[];
  scopeNote: string;
  highlights: string[];
}

export interface PhoneStripContent {
  heading: string;
  items: string[];
}

export interface FinalCtaContent {
  heading: string;
  description: string;
  ctaLabel: string;
}

export interface QuickStartContent {
  eyebrow: string;
  heading: string;
  steps: string[];
  links: Array<{ label: string; href: string }>;
  operatorNote: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  heading: string;
  intro: string;
  supportLinkLabel: string;
  items: FaqItem[];
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterContent {
  productName: string;
  licenseText: string;
  tagline: string;
  disclaimer: string;
  links: FooterLink[];
}

export interface SectionContent {
  eyebrow?: string;
  heading: string;
  description?: string;
}

export interface NavLinkConfig {
  id: "home" | "betas" | "docs" | "github" | "privacy" | "support" | "issues";
  href: string;
  external?: boolean;
  separatorBefore?: boolean;
  betaIcons?: boolean;
}

export interface NavLink extends NavLinkConfig {
  label: string;
}

export interface BetaPlatform {
  id: "ios" | "android";
  eyebrow: string;
  name: string;
  tagline: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  steps: Array<{ title: string; body: string }>;
  note?: string;
}

export interface BetasPageContent {
  kicker: string;
  headline: string;
  intro: string;
  platforms: BetaPlatform[];
}

export interface BetaStep {
  title: string;
  body: string;
}

export interface AndroidBetaContent {
  eyebrow: string;
  headline: string;
  intro: string;
  groupUrl: string;
  playUrl: string;
  groupCta: string;
  playCta: string;
  howToJoinHeading: string;
  stepLabel: string;
  steps: BetaStep[];
  fallback: {
    title: string;
    body: string;
  };
  closing: string;
}

export const HERO_CTA_CONFIG = [
  {
    href: "https://testflight.apple.com/join/FqdM3mFK",
    variant: "primary",
  },
  {
    href: "#quick-start",
    variant: "outline",
  },
] as const satisfies Array<Omit<HeroCta, "label">>;

export const FEATURE_CONFIG = [
  { icon: "BellRinging", surfaceTags: ["DeviceMobile"] },
  { icon: "CheckSquare", surfaceTags: ["DeviceMobile"] },
  { icon: "Microphone", surfaceTags: ["DeviceMobile"] },
  { icon: "ArrowsClockwise", surfaceTags: ["Laptop", "DeviceMobile"] },
  { icon: "MagnifyingGlass", surfaceTags: ["Laptop", "DeviceMobile"] },
  { icon: "Desktop", surfaceTags: ["Laptop", "DeviceMobile"] },
] as const satisfies Array<Pick<FeatureItem, "icon" | "surfaceTags">>;

export const QUICK_START_LINK_CONFIG = [
  {
    href: "https://github.com/RonenMars/threadbase-streamer/releases/latest",
  },
  {
    href: "https://github.com/RonenMars/threadbase-streamer/releases/latest",
  },
  {
    href: "/android-beta",
  },
] as const;

export const NAV_LINK_CONFIG = [
  { id: "home", href: "/" },
  { id: "betas", href: "/betas", betaIcons: true },
  { id: "docs", href: "/docs" },
  {
    id: "github",
    href: "https://github.com/RonenMars/threadbase-mobile",
    external: true,
    separatorBefore: true,
  },
  { id: "privacy", href: "/privacy-policy" },
  { id: "support", href: "/support" },
  {
    id: "issues",
    href: "https://github.com/RonenMars/threadbase/issues",
    external: true,
  },
] as const satisfies NavLinkConfig[];

export const FOOTER_LINK_CONFIG = NAV_LINK_CONFIG;

export const BETA_PLATFORM_CONFIG = [
  {
    id: "ios",
    primaryHref: "https://testflight.apple.com/join/FqdM3mFK",
  },
  {
    id: "android",
    primaryHref: "/android-beta",
  },
] as const;

export const ANDROID_BETA_LINKS = {
  groupUrl: "https://groups.google.com/g/threadbase-android-testers",
  playUrl: "https://play.google.com/apps/testing/com.ronenmars.threadbase",
} as const;

export const SUPPORT_EMAIL = "support@threadbase.sh";
