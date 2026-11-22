# Threadbase Landing — Codex Instructions

Keep this file to repository-specific behavior and safeguards.
Everything not stated here — project layout, verification commands, commit conventions, and scope boundaries — lives in [CLAUDE.md](CLAUDE.md) and applies unchanged.

## Product claims

By default Threadbase has no hosted service: the app talks only to streamers the user runs, and the site leads with "Threadbase can't read your sessions." An optional relay exists as a side service, off by default. Several pieces of site copy state the boundary as fact, so before writing or changing anything about relays, hosted backends, self-hosting, or sub-processors, read [docs/no-hosted-service.md](docs/no-hosted-service.md) — it lists where those claims live and the rule for wording them.

## Docs site

`/docs` is English-only and lives outside `app/[locale]` on purpose; do not move it under the locale segment.
Check every command, flag, path and default in `content/docs/` against the `tb-streamer` and `tb-mobile` sources, not against the landing copy.
Details are in the "Docs site" section of [CLAUDE.md](CLAUDE.md).

## Issue status updates

Any change traceable to an existing issue ends with a status update on that issue — code, docs, tests, config, a revert, or a deletion all count. The issue is the record; a commit message, a PR body, or a chat reply is not a substitute.

- **Completed** — close the issue, with a comment naming what landed and where (PR or commit).
- **Partly completed** — leave it open and comment with what is done, what remains, and anything the remainder now depends on.
- **Not done** — leave it open and comment with why: blocked, superseded, out of scope, or a precondition that has to change first.

Never close an issue that was not actually finished, and never leave finished work with the issue still open. If one change resolves several issues, update each of them.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
