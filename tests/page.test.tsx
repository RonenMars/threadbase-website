import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/[locale]/page";
import { renderWithIntl } from "@/tests/test-utils";

describe("Home page", () => {
  it("renders the search-first hero headline", () => {
    renderWithIntl(<Home />);
    expect(document.body.textContent).toContain(
      "Find what your agents already solved.",
    );
  });

  it("renders the shorter narrative in order: workflows → security → beta → quick start → final CTA", () => {
    renderWithIntl(<Home />);
    const headings = screen
      .getAllByRole("heading", { level: 2 })
      .map((h) => h.textContent ?? "");

    const featuresIdx = headings.findIndex((h) =>
      /keep every agent moving/i.test(h),
    );
    const securityIdx = headings.findIndex((h) =>
      /threadbase can't read your sessions/i.test(h),
    );
    const honestIdx = headings.findIndex((h) => /beta, honestly/i.test(h));
    const howIdx = headings.findIndex((h) =>
      /run the streamer.*pair your phone/i.test(h),
    );
    const quickIdx = headings.findIndex((h) => /under a minute/i.test(h));
    const finalCtaIdx = headings.findIndex((h) =>
      /leave the desk.*keep the session/i.test(h),
    );

    expect(featuresIdx).toBeGreaterThanOrEqual(0);
    expect(securityIdx).toBeGreaterThan(featuresIdx);
    expect(honestIdx).toBeGreaterThan(securityIdx);
    expect(howIdx).toBeGreaterThan(honestIdx);
    expect(quickIdx).toBeGreaterThan(howIdx);
    expect(finalCtaIdx).toBeGreaterThan(quickIdx);
  });

  it("does not render any testimonial pull-quote (removed until we have real ones)", () => {
    renderWithIntl(<Home />);
    expect(
      screen.queryByText(/redirected a 20-minute test run/i),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Ronen Mars, builder/i)).not.toBeInTheDocument();
  });

  it("renders the brew install command in the quick start", () => {
    renderWithIntl(<Home />);
    expect(
      screen.getAllByText(/brew install tb-streamer/).length,
    ).toBeGreaterThan(0);
  });

  it("does NOT render any of the old removed sections", () => {
    renderWithIntl(<Home />);
    // No platform picker
    expect(
      screen.queryByText(/choose your environment/i),
    ).not.toBeInTheDocument();
    // No screenshots section
    expect(screen.queryByText(/conversation browser/i)).not.toBeInTheDocument();
    // No "AI Session Browser" eyebrow
    expect(screen.queryByText(/^AI Session Browser$/i)).not.toBeInTheDocument();
    // No repeated problem section or detailed roadmap
    expect(
      screen.queryByText(/trapped in your laptop/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/what's shipped and what's next/i),
    ).not.toBeInTheDocument();
  });
});
