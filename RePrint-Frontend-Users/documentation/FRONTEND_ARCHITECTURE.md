# Frontend Architecture — RePrint

## Overview

RePrint is a Vue 3 single-page application (SPA) for a 3D-printed-products e-commerce business. It uses **Vite 8** as the build tool, **Vue Router 4** for routing, and **Pinia 4** for state management. It talks to a separate Express backend (`RePrint-API`) but degrades gracefully to built-in mock data, so every page works without the server.

## Tech Stack

| Concern | Choice |
|---------|--------|
| Framework | Vue 3 (`<script setup>` Composition API) |
| Build tool | Vite 8 |
| Routing | Vue Router 4 (HTML5 history) |
| State | Pinia 4 |
| Currency | Intl `toLocaleString('en-ZA')` via `src/currencyReprint.js` |

## Directory Layout

```
src/
├── mainReprint.js          # App bootstrap (Pinia + Router + mount)
├── AppReprint.vue           # Root component (Navbar/Footer + RouterView)
├── style.css                # Global tokens & utilities
├── assets/                  # Images + staff-dashboard.css design system
├── apiReprint.js            # HTTP client + API functions + mock fallbacks
├── currencyReprint.js       # formatRand() helper
├── router/indexRouter.js    # Route table, metadata & guards
├── layouts/StaffLayout.vue  # Staff portal shell (sidebar + topbar)
├── stores/                  # Pinia stores
│   ├── authStores.js
│   ├── cartStores.js
│   ├── productsStores.js
│   └── wishlistStores.js
├── components/              # Navbar, Footer, ProductCard, RatingStars
└── views/                   # Home, Shop, Product, Create, Cart, Wishlist,
                             # Login, Signup, Contact, Admin, and /staff pages
```

## Routing

- Public: `/`, `/shop`, `/product/:id`, `/create`, `/login`, `/signup`, `/contact`, `/cart`, `/wishlist`.
- Admin/HR: `/hr` and `/hr/{employees,shifts,orders,materials}` — guarded by `requiresAuth` + `adminOnly` meta; redirects to `/login` without a token and to `/home` for non-admin token holders.
- Staff portal: nested routes under `/staff` rendered inside `StaffLayout.vue` (no client guard — the login page gates access).

## State Management

| Store | Purpose |
|-------|---------|
| `auth` | Session (token + user), login/register/logout, admin check. |
| `cart` | Line items, quantity, count, subtotal. |
| `wishlist` | Saved products, toggle/add/remove. |
| `products` | Product catalogue; loads from `/products` API with local fallback. |

## Data / API Layer

`src/apiReprint.js` exposes a small `fetch` wrapper and functions for auth, orders, materials, employees and notifications. Every data function wraps its request in `try/catch` and returns realistic mock data on failure — so the UI is fully usable without the backend.

## Two Design Systems

- **Public site** — green/pink palette (`--primary: #558564`, `--accent: #FFCFD2`), Poppins font.
- **Staff portal** — rose/pink palette via `staff-dashboard.css`, Inter font.
