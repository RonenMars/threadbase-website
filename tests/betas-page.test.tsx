import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BetasPage, PlatformCard } from "@/components/BetasPage";
import { PageShell } from "@/components/PageShell";
import type { BetaPlatform } from "@/lib/content";
import { renderWithIntl } from "@/tests/test-utils";

const platform: BetaPlatform = {
  id: "android",
  eyebrow: "Android",
  name: "Android beta",
  tagline: "Tagline",
  description: "Description",
  primaryCta: { label: "Join", href: "/android-beta" },
  secondaryCta: { label: "Learn more", href: "/docs" },
  steps: [],
};

describe("BetasPage", () => {
  it("opens only external join links in a new tab", () => {
    renderWithIntl(<BetasPage />);
    const ios = screen.getByRole("link", { name: /join testflight/i });
    const android = screen.getByRole("link", { name: /join android beta/i });
    expect(ios).toHaveAttribute("target", "_blank");
    expect(ios).toHaveAttribute("rel", "noopener noreferrer");
    expect(android).not.toHaveAttribute("target");
    expect(android).not.toHaveAttribute("rel");
  });

  it("keeps the site footer", () => {
    renderWithIntl(<BetasPage />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});

describe("PlatformCard", () => {
  it("shows the secondary CTA by default and hides it in join-only mode", () => {
    const { unmount } = renderWithIntl(
      <PlatformCard platform={platform} index={0} />,
    );
    expect(
      screen.getByRole("link", { name: "Learn more" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join" })).not.toHaveAttribute(
      "target",
    );
    unmount();

    renderWithIntl(<PlatformCard platform={platform} index={0} joinOnly />);
    expect(
      screen.queryByRole("link", { name: "Learn more" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Join" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});

describe("PageShell", () => {
  it("renders kicker, heading, description and footer without the new props", () => {
    renderWithIntl(
      <PageShell kicker="Kicker" heading="Heading" description="Description" />,
    );
    expect(screen.getByText("Kicker")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Heading" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
