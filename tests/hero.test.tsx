import { screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Hero } from "@/components/Hero";
import { renderWithIntl } from "@/tests/test-utils";

const originalUserAgent = navigator.userAgent;
const originalMaxTouchPoints = navigator.maxTouchPoints;

afterEach(() => {
  Object.defineProperty(navigator, "userAgent", {
    configurable: true,
    value: originalUserAgent,
  });
  Object.defineProperty(navigator, "maxTouchPoints", {
    configurable: true,
    value: originalMaxTouchPoints,
  });
});

describe("Hero", () => {
  it("renders the leave-the-desk headline and supporting copy", () => {
    renderWithIntl(<Hero />);
    const root = screen.getByRole("banner") ?? document.body;
    expect(root.textContent).toContain(
      "Leave the desk. Keep the agent working.",
    );
    expect(root.textContent).toContain(
      "Threadbase streams Claude Code, Codex, and GitHub Copilot sessions from your own machines to your phone.",
    );
    expect(root.textContent).toContain(
      "End-to-end encrypted by default between your phone and your machines. Threadbase can't read your sessions.",
    );
  });

  it("renders the pairing video", () => {
    renderWithIntl(<Hero />);
    const image = screen.getByLabelText(
      /threadbase pairing demo: run tb pair, scan the qr code, and the thread is live/i,
    );
    expect(image).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    renderWithIntl(<Hero />);
    expect(
      screen.getByText(
        /claude code, codex, and github copilot, away from your desk/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders 3 platform badges", () => {
    renderWithIntl(<Hero />);
    expect(screen.getByText(/iOS · TestFlight beta/)).toBeInTheDocument();
    expect(screen.getByText(/Android · closed testing/)).toBeInTheDocument();
    expect(
      screen.getByText(/macOS · Linux · Windows streamer/),
    ).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    renderWithIntl(<Hero />);
    const betaCta = screen.getByRole("button", { name: /get the app/i });
    expect(betaCta).toHaveAttribute("href", "https://threadbase.sh/betas");
    const streamerCta = screen.getByRole("button", {
      name: /install the streamer/i,
    });
    expect(streamerCta).toHaveAttribute("href", "#quick-start");
  });

  it.each([
    {
      platform: "Android",
      userAgent: "Mozilla/5.0 (Linux; Android 15; Pixel 9)",
      maxTouchPoints: 5,
      href: "https://threadbase.sh/android-beta",
    },
    {
      platform: "iPhone",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      maxTouchPoints: 5,
      href: "https://testflight.apple.com/join/FqdM3mFK",
    },
    {
      platform: "iPad desktop UA",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      maxTouchPoints: 5,
      href: "https://testflight.apple.com/join/FqdM3mFK",
    },
  ])(
    "routes the beta CTA for $platform",
    async ({ userAgent, maxTouchPoints, href }) => {
      Object.defineProperty(navigator, "userAgent", {
        configurable: true,
        value: userAgent,
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        configurable: true,
        value: maxTouchPoints,
      });

      renderWithIntl(<Hero />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /get the app/i }),
        ).toHaveAttribute("href", href);
      });
    },
  );

  it("does NOT render the old workflow steps or shell stages", () => {
    renderWithIntl(<Hero />);
    expect(screen.queryByText(/Decode JSONL/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Command Palette/i)).not.toBeInTheDocument();
  });
});
