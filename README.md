# Holy Grind

[![CI](https://github.com/tab/holy-grind/actions/workflows/master.yaml/badge.svg)](https://github.com/tab/holy-grind/actions/workflows/master.yaml)
[![codecov](https://codecov.io/gh/tab/holy-grind/graph/badge.svg?token=M8DDCXDOV9)](https://codecov.io/gh/tab/holy-grind)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Holy Grind** is a coffee grinder settings converter. Pick a source grinder and setting, pick a target grinder, and get the converted setting via linear interpolation.

Data by [The Welder Catherine](https://theweldercatherine.ru/blog/articles/oborudovanie/svyashchennyy-pomol-chast-5/) — 63 grinders, 21 coarseness levels.

## Development

```bash
# Start dev server (port 5173)
yarn dev

# Run linter
yarn lint

# Run unit tests
yarn test

# Run unit tests with coverage
yarn test:coverage

# Run E2E tests (requires Playwright chromium)
yarn test:e2e

# Production build
yarn build
```

## License

Distributed under the MIT License. See `LICENSE` for more information.
