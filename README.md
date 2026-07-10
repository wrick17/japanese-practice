# Japanese Practice

React app for learning hiragana and katakana with row-based character drills
and local word practice.

## Current App State

- Scripts supported now: Hiragana and Katakana.
- Kanji is not implemented yet; keep new learning data shaped so another script
  can be added later.
- Study modes:
  - Romaji to Japanese character.
  - Japanese character to romaji self-check.
  - Learn, with answers always revealed and the answer control locked.
  - Words, with a selectable Japanese, romaji, or English prompt.
- The header uses a compact `あ Learning` wordmark and dropdown controls for
  script, mode, prompt, and deck order.
- Wider viewports use a two-column study layout; mobile keeps the compact
  single-column flow, with the kana chart groups and study notes below the main
  practice/study sections.
- The practice card keeps a stable size when answers are revealed, its action
  labels stay on one line, revealed values grow to fill their available row
  without clipping, Japanese stays visually largest, and romaji/English use
  smaller caps. Announce mode does not hide a revealed answer.
- Kana cards keep standard romaji beside a pronunciation cue, such as `a(aa)`,
  `shi(shee)`, and `tsu(tsoo)`; Words mode keeps dictionary romaji unchanged.
- Defaults: Hiragana, vowel row, sequential order, Romaji to Japanese mode, and
  Romaji prompt for Words mode.
- The shuffle toggle applies to character decks; word decks always shuffle.
- Settings are stored in `localStorage` under
  `japanese-practice-settings-v1`; Reset restores defaults.
- Keyboard shortcuts are available from the `?` popup in the header.
- Existing service workers from older PWA builds are unregistered on app load.
- The timer feature was removed.

## Kana Scope

This app teaches the core beginner kana chart: gojuuon, dakuten, handakuten,
and youon rows for both hiragana and katakana.

Extended katakana combinations used mainly for loanwords, such as ファ, ティ,
チェ, ウォ, and ヴァ, are intentionally out of scope for now.

## Word Bank

Word practice uses `src/constants/wordsV2.json`, generated from the
JMdict-Simplified English common word archive. The app imports this compact
file directly, so the deployed site does not need a backend or runtime API.

Regenerate it with:

```sh
bun run generate:words
```

The generator downloads the latest JMdict-Simplified common English archive,
keeps only words that can be segmented into the kana rows this app already
teaches, stores the first English gloss, and writes stable formatted JSON.

## Keyboard Shortcuts

Open the legend with the `?` button or the `?` key. Close it with `Esc`, the
Close button, or a click outside the popup.

Pointer-activated controls release focus so shortcuts resume immediately.
Controls reached with the keyboard retain native Tab and Enter/Space behavior.

- `Space`: reveal or hide the answer outside Learn mode.
- `Enter`: move to the next card.
- `P`: play the Japanese audio.
- `A`: start or stop announce mode.
- `Esc`: close the popup.

## Tooling

- Package manager and script runner: Bun.
- Build tool: Rsbuild with the React plugin.
- Linting: Oxlint with browser, React, JSX a11y, correctness, suspicious, and perf rules.
- Formatting: Oxfmt with 2 spaces, semicolons, double quotes, and 80-column wrapping.
- Tests: Bun test.
- Deployment target: Cloudflare Pages.
- CI workflow: pushes to `master` install, format-check, lint, test, and build.
- Deployment workflow: Cloudflare Pages Git integration builds and deploys
  pushes to `master`.

## Cloudflare Pages

- Pages project: `japanese-practice`.
- Production branch: `master`.
- Build command: `bun run build`.
- Build output directory: `dist`.
- Automatic production branch deployments: enabled.
- Git source: `wrick17/japanese-practice`.
- Custom domain: `japanese.wrick17.com`.
- DNS target: `japanese-practice-c5y.pages.dev` after the custom domain is added
  to the Pages project.
- Do not only add the DNS CNAME; attach the custom domain to the Pages project
  first so Cloudflare provisions the route/certificate correctly.
- DNS record: proxied CNAME `japanese.wrick17.com` to
  `japanese-practice-c5y.pages.dev`.
- GitHub Actions validates only; it does not deploy. Use `bun run deploy` only
  for an explicit manual Direct Upload fallback.

## Scripts

```sh
bun install
bun run dev
bun run generate:words
bun run build
bun run deploy
bun run preview
bun run lint
bun run format:check
bun run test
```

## Migration Notes

- Migrated package management from Yarn to Bun and replaced `yarn.lock` with `bun.lock`.
- Migrated Vite config/scripts to Rsbuild config/scripts.
- Updated dependencies to Bun-resolved latest versions on July 7, 2026.
- Removed PWA generation; the app ships as a standard static React site and
  unregisters service workers left by older PWA builds.
- Added Oxc tooling config and a small Bun test around selector filtering.
- Added persisted learning modes, sequential/shuffle ordering, reset defaults,
  and generated local JMdict-Simplified word practice data.
