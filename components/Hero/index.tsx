"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HeroContent } from "@/lib/content";
import { getHeroContent } from "@/lib/translated-content";
import { GlitchTitle } from "./GlitchTitle";

interface HeroProps {
  hero?: HeroContent;
}

function detectPlatform(): "ios" | "android" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  if (/android/i.test(navigator.userAgent)) return "android";

  const matchesIosMobileUa = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  const matchesIpadDesktopUa =
    /Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1;

  return matchesIosMobileUa || matchesIpadDesktopUa ? "ios" : "desktop";
}

export function Hero({ hero: heroProp }: HeroProps): React.JSX.Element {
  const tHero = useTranslations("home.hero");
  const hero = heroProp ?? getHeroContent(tHero);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">(
    "desktop",
  );
  const primaryCta = hero.ctas.find((cta) => cta.variant === "primary");
  const primaryCtaHref =
    platform === "android"
      ? "https://threadbase.sh/android-beta"
      : platform === "ios"
        ? (primaryCta?.href ?? "https://testflight.apple.com/join/FqdM3mFK")
        : "https://threadbase.sh/betas";

  useEffect(() => {
    const platformFrame = window.requestAnimationFrame(() => {
      setPlatform(detectPlatform());
    });

    return () => {
      window.cancelAnimationFrame(platformFrame);
    };
  }, []);

  return (
    <motion.section
      animate="visible"
      role="banner"
      aria-labelledby="hero-headline"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 sm:px-8 sm:py-28 lg:px-10 lg:py-32"
      initial={false}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
    >
      <div
        className="hero-mesh absolute inset-0 opacity-90"
        aria-hidden="true"
      />
      <div
        className="floating-orb motion-preset-float-sm absolute -left-32 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(89,191,255,0.3),rgba(89,191,255,0))] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="floating-orb motion-preset-float-sm absolute -right-24 top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(240,138,36,0.22),rgba(240,138,36,0))] blur-3xl"
        aria-hidden="true"
      />

      <div className="container-shell relative z-10 flex flex-col items-center gap-7 text-center sm:gap-10">
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <Badge className="section-kicker" variant="secondary">
            {hero.eyebrow}
          </Badge>
        </motion.div>

        <motion.div
          className="max-w-5xl space-y-4 sm:space-y-6"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <GlitchTitle
            text={hero.headline}
            className="glitch-title text-balance text-4xl font-semibold tracking-[-0.04em] text-primary sm:text-6xl lg:text-7xl"
          />
          {hero.subheadline ? (
            <p className="mx-auto mt-2.5 max-w-3xl text-base leading-7 text-secondary sm:text-xl sm:leading-8">
              {hero.subheadline}
            </p>
          ) : null}
        </motion.div>

        <motion.ul
          className="flex flex-wrap items-center justify-center gap-3"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {hero.badges.map((badge) => (
            <li key={badge.label}>
              <Badge variant="neutral">{badge.label}</Badge>
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <Button
            render={<Link href={primaryCtaHref} />}
            nativeButton={false}
            className="min-w-50"
            size="lg"
            variant="primary"
          >
            {hero.primaryButtonLabel}
          </Button>
          {hero.ctas.map((cta) =>
            cta.variant === "outline" ? (
              <Button
                key={cta.label}
                render={<Link href={cta.href} />}
                nativeButton={false}
                className="min-w-50"
                size="lg"
                variant="outline"
              >
                {cta.label}
              </Button>
            ) : null,
          )}
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          <video
            aria-label={hero.imageAlt}
            autoPlay
            className="mx-auto mt-4 h-auto w-full max-w-md rounded-2xl border border-border-strong shadow-2xl"
            loop
            muted
            playsInline
            poster="/videos/threadbase-pairing-poster.jpg"
            preload="metadata"
            src="/videos/threadbase-pairing.mp4"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
