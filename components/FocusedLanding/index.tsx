"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BellRinging,
  ShieldCheck,
  TerminalWindow,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { PlatformCard } from "@/components/BetasPage";
import { PageShell } from "@/components/PageShell";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
  getBetasPageContent,
  getFocusedLandingContent,
} from "@/lib/translated-content";

const STRENGTH_ICONS = [TerminalWindow, BellRinging, ShieldCheck];

export function FocusedLanding(): React.JSX.Element {
  const content = getFocusedLandingContent(useTranslations("pages.lp"));
  const betas = getBetasPageContent(useTranslations("pages.betas"));
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className="relative isolate overflow-hidden"
      initial={false}
      animate="visible"
      variants={fadeUp}
    >
      <div
        className="hero-mesh pointer-events-none absolute inset-0 -z-10 opacity-90"
        aria-hidden="true"
      />
      <div
        className="floating-orb motion-safe:motion-preset-float-sm absolute -inset-s-32 top-24 -z-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(89,191,255,0.3),rgba(89,191,255,0))] blur-3xl"
        aria-hidden="true"
      />
      <div
        className="floating-orb motion-safe:motion-preset-float-sm absolute -inset-e-24 top-16 -z-10 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(240,138,36,0.22),rgba(240,138,36,0))] blur-3xl"
        aria-hidden="true"
      />
      <PageShell
        kicker={content.eyebrow}
        heading={content.headline}
        description={content.subheadline}
        wide
        showFooter={false}
      >
        <Button
          className="mt-8 min-w-50"
          size="lg"
          variant="primary"
          onClick={() => {
            document.getElementById("join-beta")?.scrollIntoView({
              behavior: reducedMotion ? "instant" : "smooth",
              block: "start",
            });
            document
              .getElementById("join-beta")
              ?.focus({ preventScroll: true });
          }}
        >
          {content.ctaLabel}
        </Button>
        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {content.strengths.map((strength, index) => {
            const Icon = STRENGTH_ICONS[index];
            return (
              <article
                key={strength.title}
                className="rounded-2xl border border-border bg-bg-secondary/60 p-6"
              >
                <Icon
                  aria-hidden="true"
                  size={26}
                  weight="duotone"
                  className="mb-5 text-accent"
                />
                <h2 className="text-lg font-semibold tracking-tight text-primary">
                  {strength.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-secondary">
                  {strength.body}
                </p>
              </article>
            );
          })}
        </section>
        <section
          id="join-beta"
          tabIndex={-1}
          aria-labelledby="beta-heading"
          className="scroll-mt-6 focus:outline-none"
        >
          <SectionHeading>
            <span id="beta-heading">{content.betaHeading}</span>
          </SectionHeading>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {betas.platforms.map((platform, index) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                index={index}
                joinOnly
              />
            ))}
          </div>
        </section>
      </PageShell>
    </motion.div>
  );
}
