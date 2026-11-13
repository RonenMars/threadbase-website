import { describe, expect, it } from "vitest";
import {
  FEATURE_CONFIG,
  FOOTER_LINK_CONFIG,
  HERO_CTA_CONFIG,
  NAV_LINK_CONFIG,
  QUICK_START_LINK_CONFIG,
} from "@/lib/content";
import arTranslations from "@/locales/ar.json";
import enTranslations from "@/locales/en.json";
import heTranslations from "@/locales/he.json";
import ruTranslations from "@/locales/ru.json";

const translations = {
  en: enTranslations,
  ru: ruTranslations,
  he: heTranslations,
  ar: arTranslations,
};

function scalarPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      scalarPaths(item, prefix ? `${prefix}.${index}` : String(index)),
    );
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, item]) =>
      scalarPaths(item, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

describe("i18n content catalogs", () => {
  it("ships exactly the planned locales", () => {
    expect(Object.keys(translations)).toEqual(["en", "ru", "he", "ar"]);
  });

  it("keeps the English hero headline in locales/en.json", () => {
    expect(enTranslations.home.hero.headline).toBe(
      "Find what your agents already solved.",
    );
  });

  it("keeps hero structure in lib/content.ts", () => {
    expect(HERO_CTA_CONFIG).toHaveLength(2);
    expect(HERO_CTA_CONFIG[0]).toMatchObject({
      href: "https://testflight.apple.com/join/FqdM3mFK",
      variant: "primary",
    });
    expect(HERO_CTA_CONFIG[1]).toMatchObject({
      href: "#quick-start",
      variant: "outline",
    });
  });

  it("keeps workflow icon structure out of translated copy", () => {
    expect(FEATURE_CONFIG.map((feature) => feature.icon)).toEqual([
      "BellRinging",
      "CheckSquare",
      "Microphone",
      "ArrowsClockwise",
      "MagnifyingGlass",
      "Desktop",
    ]);
  });

  it("keeps locale key parity for every scalar value", () => {
    const sourcePaths = scalarPaths(enTranslations).sort();
    for (const [locale, catalog] of Object.entries(translations)) {
      expect(scalarPaths(catalog).sort(), locale).toEqual(sourcePaths);
    }
  });

  it("keeps homepage array lengths aligned with the structural config", () => {
    for (const catalog of Object.values(translations)) {
      expect(catalog.home.features.items).toHaveLength(FEATURE_CONFIG.length);
      expect(catalog.home.honestCons.items).toHaveLength(5);
      expect(catalog.home.security.highlights).toHaveLength(4);
      expect(catalog.home.security.cantSee).toHaveLength(5);
    }
  });

  it("preserves terminal commands verbatim in every locale", () => {
    for (const catalog of Object.values(translations)) {
      expect(catalog.home.quickStart.steps).toContain(
        "npm install -g @threadbase-sh/streamer",
      );
      expect(catalog.home.quickStart.steps).toContain(
        "brew install tb-streamer",
      );
      // `serve` creates the API key on first run, so the old `set-key` step is gone.
      expect(catalog.home.quickStart.steps.join("\n")).not.toContain("set-key");
      expect(catalog.home.quickStart.steps).toContain("tb-streamer serve");
    }
  });

  it("keeps the refreshed homepage claims precise", () => {
    const frontPageCopy = JSON.stringify(enTranslations.home).toLowerCase();

    expect(frontPageCopy).toContain("codex");
    expect(frontPageCopy).toContain(
      "permission prompts and questions arrive as cards",
    );
    expect(frontPageCopy).toContain("full-text search across every session");
    expect(frontPageCopy).toContain(
      "adopt a session you started in your terminal",
    );
    expect(frontPageCopy).not.toContain("resume support is still");
    expect(frontPageCopy).not.toContain("native prompt cards");
    // Was a `not.toContain` guard: the homepage listed Live Activities among
    // the shipped notification features while the streamer could only send
    // them with the operator's own APNs credentials. HonestCons now names that
    // exact constraint, so the mention stands only in its caveated form.
    expect(frontPageCopy).toContain(
      "ios live activities are opt-in on the streamer and need your own apns credentials",
    );
    // Was a `not.toContain` guard: the site over-claimed E2EE before the
    // streamer shipped it. E2EE is on by default since streamer 1.76
    // (Noise IK, X25519 + ChaCha20-Poly1305), so the claim now stands — but
    // only with the named primitives, so it stays falsifiable.
    expect(frontPageCopy).toContain("end-to-end encrypted by default");
    expect(frontPageCopy).toContain("noise ik");
    expect(frontPageCopy).not.toContain("never talks to a threadbase server");
    // The relay is optional and off by default, so the default story stays
    // "no Threadbase server in the path"; the claim is scoped, not dropped.
    expect(enTranslations.home.security.description).toContain(
      "by default your phone talks straight to it — no Threadbase server in between",
    );
    expect(enTranslations.home.security.heading).not.toMatch(
      /no threadbase session relay/i,
    );
  });

  it("disclaims every AI tool vendor the product names, in every locale", () => {
    for (const [locale, catalog] of Object.entries(translations)) {
      for (const vendor of ["Anthropic", "OpenAI", "Cursor"]) {
        expect(catalog.footer.disclaimer, locale).toContain(vendor);
      }
    }
  });

  it("footer and nav links cover the core surfaces", () => {
    const hrefs = FOOTER_LINK_CONFIG.map((link) => link.href);
    expect(NAV_LINK_CONFIG).toHaveLength(7);
    expect(
      hrefs.some((href) => href.includes("github.com/RonenMars/threadbase")),
    ).toBe(true);
    expect(hrefs).toContain("/betas");
    expect(hrefs).toContain("/docs");
    expect(hrefs.some((href) => href.includes("/issues"))).toBe(true);
    expect(hrefs).toContain("/support");
    expect(hrefs).toContain("/privacy-policy");
    expect(QUICK_START_LINK_CONFIG.map((link) => link.href)).toContain(
      "/android-beta",
    );
  });

  // The privacy and support pages .map() over these keys via t.raw(). A key missing
  // from one locale renders fine in the others and hard-500s that route in prod.
  it.each([
    ["pages.privacy", "automaticReporting"],
    ["pages.privacy", "crashReportingDetails"],
    ["pages.privacy", "feedbackDetails"],
    ["pages.privacy", "permissions"],
    ["pages.privacy", "permissionsHeaders"],
    ["pages.privacy", "relayDetails"],
    ["pages.privacy", "staysOnDevice"],
    ["pages.privacy", "trafficCategories"],
    ["pages.privacy", "webDetails"],
    ["pages.privacy", "yourControl"],
    ["pages.support", "requestDetails"],
    ["pages.support", "topics"],
  ])("%s.%s is a non-empty array in every locale", (namespace, key) => {
    const [group, page] = namespace.split(".");
    for (const [locale, catalog] of Object.entries(translations)) {
      const value = (
        catalog as unknown as Record<
          string,
          Record<string, Record<string, unknown>>
        >
      )[group][page][key];
      expect(Array.isArray(value), `${locale}: ${namespace}.${key}`).toBe(true);
      expect(
        (value as unknown[]).length,
        `${locale}: ${namespace}.${key}`,
      ).toBeGreaterThan(0);
    }
  });
});

/**
 * The uninstall claim, guarded.
 *
 * Both of these strings used to say uninstalling deletes everything stored
 * locally, full stop. That is false on iOS: the app stores server credentials
 * via expo-secure-store with no `keychainAccessible` option and no first-run
 * clear, so Keychain entries survive an uninstall and are restored on reinstall
 * (tb-mobile `stores/servers.ts` says so in a code comment).
 *
 * The page tests assert headings only, which is how an inaccurate disclosure sat
 * on a published policy that App Store Connect points at. These assert the
 * claim itself, in every locale, so re-simplifying the sentence fails the build
 * rather than shipping.
 */
describe("privacy policy — uninstall claim", () => {
  // Written per locale rather than as one regex: the point is that the caveat
  // was actually translated, not that some Latin-script token survived.
  const SECURE_STORE_MARKER: Record<string, string> = {
    en: "Keychain",
    ru: "Keychain",
    he: "Keychain",
    ar: "Keychain",
  };

  for (const [locale, catalog] of Object.entries(translations)) {
    const privacy = (
      catalog as unknown as {
        pages: { privacy: { uninstallBody: string; yourControl: string[] } };
      }
    ).pages.privacy;

    it(`${locale}: the uninstall paragraph qualifies the claim`, () => {
      expect(privacy.uninstallBody).toContain(SECURE_STORE_MARKER[locale]);
    });

    it(`${locale}: the "Your control" bullet qualifies it too`, () => {
      const bullet = privacy.yourControl.find((b) =>
        b.includes(SECURE_STORE_MARKER[locale]),
      );
      expect(
        bullet,
        "no yourControl bullet mentions the secure store",
      ).toBeDefined();
    });
  }
});

/**
 * The push-token claim, guarded.
 *
 * The policy used to say "Removing a server revokes its push token." Removing a
 * server only clears that server's credentials from the device; the streamer
 * keeps the token until the device is revoked. The false version sat on a
 * published policy for months. `pages.privacy.pushBody` carried the identical
 * false sentence independently of `yourControl` — the interim fix (commit
 * b43b531) only touched `yourControl`, so `pushBody` stayed wrong until now.
 *
 * The mobile app shipped an in-app revoke flow (Settings → Paired devices →
 * Revoke), which deletes the push token immediately — verified against
 * tb-streamer's `/api/devices/:id/revoke` route, which calls `dropPushTokens`.
 * That supersedes the streamer-side `tb-streamer devices revoke` CLI command
 * as the thing this copy should point users at, so both spots now name the
 * in-app screen instead.
 */
describe("privacy policy — push-token claim", () => {
  // Written per locale rather than as one regex: same reasoning as
  // SECURE_STORE_MARKER above — a translated marker, not a surviving Latin token.
  const PAIRED_DEVICES_MARKER: Record<string, string> = {
    en: "Paired devices",
    ru: "Привязанные устройства",
    he: "מכשירים מקושרים",
    ar: "الأجهزة المقترنة",
  };

  it.each(Object.entries(translations))(
    "%s: the push-token bullet and pushBody point at the in-app Paired devices revoke",
    (locale, catalog) => {
      const privacy = (
        catalog as unknown as {
          pages: { privacy: { yourControl: string[]; pushBody: string } };
        }
      ).pages.privacy;
      const marker = PAIRED_DEVICES_MARKER[locale];

      expect(
        privacy.yourControl.some((bullet) => bullet.includes(marker)),
        "no yourControl bullet names the in-app Paired devices screen",
      ).toBe(true);
      expect(
        privacy.pushBody.includes(marker),
        "pushBody doesn't name the in-app Paired devices screen",
      ).toBe(true);
    },
  );

  it("no longer claims removing a server alone revokes its token", () => {
    expect(enTranslations.pages.privacy.pushBody).not.toContain(
      "Removing a server in Settings revokes its token.",
    );
  });
});
