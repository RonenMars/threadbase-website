"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  Beaker,
  BookOpen,
  Shield,
  GitBranch,
  LifeBuoy,
  Bug,
  ArrowUpRight,
} from "lucide-react";
import { AppleLogo, AndroidLogo } from "@phosphor-icons/react";
import { Divide as Hamburger } from "hamburger-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, type Locale, getTextDirection } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { NavLink } from "@/lib/content";
import { getNavLinks } from "@/lib/translated-content";

const EASE = [0.22, 1, 0.36, 1] as const;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: EASE } },
} as const;

function getPanelVariants(isRtl: boolean) {
  return {
    hidden: { x: isRtl ? "100%" : "-100%" },
    visible: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: EASE,
        when: "beforeChildren",
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      x: isRtl ? "100%" : "-100%",
      transition: { duration: 0.28, ease: EASE },
    },
  } as const;
}

function getItemVariants(isRtl: boolean) {
  return {
    hidden: { opacity: 0, x: isRtl ? 12 : -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
    exit: {
      opacity: 0,
      x: isRtl ? 12 : -12,
      transition: { duration: 0.15, ease: EASE },
    },
  } as const;
}

const LINK_ICONS: Record<NavLink["id"], React.ElementType> = {
  home: Home,
  betas: Beaker,
  docs: BookOpen,
  github: GitBranch,
  privacy: Shield,
  support: LifeBuoy,
  issues: Bug,
};

function detectPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return "desktop";
}

function useMobilePlatform(): "ios" | "android" | "desktop" {
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">(
    "desktop",
  );

  useEffect(() => {
    const platformFrame = window.requestAnimationFrame(() => {
      setPlatform(detectPlatform());
    });
    return () => window.cancelAnimationFrame(platformFrame);
  }, []);

  return platform;
}

export function NavMenu(): React.JSX.Element | null {
  const pathname = usePathname();
  if (/\/lp(?:\/|$)/.test(pathname)) return <CornerLanguageSwitcher />;
  return <SiteNavMenu />;
}

function CornerLanguageSwitcher(): React.JSX.Element {
  return (
    <div className="fixed inset-e-5 top-5 z-60">
      <LanguageSwitcher variant="compact" />
    </div>
  );
}

function SiteNavMenu(): React.JSX.Element {
  const locale = useLocale() as Locale;
  const isRtl = getTextDirection(locale) === "rtl";
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const panelId = useId();
  const mobilePlatform = useMobilePlatform();
  const panelVariants = React.useMemo(() => getPanelVariants(isRtl), [isRtl]);
  const itemVariants = React.useMemo(() => getItemVariants(isRtl), [isRtl]);
  const links = React.useMemo(() => getNavLinks(t), [t]);
  const betaPlatforms = React.useMemo(
    () =>
      [
        {
          id: "ios",
          label: t("betaPlatforms.ios"),
          href: "https://testflight.apple.com/join/FqdM3mFK",
          Icon: AppleLogo,
        },
        {
          id: "android",
          label: t("betaPlatforms.android"),
          href: "/android-beta",
          Icon: AndroidLogo,
        },
      ] as const,
    [t],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      // ponytail: query on each Tab rather than caching — the panel's list is small
      // and this stays correct as items mount/unmount.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (!panelRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  // On mobile, replace "Beta Programs" with two platform-specific items in priority order
  const navLinks = React.useMemo(() => {
    if (mobilePlatform === "desktop") return links;

    const [primary, secondary] =
      mobilePlatform === "android"
        ? [betaPlatforms[1], betaPlatforms[0]]
        : [betaPlatforms[0], betaPlatforms[1]];

    return links.flatMap((link) => {
      if (!link.betaIcons) return [link];
      return [primary, secondary].map((platform) => ({
        id: "betas" as const,
        label: platform.label,
        href: platform.href,
        external: platform.href.startsWith("http"),
        // ponytail: platform icon rides on the entry; keeps the shared NavLink id union untouched.
        Icon: platform.Icon,
      }));
    });
  }, [betaPlatforms, links, mobilePlatform]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((prev) => !prev)}
        className={`fixed start-5 top-5 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg-secondary/85 text-secondary shadow-lg backdrop-blur transition-[border-color,color,box-shadow,transform,opacity] duration-300 ease-out hover:border-accent hover:text-primary hover:shadow-[0_8px_24px_-8px_rgba(99,179,255,0.55)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span aria-hidden="true" className="pointer-events-none">
          <Hamburger
            toggled={open}
            toggle={setOpen}
            size={18}
            color="currentColor"
          />
        </span>
      </button>
      <CornerLanguageSwitcher />

      <AnimatePresence initial={false}>
        {open ? (
          <>
            <motion.button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={close}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-40 cursor-default bg-bg-primary/60 backdrop-blur-sm"
            />

            <motion.nav
              ref={panelRef}
              id={panelId}
              aria-label={t("ariaLabel")}
              role="dialog"
              aria-modal="true"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 inset-s-0 z-50 flex w-[min(20rem,100vw)] flex-col border-e border-border bg-bg-secondary shadow-2xl"
            >
              <div className="flex h-16 shrink-0 items-center justify-between px-5">
                <span className="text-base font-semibold text-primary">
                  {t("menu")}
                </span>
                <button
                  type="button"
                  aria-label={t("closeMenu")}
                  onClick={close}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg-primary/60 text-secondary transition-colors hover:border-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M1 1l12 12M13 1L1 13"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-1 px-3">
                <ul role="list" className="flex flex-col gap-0.5">
                  {navLinks.map((link, idx) => (
                    <React.Fragment key={link.href}>
                      {link.separatorBefore ? (
                        <div className="my-3 mx-1 h-px bg-border" />
                      ) : null}
                      <NavPanelItem
                        link={link}
                        onActivate={close}
                        isDesktop={mobilePlatform === "desktop"}
                        itemVariants={itemVariants}
                        betaPlatforms={betaPlatforms}
                        forwardedRef={idx === 0 ? firstLinkRef : undefined}
                      />
                    </React.Fragment>
                  ))}
                </ul>
              </div>

              <div className="mt-auto border-t border-border px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-muted">
                      {t("productName")}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{t("version")}</p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function NavPanelItem({
  link,
  onActivate,
  isDesktop,
  itemVariants,
  betaPlatforms,
  forwardedRef,
}: {
  link: NavLink & { Icon?: React.ElementType };
  onActivate: () => void;
  isDesktop: boolean;
  itemVariants: ReturnType<typeof getItemVariants>;
  betaPlatforms: ReadonlyArray<{
    id: "ios" | "android";
    label: string;
    href: string;
    Icon: React.ElementType;
  }>;
  forwardedRef?: React.Ref<HTMLAnchorElement>;
}): React.JSX.Element {
  const external = link.external ?? /^https?:\/\//.test(link.href);
  const Icon = link.Icon ?? LINK_ICONS[link.id];

  const showBetaIcons = isDesktop && link.betaIcons;

  return (
    <motion.li variants={itemVariants}>
      <div className="group flex items-center gap-3 rounded-xl px-4 py-3 text-base text-secondary transition-colors duration-200 hover:bg-bg-primary/60 hover:text-primary">
        {Icon ? (
          <Icon
            aria-hidden="true"
            size={18}
            className="shrink-0 text-muted transition-colors duration-200 group-hover:text-primary"
          />
        ) : null}
        <Link
          ref={forwardedRef}
          href={link.href}
          onClick={onActivate}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="flex-1 focus-visible:outline-none"
        >
          {link.label}
        </Link>
        {showBetaIcons ? (
          <div className="flex items-center gap-1.5">
            {betaPlatforms.map(
              ({ id, label: platformLabel, href, Icon: PlatformIcon }) => (
                <Link
                  key={id}
                  href={href}
                  onClick={onActivate}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={platformLabel}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-bg-primary/60 text-muted transition-colors duration-200 hover:border-accent hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <PlatformIcon size={14} weight="duotone" />
                </Link>
              ),
            )}
          </div>
        ) : null}
        {external && !showBetaIcons ? (
          <ArrowUpRight
            aria-hidden="true"
            size={14}
            className="shrink-0 text-muted opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:group-hover:-translate-x-0.5"
          />
        ) : null}
      </div>
    </motion.li>
  );
}
