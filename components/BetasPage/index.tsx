"use client";

import {
  DeviceMobileCamera,
  AppleLogo,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PageShell } from "@/components/PageShell";
import type { BetaPlatform } from "@/lib/content";
import { getBetasPageContent } from "@/lib/translated-content";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  ios: AppleLogo,
  android: DeviceMobileCamera,
};

export function BetasPage(): React.JSX.Element {
  const content = getBetasPageContent(useTranslations("pages.betas"));

  return (
    <PageShell
      kicker={content.kicker}
      heading={content.headline}
      description={content.intro}
      wide
    >
      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {content.platforms.map((platform, idx) => (
          <PlatformCard key={platform.id} platform={platform} index={idx} />
        ))}
      </div>
    </PageShell>
  );
}

export function PlatformCard({
  platform,
  index,
  joinOnly = false,
}: {
  platform: BetaPlatform;
  index: number;
  joinOnly?: boolean;
}): React.JSX.Element {
  const Icon = PLATFORM_ICONS[platform.id] ?? DeviceMobileCamera;
  const isExternal = platform.primaryCta.href.startsWith("http");

  return (
    <article
      className="flex flex-col gap-6 rounded-2xl border border-border bg-bg-secondary/60 p-7"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-primary text-accent">
            <Icon size={20} weight="duotone" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {platform.eyebrow}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-primary">
            {platform.name}
          </h2>
          <p className="text-sm font-medium text-accent">{platform.tagline}</p>
        </div>
        <p className="text-sm leading-relaxed text-secondary">
          {platform.description}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={platform.primaryCta.href}
          target={joinOnly || isExternal ? "_blank" : undefined}
          rel={joinOnly || isExternal ? "noopener noreferrer" : undefined}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_12px_32px_-12px_rgba(99,179,255,0.7)] motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        >
          <span>{platform.primaryCta.label}</span>
          <ArrowSquareOut
            size={15}
            weight="bold"
            className="opacity-70 transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
          />
        </Link>
        {!joinOnly && platform.secondaryCta ? (
          <Link
            href={platform.secondaryCta.href}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border bg-bg-primary px-6 py-3 text-sm font-semibold text-primary transition-[transform,border-color] duration-300 ease-out hover:border-accent motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
          >
            <span>{platform.secondaryCta.label}</span>
          </Link>
        ) : null}
      </div>

      <ol className="flex flex-col gap-3">
        {platform.steps.map((step, idx) => (
          <li key={step.title} className="flex gap-4">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-bg-primary text-[11px] font-bold text-muted">
              {idx + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-primary">{step.title}</p>
              <p className="text-sm leading-relaxed text-secondary">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
