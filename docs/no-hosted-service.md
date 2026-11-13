# Hosted services and the "Threadbase can't read your sessions" claim

**Status as of 2026-10-08: there is an optional hosted service, the Threadbase Relay, and it is off by default.** By default the app talks only to streamers the user runs, and nothing routes through a Threadbase-operated server.
The relay is a side service for people who want the simplest setup, with no tunnel, port forwarding or VPN.
It only exists for a user who turns it on.
That holds for stable streamer releases only: the `next` channel turned the relay on by default in [streamer #1067](https://github.com/RonenMars/threadbase-streamer/pull/1067), and the app's per-server relay switch is on by default, so every "by default" and "turn it on" claim listed here must change before #1067 reaches the streamer's `main`.

This file used to list the claims a hosted service would falsify, and said not to hedge them early.
The relay is that event, so the claims below were changed together in one pass.
It stays as the checklist for the next change in this area: anything that adds a Threadbase-operated server to a path the site describes.

## The rule

The site leads with **"Threadbase can't read your sessions."** and the default story is self-hosting.
It replaced "Nothing leaves your machines.", which was never true as an absolute: sessions stream to the phone, push tokens go to Expo, and the relay carries encrypted traffic for anyone who turns it on.
Every statement about the relay has to stay true for both kinds of user, the one who never turns it on and the one who does.

- Say **"by default"** or **"unless you turn on the optional relay"** rather than an absolute the relay breaks.
- Say what the relay can and cannot see. It cannot read prompts, transcripts, approvals, files or terminal output, and holds no key that could. It can see connection metadata: the client's IP address, a route id derived from the streamer's public key, request method and path, timing and byte counts.
- Never replace a true statement with a vague one. "Your data is private" is worse than the specific sentence.
- Do not claim the relay is available to users until the app and streamer ship it. At the time of writing the streamer's `relay` feature flag is off by default and described as "in development".

## Where the claims live

All in `locales/*.json` unless noted, with he/ar/ru counterparts that must change together (the docs are English-only).

| Key | What it says now |
|---|---|
| `home.hero.subheadline` | Makes no privacy or relay claim since the 2026-11-02 search-first rewrite (it used to end with "Threadbase can't read your sessions."). Keep it that way, or add the claim to this table. |
| `home.security.heading` | Leads with "Threadbase can't read your sessions." |
| `home.security.description` | By default the phone talks straight to the streamer; no Threadbase server in between. |
| `home.security.cantSee[0]` | Never readable by Threadbase; touches a Threadbase server only if the optional relay is on, and then only as encrypted bytes. |
| `home.security.scopeNote` | Describes the relay as an optional, off-by-default side service and what it can see. |
| `home.faq.items[5].answer` | "Self-host the streamer on your own machines." Still true as written; revisit when the relay's pricing or limits are decided. |
| `pages.support.privacyBeforeLink` | Thin client for streamers you host; connects straight to them by default; optional relay in beta, off in stable streamer releases. |
| `pages.privacy` | Section 7 covers the relay; Fly.io is listed as a sub-processor; section 1, the traffic list and "What we do not collect" are scoped to "by default". |
| `content/docs/index.mdx` | Callout describes the optional relay and what it sees. |
| `.agents/product-marketing.md` | "self-hosted by default (optional relay)" in the proof points. |

Outside this repo, kept in step with this file (reported, not edited from here):

- `docs/FEATURES.md`, `README.md` and `docs/no-hosted-service.md` (threadbase-mobile) describe the relay as a beta and must change in the same pass.

## What else the relay drags in

- **The privacy policy has a new processor.** Fly.io hosts the relay, in Amsterdam (`primary_region = "ams"` in `threadbase-relay/fly.toml`). The policy's sub-processor list is Expo, Apple, Sentry, MailerLite and Fly.io.
- **Policy changes go through the repo's own tooling.** Editing `pages.privacy` turns `tests/privacy-meta.test.ts` red until `npm run bump-privacy-date` has run. See `docs/plans/2026-09-06-privacy-content-hash.md`.
- **Sentry's IP setting is per-project.** The `threadbase` project has "Prevent Storing of IP Addresses" enabled. A relay reporting into a *new* Sentry project starts without it, so turn it on at project creation; it only affects events ingested afterwards.
- **The web-version diagnostics sentence stays unwritten.** The Anonymous Diagnostics spec (§17) has a clause about Sentry not using a visitor's IP as a substitute identity on web. It is absent from the policy because there is no web version to describe.
- **Re-check the facts before each change.** The relay's logging and hosting are defined by `threadbase-relay` (`src/`, `fly.toml`) and `tb-streamer/docs/architecture/2026-10-04-threadbase-relay.md` (sections 4, 6, 7, 9). Copy comes from there, not from memory.

## Before the relay-copy PR can merge

- **No mailing address is published.** The footer names the operator and gives `privacy@threadbase.sh` only (`pages.privacy.operatorBody`, all four locales). Whether that is enough is a lawyer item below, so do not merge before it is answered.
- **Operator identity.** The policy names the operator as an individual, Ronen Mars, with no company and `privacy@threadbase.sh` as the contact. Other pages keep `support@threadbase.sh`.
- **Lawyer items, still open:** whether an EU representative is needed (GDPR Art. 27) and whether the DSA trader rules apply; the controller role for the relay; the retention figures; Israeli privacy law, including Amendment 13; the App Store and Google Play data labels.
- **Fly.io DPA** has been requested and is not yet answered. The policy cites the EU–US Data Privacy Framework certification, not a DPA.
- **Retention figures are the hosting provider's:** application logs up to 7 days, managed metrics up to about 15 days. Re-check them with `fly` before merging.
- **Re-check the relay facts** against `threadbase-relay` main (last checked at `7b9cccf`). The deployed Fly build predates the logging changes in #7–#9 and #12, so the policy describes the build that has to be deployed first.
- **The relay is free and the FAQ is unchanged.**
