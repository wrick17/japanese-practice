# Japanese Practice

React app for learning hiragana and katakana with row-based character drills
and offline word practice.

## Current App State

- Scripts supported now: Hiragana and Katakana.
- Kanji is not implemented yet; keep new learning data shaped so another script
  can be added later.
- Study modes:
  - Romaji to Japanese character.
  - Japanese character to romaji self-check.
  - Words, with a selectable Japanese, romaji, or English prompt.
- The header uses a compact `あ Learning` wordmark and dropdown controls for
  script, mode, prompt, and deck order.
- Wider viewports use a two-column study layout; mobile keeps the compact
  single-column flow, with the kana chart groups and study notes below the main
  practice/study sections.
- The practice card keeps a stable size when answers are revealed, and announce
  mode does not hide a revealed answer.
- Defaults: Hiragana, vowel row, sequential order, Romaji to Japanese mode.
- The shuffle toggle applies to character decks; word decks always shuffle.
- Settings are stored in `localStorage` under
  `japanese-practice-settings-v1`; Reset restores defaults.
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

## Tooling

- Package manager and script runner: Bun.
- Build tool: Rsbuild with React and PWA plugins.
- Linting: Oxlint with browser, React, JSX a11y, correctness, suspicious, and perf rules.
- Formatting: Oxfmt with 2 spaces, semicolons, double quotes, and 80-column wrapping.
- Tests: Bun test.
- Deployment workflow: GitHub Pages build uses Bun.

## Scripts

```sh
bun install
bun run dev
bun run generate:words
bun run build
bun run preview
bun run lint
bun run format:check
bun run test
```

## Migration Notes

- Migrated package management from Yarn to Bun and replaced `yarn.lock` with `bun.lock`.
- Migrated Vite config/scripts to Rsbuild config/scripts.
- Updated dependencies to Bun-resolved latest versions on July 7, 2026.
- Replaced the Vite PWA plugin with `rsbuild-plugin-pwa` to preserve PWA build behavior.
- Added Oxc tooling config and a small Bun test around selector filtering.
- Added persisted learning modes, sequential/shuffle ordering, reset defaults,
  and generated offline JMdict-Simplified word practice data.
