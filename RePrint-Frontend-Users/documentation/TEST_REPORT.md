# RePrint Frontend — Test Report

**Date:** 2026-09-02
**Branch:** develop
**Framework:** Vitest 4.1.11 + @vue/test-utils + jsdom
**Command:** `npm test` (or `npx vitest run`)

## Result: ALL PASSING ✅

| Metric | Value |
|--------|-------|
| Test files | 20 passed (20) |
| Tests | 115 passed (115) |
| Failures | 0 |
| Duration | ~8 seconds |

## Coverage Summary (v8 provider)

Run `npm run test:coverage` to regenerate.

| File | % Stmts | % Branch | % Funcs | % Lines |
|------|---------|----------|---------|---------|
| **All files** | **45.76** | **42.62** | **45.23** | **45.90** |
| src (app shell + api) | 72.22 | 76.66 | 52.38 | 73.13 |
| apiReprint.js | 77.77 | 79.16 | 55.55 | 78.33 |
| src/components | 95.83 | 100 | 88.88 | 95.58 |
| NavbarComp.vue | 92.85 | 100 | 81.81 | 92.30 |
| ProductcardComp.vue | 94.11 | 100 | 80 | 94.11 |
| src/stores | 96.66 | 82.35 | 100 | 98.59 |
| cartStores.js | 100 | 95.45 | 100 | 100 |
| productsStores.js | 88.88 | 65.21 | 100 | 95.45 |
| src/views | 33.38 | 34.52 | 30.24 | 33.95 |
| Cart.vue | 96 | 100 | 88.88 | 95.65 |
| Contact.vue | 90.47 | 100 | 75 | 89.47 |
| Create.vue | 89.47 | 96.87 | 66.66 | 88.88 |
| Login.vue | 100 | 96.29 | 100 | 100 |
| Product.vue | 86 | 94.44 | 62.5 | 87.50 |
| Signup.vue | 100 | 97.22 | 100 | 100 |
| Wishlist.vue | 95 | 94.11 | 85.71 | 94.73 |

> Note: The staff-dashboard views (StaffDashboard, StaffInventory, StaffLogin, StaffOrders, StaffPrintQueue, StaffTeam), Admin.vue and StaffLayout.vue are **not yet covered**. They are large, auth-heavy pages that fetch from a backend. These are the natural next targets to raise overall coverage.

## What Was Tested

### Stores (Unit) — guaranteed behaviour of state + getters + actions
- `cartStores.js` — add, increment, option keying, quantity update, removal, clearing, subtotal/count.
- `wishlistStores.js` — add without duplicates, toggle, remove, `isWished`.
- `authStores.js` — login/register/logout, session restore from localStorage, admin detection.
- `productsStores.js` — local-catalog initialisation, `byId`, `featured`, API load with success/empty/error fallback.

### Utilities (Unit)
- `currencyReprint.js` — `formatRand` Rand formatting and null/undefined "em dash".
- `apiReprint.js` — session helpers, mock-data fallbacks, login request + error handling.

### Components
- `RatingstarsComp` — star count, rounding, custom size, aria-label.
- `ProductcardComp` — rendering, add-to-cart, wishlist toggle, navigation, light variant.
- `NavbarComp` — links, signup/account CTA, admin HR link, cart/wishlist badges.
- `FooterComp` — brand, links, current year, conditional staff column.

### Views
- `Home` — hero, CTAs, steps, testimonials.
- `Shop` — product grid, category filtering, item count.
- `Product` — detail rendering, option default, add-to-cart, not-found state.
- `Cart` — empty state, item list, quantity stepper, remove, shipping/free-shipping logic, checkout.
- `Wishlist` — empty state, list, add-to-cart, remove, navigation.
- `Login` — validation, success redirect, error display.
- `Signup` — validation, password-match guard, success redirect, error display.
- `Create` — product types, swatches, size selection, quantity clamps, success state.
- `Contact` — form validation, success message, info cards.

### Router
- `router definitions` — public routes, admin guard metadata, `/admin` → `/hr` redirect, staff child titles.

## How to Run

```bash
npm install          # installs dev/test deps
npm test             # run once
npm run test:watch   # watch mode
npm run test:coverage# run with coverage report
```

## Files Added / Changed

### New test files (`tests/`)
- `tests/setup/test-setup.js` — jsdom shims (ResizeObserver, scrollTo, localStorage mock).
- `tests/unit/cartStore.test.js`
- `tests/unit/wishlistStore.test.js`
- `tests/unit/authStore.test.js`
- `tests/unit/productsStore.test.js`
- `tests/unit/currency.test.js`
- `tests/unit/api.test.js`
- `tests/unit/RatingStars.test.js`
- `tests/unit/ProductCard.test.js`
- `tests/unit/Navbar.test.js`
- `tests/unit/Footer.test.js`
- `tests/unit/Home.test.js`
- `tests/unit/Shop.test.js`
- `tests/unit/Product.test.js`
- `tests/unit/Cart.test.js`
- `tests/unit/Wishlist.test.js`
- `tests/unit/Login.test.js`
- `tests/unit/Signup.test.js`
- `tests/unit/Create.test.js`
- `tests/unit/Contact.test.js`
- `tests/unit/router.test.js`

### Config / code changes
- `package.json` — added `test`, `test:watch`, `test:coverage` scripts + dev deps (vitest, @vue/test-utils, jsdom, @vitest/coverage-v8).
- `vite.config.js` — added `test` block (jsdom, globals, include, setupFiles, coverage).
- `src/router/indexRouter.js` — exported `routes` for testability (no behaviour change).
- `.gitignore` — ignore generated `coverage/` output.
