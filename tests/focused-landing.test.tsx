import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FocusedLandingRoute, { generateMetadata } from "@/app/[locale]/lp/page";
import FocusedBetaRoute, {
  generateMetadata as generateBetaMetadata,
} from "@/app/[locale]/lp/beta/page";
import { NavMenu } from "@/components/NavMenu";
import { BETA_PLATFORM_CONFIG } from "@/lib/content";
import { renderWithIntl } from "@/tests/test-utils";

const navigation = vi.hoisted(() => ({ pathname: "/en/lp" }));
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<object>()),
  usePathname: () => navigation.pathname,
}));

describe("focused campaign pages", () => {
  it("links both landing CTAs only to the beta sub-page and omits the platform cards", () => {
    navigation.pathname = "/en/lp";
    const { container } = renderWithIntl(
      <>
        <NavMenu />
        <FocusedLandingRoute />
      </>,
    );
    expect(
      Array.from(container.querySelectorAll("a"), (anchor) =>
        anchor.getAttribute("href"),
      ),
    ).toEqual(["/lp/beta", "/lp/beta"]);
    expect(
      Array.from(
        container.querySelectorAll("a"),
        (anchor) => anchor.textContent,
      ),
    ).toEqual(["Join the beta", "Join the beta"]);
    expect(
      screen.getByRole("img", { name: /Threadbase.*live session/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Run your agent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Leave your desk" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Continue from your phone" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Install TestFlight")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps only the two source-of-truth beta join links on the sub-page", () => {
    navigation.pathname = "/en/lp/beta";
    const { container } = renderWithIntl(
      <>
        <NavMenu />
        <FocusedBetaRoute />
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
    expect(screen.getByText("Install TestFlight")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /open menu/i }),
    ).not.toBeInTheDocument();
  });

  it.each([generateMetadata, generateBetaMetadata])(
    "sets translated metadata and noindex",
    async (generate) => {
      const metadata = await generate({
        params: Promise.resolve({ locale: "en" }),
      });
      expect(metadata.title).toContain("Threadbase");
      expect(metadata.robots).toEqual({ index: false, follow: false });
    },
  );
});
