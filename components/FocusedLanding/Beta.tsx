"use client";

import { useTranslations } from "next-intl";
import { PlatformCard } from "@/components/BetasPage";
import { PageShell } from "@/components/PageShell";
import {
  getBetasPageContent,
  getFocusedLandingContent,
} from "@/lib/translated-content";

export function FocusedBeta(): React.JSX.Element {
  const content = getFocusedLandingContent(useTranslations("pages.lp"));
  const betas = getBetasPageContent(useTranslations("pages.betas"));

  return (
    <PageShell
      kicker={betas.kicker}
      heading={content.betaHeading}
      description={betas.intro}
      wide
      showFooter={false}
    >
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {betas.platforms.map((platform, index) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            index={index}
            joinOnly
          />
        ))}
      </div>
    </PageShell>
  );
}
