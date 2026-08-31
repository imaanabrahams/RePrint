# RePrint

A modern e-commerce storefront for 3D-printed products, built with Vue 3 and Vite. RePrint lets customers browse a curated catalogue of home decor, office, garden, gaming and toy items, manage a shopping cart and wishlist, and sign up or log in to an account. An admin dashboard is also included for managing products and orders.

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend framework | Vue 3 (`<script setup>` SFCs) |
| Build tool | Vite 8 |
| Routing | Vue Router 4 (history mode) |
| State management | Pinia 4 |
| Styling | Scoped CSS with CSS custom properties |
| Backend API | Express/Node (`/api` proxy to `localhost:5000`) |

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** (ships with Node) or another package manager

### Install & Run

```bash
# Clone the repository
git clone <repo-url>
cd RePrint

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** by default. API requests (`/api` and `/images`) are proxied to `http://localhost:5000` via the Vite config, so a compatible backend server should be running on that port for full functionality.

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Base URL for the backend API. Override if your API runs on a different host/port. |

Create a `.env` file in the project root for local overrides. See `.gitignore` for the convention.

## Project Structure

```
RePrint/
├── index.html              # HTML entry point
├── vite.config.js          # Vite config (Vue plugin, API proxy)
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── main.js             # App bootstrap (Vue, Pinia, Router)
│   ├── App.vue             # Root layout (Navbar + RouterView + Footer)
│   ├── api.js              # HTTP client, auth helpers, session storage
│   ├── currency.js          # ZAR currency formatting
│   ├── style.css            # Global styles & CSS custom properties
│   ├── router/
│   │   └── index.js         # Route definitions & navigation guards
│   ├── stores/
│   │   ├── auth.js          # Authentication (login/logout, token, user)
│   │   ├── cart.js          # Shopping cart (add, update, remove, totals)
│   │   ├── products.js      # Product catalogue (API + local fallback)
│   │   └── wishlist.js      # Wishlist (toggle, add, remove)
│   ├── components/
│   │   ├── Navbar.vue       # Sticky nav with cart/wishlist badges
│   │   ├── Footer.vue       # Site footer
│   │   ├── ProductCard.vue  # Reusable product card
│   │   └── RatingStars.vue  # Star rating display
│   ├── views/
│   │   ├── HomeView.vue     # Landing page with hero & featured items
│   │   ├── ShopView.vue     # Full catalogue with filtering
│   │   ├── ProductView.vue  # Single product detail page
│   │   ├── CreateView.vue   # Custom design / request page
│   │   ├── CartView.vue     # Shopping cart
│   │   ├── WishlistView.vue # Saved items
│   │   ├── LoginView.vue    # User login
│   │   ├── SignupView.vue   # User registration
│   │   ├── ContactView.vue  # Contact form / info
│   │   └── AdminView.vue    # Admin dashboard (auth-protected)
│   └── assets/              # Images (product photos, hero, icons)
└── dist/                    # Production build output
```

## Pages & Features

| Route | View | Description |
|-------|------|-------------|
| `/` | HomeView | Hero banner, featured products, call-to-action sections |
| `/shop` | ShopView | Browse all products, filter by category |
| `/product/:id` | ProductView | Product detail, options selector, add-to-cart / wishlist |
| `/create` | CreateView | Request a custom 3D-printed design |
| `/cart` | CartView | View cart, update quantities, proceed to checkout |
| `/wishlist` | WishlistView | Saved products for later |
| `/login` | LoginView | Email + password login |
| `/signup` | SignupView | New account registration |
| `/contact` | ContactView | Contact form and team info |
| `/admin` | AdminView | Admin dashboard (requires authenticated admin user) |

## State Management

All stores live in `src/stores/` and use Pinia's Composition API style:

- **auth** -- Tracks JWT token and user object in `localStorage`. Exposes `isAuthenticated` and `isAdmin` computed properties.
- **cart** -- In-memory cart with `addToCart`, `updateQuantity`, `removeFromCart`, and `clear`. Derives `count` and `subtotal`.
- **products** -- Loads products from the API on mount; falls back to a hardcoded local catalogue of 10 items if the API is unavailable or returns data without images.
- **wishlist** -- Toggle-based wishlist with `add`, `remove`, and `isWished` check.

## API Integration

The frontend communicates with a REST API through `src/api.js`:

- **Base URL**: Configurable via `VITE_API_URL` (defaults to `/api`).
- **Authentication**: JWT Bearer token stored in `localStorage` under `reprint_token`.
- **Endpoints used**: `POST /auth/login`, `GET /products`, `GET /health`.
- **Proxy**: Vite proxies `/api` and `/images` to `http://localhost:5000` during development.

## Styling

Global styles and design tokens are defined in `src/style.css` using CSS custom properties:

| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#DAFFEF` | Page background |
| `--bg-card` | `#D0FFD6` | Card / surface background |
| `--primary` | `#558564` | Primary brand green |
| `--accent` | `#FFCFD2` | Accent pink |
| `--dark` | `#0A0B10` | Text color |
| `--star` | `#995E62` | Rating stars & badges |

Components use scoped CSS. The font stack is Poppins with system-ui fallbacks.

## Routing & Guards

- Uses **history mode** (`createWebHistory`).
- The `/admin` route requires authentication (`meta.requiresAuth`) and admin role (`meta.adminOnly`).
- Unauthenticated users are redirected to `/admin?login=1`.
- Scroll behavior resets to top on every navigation.

## License

This project is private and not currently licensed for public distribution.
