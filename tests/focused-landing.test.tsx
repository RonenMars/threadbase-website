import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FocusedLandingRoute, { generateMetadata } from "@/app/[locale]/lp/page";
import { NavMenu } from "@/components/NavMenu";
import { BETA_PLATFORM_CONFIG } from "@/lib/content";
import { renderWithIntl } from "@/tests/test-utils";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => "/en/lp",
}));

describe("focused campaign page", () => {
  it("renders only the two source-of-truth beta join anchors, including shared navigation", () => {
    const { container } = renderWithIntl(
      <>
        <NavMenu />
        <FocusedLandingRoute />
      </>,
    );
    const anchors = Array.from(container.querySelectorAll("a"));
    expect(anchors.map((anchor) => anchor.getAttribute("href"))).toEqual(
      BETA_PLATFORM_CONFIG.map((platform) => platform.primaryHref),
    );
    for (const anchor of anchors) {
      expect(anchor).toHaveAttribute("target", "_blank");
      expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
    }
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it("moves the hero CTA to the beta section without adding an anchor", () => {
    const scrollIntoView = vi.fn();
    renderWithIntl(<FocusedLandingRoute />);
    const beta = document.getElementById("join-beta");
    expect(beta).not.toBeNull();
    if (beta) beta.scrollIntoView = scrollIntoView;
    fireEvent.click(screen.getByRole("button", { name: /join the beta/i }));
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("sets translated metadata and noindex", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({ locale: "en" }),
    });
    expect(metadata.title).toContain("Threadbase");
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
