import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FocusedLanding } from "@/components/FocusedLanding";
import type { Locale } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.routes.lp" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default function FocusedLandingRoute(): React.JSX.Element {
  return <FocusedLanding />;
}
