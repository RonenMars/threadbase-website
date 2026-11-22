import { expect, test } from "@playwright/test";
import { BETA_PLATFORM_CONFIG } from "../../lib/content";

for (const { locale, width } of [
  { locale: "en", width: 390 },
  { locale: "en", width: 1280 },
  { locale: "he", width: 390 },
  { locale: "en", width: 375 },
  { locale: "en", width: 768 },
  { locale: "en", width: 1440 },
  { locale: "ar", width: 375 },
]) {
  test(`focused landing ${locale} at ${width}px`, async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") hydrationErrors.push(message.text());
    });
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/${locale}/lp`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator("html")).toHaveAttribute(
      "dir",
      ["he", "ar"].includes(locale) ? "rtl" : "ltr",
    );
    // Query the document itself: Playwright locators also pierce the devtools shadow root.
    expect(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("a"), (anchor) =>
          anchor.getAttribute("href"),
        ),
      ),
    ).toEqual(
      Array(2).fill(locale === "en" ? "/lp/beta" : `/${locale}/lp/beta`),
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("main img")).every(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0,
      ),
    );
    const details = page.locator("main details");
    const summary = details.locator("summary");
    await summary.focus();
    await summary.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await summary.press("Enter");
    await expect(details).not.toHaveAttribute("open");
    await page.locator("h1").click();
    expect(hydrationErrors).toEqual([]);
    await page.addStyleTag({
      content: "nextjs-portal { display: none !important; }",
    });
    await expect(page).toHaveScreenshot(`focused-${locale}-${width}.png`, {
      fullPage: true,
    });
    await page.locator("main a").first().click();
    await expect(page).toHaveURL(/\/lp\/beta$/, { timeout: 15_000 });
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() =>
        Array.from(document.querySelectorAll("a"), (anchor) =>
          anchor.getAttribute("href"),
        ),
      ),
    ).toEqual(
      BETA_PLATFORM_CONFIG.map((platform) =>
        locale !== "en" && platform.primaryHref.startsWith("/")
          ? `/${locale}${platform.primaryHref}`
          : platform.primaryHref,
      ),
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    expect(hydrationErrors).toEqual([]);
    await page.addStyleTag({
      content: "nextjs-portal { display: none !important; }",
    });
    await expect(page).toHaveScreenshot(`focused-beta-${locale}-${width}.png`, {
      fullPage: true,
    });
  });
}
