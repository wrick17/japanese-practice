# Japanese Practice

React app for practicing hiragana and katakana rows.

## Kana Scope

This app teaches the core beginner kana chart: gojuuon, dakuten, handakuten,
and youon rows for both hiragana and katakana.

Extended katakana combinations used mainly for loanwords, such as ファ, ティ,
チェ, ウォ, and ヴァ, are intentionally out of scope for now.

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
