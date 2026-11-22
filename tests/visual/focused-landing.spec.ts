import { expect, test } from "@playwright/test";
import { BETA_PLATFORM_CONFIG } from "../../lib/content";

for (const { locale, width } of [
  { locale: "en", width: 390 },
  { locale: "en", width: 1280 },
  { locale: "he", width: 390 },
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
      locale === "he" ? "rtl" : "ltr",
    );
    // Query the document itself: Playwright locators also pierce the devtools shadow root.
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll("a"), (anchor) =>
        anchor.getAttribute("href"),
      ),
    );
    expect(hrefs).toEqual(
      BETA_PLATFORM_CONFIG.map((platform) =>
        locale === "he" && platform.primaryHref.startsWith("/")
          ? `/${locale}${platform.primaryHref}`
          : platform.primaryHref,
      ),
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await page
      .getByRole("button", {
        name: locale === "he" ? "הצטרפו לבטא" : "Join the beta",
        exact: true,
      })
      .click();
    await expect(page.locator("#join-beta")).toBeFocused();
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(hydrationErrors).toEqual([]);
    await page.addStyleTag({
      content: "nextjs-portal { display: none !important; }",
    });
    await expect(page).toHaveScreenshot(`focused-${locale}-${width}.png`, {
      fullPage: true,
    });
  });
}
