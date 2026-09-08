# RePrint Frontend

The Vue 3 storefront for RePrint — a custom 3D printing studio. Customers can browse the catalogue, manage a cart and wishlist, create custom designs, book consultations, and sign up or log in. Staff and admins get their own portals for dashboards, orders, inventory, print queue, team and HR.

## Architecture

This repository contains the **frontend only**. The Express + MySQL backend API lives in the separate **RePrint-API** repository.

| Layer | Tool |
|-------|------|
| Frontend | Vue 3 (`<script setup>` SFCs) |
| Build tool | Vite |
| Routing | Vue Router 4 |
| State | Pinia 4 |
| Styling | Scoped CSS with CSS custom properties |
| Auth | JWT (stored in `localStorage` as `reprint_token`) |

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended 20+)
- A running instance of the **RePrint-API** backend on `http://localhost:5000`

### Install

```bash
npm install
```

### Run

```bash
npm run dev        # Vite dev server on http://localhost:5173
```

API requests (`/api` and `/images`) are proxied to `http://localhost:5000` via the Vite config during development.

### Build

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Base URL of the backend API. Override for a hosted backend. |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run test` | Run the Vitest suite |
| `npm run test:coverage` | Run tests with coverage report |

## Project Structure

```
RePrint-Frontend/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite config (Vue plugin, API proxy, Vitest)
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── mainReprint.js          # App bootstrap (Vue, Pinia, Router)
    ├── AppReprint.vue          # Root layout (Navbar + RouterView + Footer)
    ├── apiReprint.js           # HTTP client, auth helpers, session storage
    ├── apiStatus.js            # API/mock-data status flag
    ├── currencyReprint.js      # ZAR currency formatting
    ├── style.css               # Global styles & CSS custom properties
    ├── assets/                 # Images (products, hero, icons), staff CSS
    ├── router/
    │   └── indexRouter.js      # Route definitions & navigation guards
    ├── stores/
    │   ├── authStores.js       # Auth state (login/logout, token, user)
    │   ├── cartStores.js       # Shopping cart
    │   ├── productsStores.js   # Product catalogue (API + fallback)
    │   └── wishlistStores.js   # Wishlist
    ├── components/
    │   ├── NavbarComp.vue      # Sticky nav with cart/wishlist badges
    │   ├── FooterComp.vue      # Site footer
    │   ├── ProductcardComp.vue # Reusable product card
    │   ├── RatingstarsComp.vue # Star rating display
    │   └── DemoDataBanner.vue  # Banner when running on mock data
    ├── layouts/
    │   └── StaffLayout.vue     # Staff portal layout
    └── views/
        ├── Home.vue            # Landing page
        ├── Shop.vue            # Catalogue with filtering
        ├── Product.vue         # Product detail
        ├── Create.vue          # Custom design request
        ├── Cart.vue            # Shopping cart
        ├── Wishlist.vue        # Saved items
        ├── Login.vue           # User login
        ├── Signup.vue          # Registration
        ├── Contact.vue         # Contact
        ├── Admin.vue           # Admin/HR dashboard
        ├── StaffLogin.vue      # Staff login
        ├── StaffDashboard.vue  # Staff overview
        ├── StaffInventory.vue  # Inventory
        ├── StaffOrders.vue     # Orders
        ├── StaffPrintQueue.vue # Print queue
        └── StaffTeam.vue       # Team roster
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/shop` | Browse all products, filter by category |
| `/product/:id` | Product detail, add to cart / wishlist |
| `/create` | Request a custom 3D-printed design |
| `/cart` | Cart, update quantities, checkout |
| `/wishlist` | Saved products |
| `/login` | Login |
| `/signup` | Registration |
| `/contact` | Contact form and team info |
| `/staff/login` | Staff portal login |
| `/staff/*` | Staff dashboard, print queue, inventory, orders, team |
| `/hr/*` | Admin dashboard, employees, shifts, orders, materials |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@reprint.com` | `password123` |
| Customer | `john@example.com` | `password123` |
| Staff | `aisha.d@reprint.co.za` | `staff123` |

## API Integration

The frontend talks to the RePrint-API backend through `src/apiReprint.js`:

- **Base URL**: `VITE_API_URL` (defaults to `/api`).
- **Auth**: JWT Bearer token in `localStorage` under `reprint_token`.
- If the API is unreachable, the app falls back to hardcoded demo data and shows a "demo data" banner.

## Testing

```bash
npm run test
```

Runs the Vitest suite (components, stores, router, API client).
