"use client";

import * as PhosphorIcons from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { fadeUp, staggerContainer, staggerItem } from "@/components/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeatureItem, SectionContent } from "@/lib/content";
import { getFeaturesContent } from "@/lib/translated-content";

interface FeaturesGridProps {
  section?: SectionContent;
  features?: FeatureItem[];
}

function resolveIcon(name: string): Icon | null {
  // PhosphorIcons is a namespace of icon components keyed by name.
  const candidate = (PhosphorIcons as unknown as Record<string, unknown>)[name];
  return typeof candidate === "function" ||
    (typeof candidate === "object" && candidate !== null)
    ? (candidate as Icon)
    : null;
}

export function FeaturesGrid({
  section: sectionProp,
  features: featuresProp,
}: FeaturesGridProps): React.JSX.Element {
  const fallback = getFeaturesContent(useTranslations("home.features"));
  const section = sectionProp ?? fallback.section;
  const features = featuresProp ?? fallback.features;

  return (
    <motion.section
      animate="visible"
      className="px-6 py-16 sm:px-8 lg:px-10"
      id="features"
      initial={false}
      variants={fadeUp}
    >
      <div className="container-shell">
        <div className="mb-12 max-w-3xl space-y-4">
          <h2 className="text-balance text-3xl font-semibold tracking-tighter text-primary sm:text-4xl lg:text-5xl">
            {section.heading}
          </h2>
          {section.description ? (
            <p className="text-lg leading-8 text-secondary">
              {section.description}
            </p>
          ) : null}
        </div>

        <motion.div
          className="grid gap-5 md:grid-cols-2"
          variants={staggerContainer}
        >
          {features.map((feature) => {
            const MainIcon = resolveIcon(feature.icon);
            return (
              <div key={feature.title}>
                <motion.div variants={staggerItem}>
                  <Card className="tech-card h-full transition-colors">
                    <CardHeader className="gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-strong bg-accent/12 text-xl text-accent-strong">
                          {MainIcon ? (
                            <MainIcon
                              className="text-accent-strong"
                              size={24}
                              weight="regular"
                            />
                          ) : null}
                        </span>
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-7 text-secondary">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
