# Japanese Practice

React app for learning hiragana, katakana, and Kanji with character drills and
local word practice.

## Current App State

- Scripts supported now: Hiragana, Katakana, and Kanji.
- Kanji practice contains all 2,230 characters assigned a new or legacy JLPT
  estimate in the pinned `kanji-data` source: N5 (80), N4 (166), N3 (367), N2
  (373), and N1 (1,244).
- Kanji cards show the complete on-yomi, kun-yomi, and English meanings from the
  recorded official KANJIDIC2 snapshot. Source reading notation is preserved:
  on-yomi is normally Katakana and kun-yomi normally Hiragana.
  Reading-to-Kanji prompts include meaning context to disambiguate shared
  readings.
- Clicking a Kana chart or Kanji reference item opens the same revealed details
  in a modal. Clicking the revealed card plays its Japanese audio; the modal
  closes with its button, Escape, or a backdrop click.
- The Kanji reference presents N5 through N1 as full-width group rows; Kana
  charts retain their compact multi-column layout.
- Five-tile Hiragana and Katakana chart rows shrink evenly within each group so
  their left and right padding stays consistent with the Yoon block.
- Kanji audio speaks the first listed on-yomi, or the first kun-yomi when an
  entry has no on-yomi. Kanji readings depend on the word and context, so the
  full reading list remains visible on every revealed card.
- Study modes:
  - Learn, with answers always revealed and the answer control locked.
  - Kana character to romaji, or Kanji to reading, self-check.
  - Romaji to kana character, or reading to Kanji.
  - Words, with a selectable Japanese, romaji, or English prompt.
- The header uses a compact `あ Learning` wordmark and dropdown controls for
  script, mode, prompt, and deck order.
- Wider viewports use a two-column study layout; mobile keeps the compact
  single-column flow, uses a minimum-width Script column with roughly twice the
  flexible space for Mode, and keeps Words prompt, order, and Reset controls on
  one row.
- The practice card keeps a stable size when answers are revealed, its action
  labels stay on one line, revealed values grow to fill their available row and
  fit down to one line without clipping, Japanese stays visually largest, and
  romaji/English use smaller caps. Announce mode does not hide a revealed
  answer.
- Kana cards keep standard romaji beside a pronunciation cue, such as `a(aa)`,
  `shi(shee)`, and `tsu(tsoo)`; Words mode keeps dictionary romaji unchanged.
- Prompts use the available card space and fit down; long Kanji readings and
  meanings can wrap within the card.
- The keyboard-shortcut help button sits beside the deck count and Next button.
- A beginner-friendly, collapsed "How to use the platform" guide explains the
  recommended Learn -> Character to Reading -> Reading to Character flow, plus
  Words practice for kana.
- A collapsed Features guide explains card audio, announce mode, row-aware word
  practice, deck controls, study tools, shortcuts, and saved settings.
- Defaults: Hiragana, vowel row, sequential order, Learn mode, and
  Romaji prompt for Words mode.
- The shuffle toggle applies to character decks; word decks always shuffle.
- Kanji uses Learn, Kanji to Reading, and Reading to Kanji modes. Kana Words
  mode stays separate until a sourced Kanji vocabulary deck is added.
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

## Kanji Scope

Kanji is grouped by N5 through N1 estimates rather than kana-style rows. The
current corpus contains every character with a `jlpt_new` value in the pinned
`kanji-data` snapshot. For the 19 entries where that field is missing but
`jlpt_old` exists, the generator uses the published test-level correspondence:
old 4 to N5, old 3 to N4, old 2 to N2, and old 1 to N1. This produces 2,230
unique characters in total; the generated metadata lists every fallback entry.
It is the complete level-classified corpus, not every Japanese Kanji: 157 of
the 2,136 Jōyō Kanji in the recorded KANJIDIC2 snapshot still have no level in
this estimate source and are excluded instead of being assigned arbitrarily.

The JLPT has not published official vocabulary, kanji, or grammar lists since
the 2010 revision, so these groups are study estimates, not official
requirements. See the [official JLPT FAQ](https://www.jlpt.jp/e/faq/index.html)
for that limitation.

Level assignments and display order come from
[`davidluzgouveia/kanji-data`](https://github.com/davidluzgouveia/kanji-data),
pinned to commit `00fd7079c3890f430759536f91aa5e854ec0ca4f` so the JLPT estimates stay stable.
That project attributes its newer JLPT mapping to Jonathan Waller's
[Tanos JLPT Resources](https://www.tanos.co.uk/jlpt/).
Readings and English meanings come directly from the current official
[KANJIDIC2](https://www.edrdg.org/wiki/KANJIDIC_Project.html) file when the
generator runs. The generated JSON records the KANJIDIC2 database version,
creation date, download URL, and SHA-256 hash so the committed snapshot is
auditable even though the upstream download URL is live.

KANJIDIC2 notation is preserved: on-yomi is normally Katakana, kun-yomi is
normally Hiragana, a dot separates a reading from its okurigana, and a leading
or trailing hyphen marks a reading restricted to that position. Audio removes
only the dot and hyphen notation before speaking. See
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for source licensing and the
transformations applied.

Regenerate it with:

```sh
bun run generate:kanji
```

Regeneration retains the pinned JLPT estimates while refreshing readings and
meanings to the latest official KANJIDIC2 snapshot.

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
bun run generate:kanji
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
