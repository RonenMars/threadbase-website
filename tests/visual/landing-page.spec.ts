import { expect, test } from "@playwright/test";

/**
 * Visual regression suite for the threadbase landing page.
 *
 * What's covered: above-fold + full-scroll screenshots of `/` on desktop +
 * mobile viewports, the `/solutions` stub page, the hero secondary CTA's
 * quick-start link, and the floating-dock scroll-trigger behavior.
 *
 * Determinism strategy (built up across several commits):
 * - `beforeEach`: kills CSS animations + transitions globally so timing-
 *   dependent state (Framer Motion entry, hover, floating-dock fade) doesn't
 *   jitter between Playwright's back-to-back stability screenshots.
 * - `HERO_HEADLINE_MASK`: Playwright `mask` option blacks out GlitchTitle
 *   before diffing — its RAF-driven sweep writes inline styles that beat
 *   any stylesheet override and can't be reliably stopped any other way.
 * - `settleScrollAnimations()`: programmatic scroll-through before full-
 *   page screenshots, so IntersectionObserver-driven section animations
 *   settle before capture.
 *
 * Web server: see playwright.config.ts. We use `npm run dev` with
 * reuseExistingServer:true so a developer's already-running dev server is
 * reused, eliminating cold-start.
 */
test.beforeEach(async ({ page }) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
});

// GlitchTitle drives a chromatic-aberration sweep via requestAnimationFrame,
// writing inline styles on the <h1> that beat any stylesheet override. The
// only reliable way to make screenshots deterministic is to MASK the
// headline element (Playwright paints a solid block over it before diffing).
// Coverage tradeoff: visual regression no longer catches drift in the
// headline rendering (font, color, layout) — but the headline text content
// and structure are covered by the existing Vitest tests in tests/hero.test.tsx.
const HERO_HEADLINE_MASK = ".glitch-title";

/**
 * Scroll the page from top to bottom and back to top, pausing between each
 * step so Framer Motion's `whileInView` / `useInView` IntersectionObserver
 * callbacks fire and the section fade-up animations settle.
 *
 * Without this, full-page screenshots can show empty space below the hero
 * because sections are still at `opacity: 0, y: 28` — their
 * IntersectionObserver never triggered because Playwright didn't scroll.
 */
async function settleScrollAnimations(
  page: import("@playwright/test").Page,
): Promise<void> {
  await page.evaluate(async () => {
    const totalHeight = document.documentElement.scrollHeight;
    const step = window.innerHeight;
    for (let y = 0; y < totalHeight; y += step) {
      window.scrollTo(0, y);
      // Yield to the IntersectionObserver + a single rAF for Framer Motion.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  });
  // Wait the longest fade-up animation duration so all sections complete.
  await page.waitForTimeout(800);
}

/**
 * The hero <video> autoplays and loops; a screenshot would capture whichever
 * frame playback is on. Pause it and rewind to frame 0 so every run diffs the
 * same frame.
 */
async function freezeHeroVideo(
  page: import("@playwright/test").Page,
): Promise<void> {
  await page.waitForFunction(() => {
    const video = document.querySelector("video");
    return video !== null && video.readyState >= 2;
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const video = document.querySelector("video") as HTMLVideoElement;
        video.pause();
        if (video.currentTime === 0) return resolve();
        video.addEventListener("seeked", () => resolve(), { once: true });
        video.currentTime = 0;
      }),
  );
}

test("home page above the fold", async ({ page }) => {
  await page.goto("/");
  // Wait for fonts so Geist's metrics are stable before the screenshot.
  await page.evaluate(() => document.fonts.ready);
  await freezeHeroVideo(page);
  await expect(page).toHaveScreenshot("home-above-fold.png", {
    fullPage: false,
    clip: { x: 0, y: 0, width: 1440, height: 900 },
    mask: [page.locator(HERO_HEADLINE_MASK)],
  });
});

test("home page full scroll", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await freezeHeroVideo(page);
  await settleScrollAnimations(page);
  await expect(page).toHaveScreenshot("home-full.png", {
    fullPage: true,
    mask: [page.locator(HERO_HEADLINE_MASK)],
  });
});

test("solutions stub page", async ({ page }) => {
  await page.goto("/solutions");
  await page.evaluate(() => document.fonts.ready);
  // /solutions has no GlitchTitle; no mask needed. Also no scroll-triggered
  // sections (the page fits in a single viewport), so no settle call.
  await expect(page).toHaveScreenshot("solutions.png", { fullPage: true });
});

test("hero secondary CTA links to the quick-start anchor", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const installLink = page.getByRole("button", {
    name: /install the streamer/i,
  });
  await expect(installLink).toBeVisible();
  await expect(installLink).toHaveAttribute("href", "#quick-start");
});

test("floating dock appears after scrolling past hero", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const dock = page.getByRole("link", { name: /threadbase on github/i });
  // Initially hidden (dock activates above the 80px scroll threshold).
  await expect(dock).toBeHidden();
  await page.evaluate(() => window.scrollTo({ top: 400 }));
  await expect(dock).toBeVisible();
});
