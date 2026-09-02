# RePrint

A full-stack e-commerce storefront for 3D-printed products. The **Vue 3 frontend** lives in [`RePrint-Frontend/`](./RePrint-Frontend) and lets customers browse a curated catalogue of home decor, office, garden, gaming and toy items, manage a shopping cart and wishlist, and sign up or log in to an account. The **Express backend** lives in the sibling [RePrint-API](https://github.com/imaanabrahams/RePrint-API) repository (branch `develop`), which powers the API, authentication, and the HR admin dashboard.

## Tech Stack

| Layer | Tool |
|-------|------|
| Frontend framework | Vue 3 (`<script setup>` SFCs) |
| Build tool | Vite 8 |
| Routing | Vue Router 4 (history mode) |
| State management | Pinia 4 |
| Styling | Scoped CSS with CSS custom properties |
| Backend API | Express/Node (RePrint-API repo) |
| Authentication | JWT + bcrypt |

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- **npm** (ships with Node) or another package manager

### Install

```bash
cd RePrint-Frontend
npm install                    # frontend dependencies
npm install --prefix ../RePrint-API   # backend dependencies
```

Both repositories should sit side by side (e.g. `RePrint/` and `RePrint-API/` in the same folder).

### Run everything (recommended)

```bash
cd RePrint-Frontend
npm run dev:all
```

This starts both servers with a single command:
- Frontend (Vite): **http://localhost:5173**
- Backend (API): **http://localhost:5000**

### Run servers separately

```bash
npm run dev:api      # start only the API on http://localhost:5000 (from ../RePrint-API)
npm run dev          # start only the Vite frontend on http://localhost:5173
```

The app is served at **http://localhost:5173**. API requests (`/api` and `/images`) are proxied to `http://localhost:5000` via the Vite config.

### Run as one website (single server)

Build the frontend, then let the backend host everything:

```bash
npm run build                       # produces dist/
npm run start:api                   # RePrint-API serves the site at http://localhost:5000
```

The backend serves the API, `/images`, and the built frontend from one port.

### Run the tests

```bash
cd RePrint-Frontend
npm test                # run the Vitest suite once
npm run test:watch      # watch mode
npm run test:coverage   # run with a coverage report
```

See [`RePrint-Frontend/documentation/TEST_REPORT.md`](./RePrint-Frontend/documentation/TEST_REPORT.md) for the full test report.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@reprint.com` | `password123` |
| User | `user@reprint.com` | `user123` |

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run dev:api` | Start the RePrint-API backend with auto-reload |
| `npm run dev:all` | Start frontend + backend together |
| `npm run start:api` | Start the RePrint-API backend (no watch) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Base URL for the backend API. Override if your API runs on a different host/port. |

Create a `.env` file in the project root for local overrides. See `.gitignore` for the convention.

## Project Structure

```
RePrint/                  # this repository
├── README.md
└── RePrint-Frontend/     # frontend
    ├── index.html            # HTML entry point
    ├── vite.config.js        # Vite config (Vue plugin, /api + /images proxy to :5000)
    ├── package.json
    ├── public/               # favicon + icons
    ├── tests/                # Vitest unit & component tests
    ├── documentation/        # test report, setup guide, architecture notes
    ├── src/
    │   ├── mainReprint.js    # App bootstrap (Vue, Pinia, Router)
    │   ├── AppReprint.vue    # Root layout (Navbar + RouterView + Footer)
    │   ├── apiReprint.js     # HTTP client, auth helpers, session storage
    │   ├── currencyReprint.js# ZAR currency formatting
    │   ├── style.css         # Global styles & CSS custom properties
    │   ├── router/
    │   │   └── indexRouter.js
    │   ├── stores/           # auth, cart, products, wishlist (Pinia)
    │   ├── layouts/StaffLayout.vue
    │   ├── components/       # Navbar, Footer, ProductCard, RatingStars
    │   ├── views/            # Home, Shop, Product, Create, Cart, Wishlist,
    │   │                     # Login, Signup, Contact, Admin + StaffDashboard,
    │   │                     # StaffInventory, StaffOrders, StaffPrintQueue, ...
    │   └── assets/           # Images (product photos, hero, icons)
    ├── dist/                 # Production build output (served by RePrint-API)
    └── server/               # legacy in-memory demo backend (superseded by RePrint-API)

RePrint-API/              # backend (sibling repo, branch develop)
├── server.js             # Express app: mounts /api, /images, serves dist
├── schema.sql            # reprint_api schema (users, products, orders, HR...)
└── src/routes/           # auth, products, materials, orders, designs, admin,
                          # users, hr, payments, consultations
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
| `/staff/dashboard` | StaffDashboard | Staff overview stats, production queue (staff only) |
| `/staff/print-queue` | StaffPrintQueue | Print production queue (staff only) |
| `/staff/inventory` | StaffInventory | Material stock levels (staff only) |
| `/staff/orders` | StaffOrders | Order management (staff only) |
| `/staff/team` | StaffTeam | Team / employee directory (staff only) |

## State Management

All stores live in `src/stores/` and use Pinia's Composition API style:

- **auth** -- Tracks JWT token and user object in `localStorage`. Exposes `isAuthenticated` and `isAdmin` computed properties.
- **cart** -- In-memory cart with `addToCart`, `updateQuantity`, `removeFromCart`, and `clear`. Derives `count` and `subtotal`.
- **products** -- Loads products from the API on mount; falls back to a hardcoded local catalogue of 10 items if the API is unavailable or returns data without images.
- **wishlist** -- Toggle-based wishlist with `add`, `remove`, and `isWished` check.

## API Integration

The frontend communicates with the Express backend (RePrint-API) through `src/apiReprint.js`:

- **Base URL**: Configurable via `VITE_API_URL` (defaults to `/api`).
- **Authentication**: JWT Bearer token stored in `localStorage` under `reprint_token`. Passwords are hashed with bcrypt.
- **Endpoints**:
  - `GET /api/health` — health check
  - `POST /api/auth/login` — user login
  - `POST /api/auth/register` — new account
  - `POST /api/auth/staff-login` — staff login (employee ID/email + password)
  - `GET /api/products` — product catalogue
  - `GET /api/materials` — materials list (public)
  - `GET /api/orders` — orders (auth)
  - `GET /api/hr/reports/overview` — HR dashboard stats (admin only)
  - `GET /api/hr/employees` — employee list (admin only)
  - `GET /api/hr/shifts` — shift schedule (admin only)
  - `GET /images/*` — product images (served by RePrint-API)
- **Proxy**: Vite rewrites `/api/*` → `http://localhost:5000/*` and proxies `/images` to `http://localhost:5000` during development.

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
- The `/admin` routes require authentication (`meta.requiresAuth`) and admin role (`meta.adminOnly`).
- The staff portal lives under `/staff/*` (login at `/staff/login`).
- Unauthenticated users are redirected to `/admin?login=1` / `/staff/login`.
- Scroll behavior resets to top on every navigation.

## License

This project is private and not currently licensed for public distribution.