# Testing Setup — RePrint Frontend

## Stack

- **Vitest 4.x** — test runner, built on Vite.
- **@vue/test-utils** — official Vue 3 component testing utilities.
- **jsdom** — browser-like environment for component and view tests.
- **@vitest/coverage-v8** — V8-based code coverage provider.

## Scripts (`package.json`)

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

## Configuration (`vite.config.js`)

```js
test: {
  environment: 'jsdom',
  globals: true,
  include: ['tests/**/*.test.js'],
  setupFiles: ['tests/setup/test-setup.js'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'json-summary'],
    include: ['src/**/*.{js,vue}'],
    exclude: ['src/mainReprint.js', 'src/router/indexRouter.js'],
  },
}
```

## Test Environment Shims

`tests/setup/test-setup.js` provides:

- `ResizeObserver` stub (not implemented in jsdom).
- `window.scrollTo` no-op (used by `Create.vue`).
- A `localStorage` mock that exposes `getItem/setItem/removeItem/clear`. This is needed because the legacy Node 22 `--localstorage-file` experimental storage is not populated in the jsdom test environment, while many components and stores read/write `localStorage`.

## Conventions

- Tests live under `tests/unit/`.
- Store/tests tests use `setActivePinia(createPinia())` in `beforeEach` to isolate state.
- `vue-router` is mocked where a component only needs `useRouter`/`useRoute` (e.g. `ProductCard`, `Login`), and a real memory-history router is provided where `<RouterLink>` must resolve (e.g. `Home`, `Shop`, `Product`, `Cart`).
- Stable/critical helpers (e.g. `apiReprint`) are tested against their public API; internal `request` is exercised via a stubbed `global.fetch`.

## Running

```bash
npm install
npm test
```
