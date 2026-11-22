"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  BellRinging,
  CheckCircle,
  ShieldCheck,
  TerminalWindow,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/PageShell";
import { fadeUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { getFocusedLandingContent } from "@/lib/translated-content";

const STRENGTH_ICONS = [TerminalWindow, BellRinging, ShieldCheck];
const PROVIDERS = ["Claude Code", "Codex", "Cursor CLI", "Copilot CLI"];

export function FocusedLanding(): React.JSX.Element {
  const content = getFocusedLandingContent(useTranslations("pages.lp"));

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
      <PageShell
        kicker={content.eyebrow}
        heading={content.headline}
        description={content.subheadline}
        wide
        showFooter={false}
        header={
          <header className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <Image
                  src="/screenshots/threadbase-icon.webp"
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
                <span className="text-xl font-semibold tracking-tight text-primary">
                  Threadbase
                </span>
              </div>
              <p className="section-kicker text-xs font-semibold uppercase text-accent">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {content.headline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-secondary">
                {content.subheadline}
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                <CheckCircle
                  size={18}
                  weight="duotone"
                  className="shrink-0 text-accent"
                  aria-hidden="true"
                />
                {content.noWrapper}
              </p>
              <Button
                className="mt-8 min-w-50"
                size="lg"
                variant="primary"
                nativeButton={false}
                render={<Link href="/lp/beta" />}
              >
                {content.ctaLabel}
              </Button>
              <ul
                aria-label={content.providersLabel}
                className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-secondary"
              >
                {PROVIDERS.map((provider) => (
                  <li key={provider}>
                    <bdi>{provider}</bdi>
                  </li>
                ))}
              </ul>
            </div>
            <figure className="mx-auto w-full max-w-65 lg:max-w-70">
              <div className="overflow-hidden rounded-4xl border border-border-strong bg-bg-primary p-1.5 shadow-[0_24px_80px_-32px_rgba(99,179,255,0.3)]">
                <Image
                  src="/screenshots/mobile-session-needs-input.webp"
                  alt={content.imageAlt}
                  width={810}
                  height={1761}
                  sizes="(min-width: 1024px) 280px, 260px"
                  loading="eager"
                  className="h-auto w-full rounded-[1.6rem]"
                />
              </div>
              <figcaption className="mt-4 text-center text-xs leading-5 text-secondary">
                {content.imageCaption}
              </figcaption>
            </figure>
          </header>
        }
      >
        <section aria-labelledby="strengths-heading" className="mt-16">
          <h2 id="strengths-heading" className="sr-only">
            {content.strengthsHeading}
          </h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {content.strengths.map((strength, index) => {
              const Icon = STRENGTH_ICONS[index];
              return (
                <article
                  key={strength.title}
                  className="rounded-2xl border border-border bg-bg-secondary/60 p-6 transition-colors duration-200 hover:border-border-strong"
                >
                  <Icon
                    aria-hidden="true"
                    size={26}
                    weight="duotone"
                    className="mb-4 text-accent"
                  />
                  <h3 className="text-lg font-semibold tracking-tight text-primary">
                    {strength.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-secondary">
                    {strength.body}
                  </p>
                </article>
              );
            })}
          </div>
          <details className="mt-5 text-sm text-secondary">
            <summary className="w-fit cursor-pointer rounded-sm py-2 font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
              {content.detailsLabel}
            </summary>
            <p className="mt-2 max-w-3xl leading-7">
              {content.technicalDetails}
            </p>
          </details>
        </section>
        <section
          aria-labelledby="story-heading"
          className="mt-12 border-t border-border pt-10"
        >
          <h2
            id="story-heading"
            className="text-balance text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
          >
            {content.storyHeading}
          </h2>
          <ol className="mt-8 grid gap-7 sm:grid-cols-3 sm:gap-6">
            {content.steps.map((step, index) => (
              <li key={step.title} className="border-s border-border ps-5">
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-accent"
                >
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-base font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <Button
            className="mt-10 min-w-50"
            size="lg"
            variant="primary"
            nativeButton={false}
            render={<Link href="/lp/beta" />}
          >
            {content.ctaLabel}
          </Button>
        </section>
      </PageShell>
    </motion.div>
  );
}
