# E‑commerce Frontend (Vue 3 + TypeScript + Vite)

A modern e‑commerce admin/frontend built with Vue 3, Vite, TypeScript, Pinia, PrimeVue, and Tailwind CSS. It integrates with a Node/Prisma backend and optionally Supabase.

## Tech Stack

- **Vue 3** with **TypeScript**
- **Vite 7** for dev/build
- **Pinia 3** for state management (`src/store/`)
- **Vue Router 4** with file‑based routing via `vite-plugin-pages` (`src/pages/`)
- **Layouts** via `vite-plugin-vue-layouts-next` (`src/layouts/`)
- **PrimeVue 4** UI + **Prime Icons** and **@primeuix/themes** (custom Aura preset)
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **Axios** for HTTP to backend API
- **Zod** for schemas/validation (`src/schemas/`)
- Optional: **Supabase** client (`src/supabase.ts`)

## Features

- **Dashboard** with order stats and table (`src/pages/dashboard/index.vue`)
- **Products listing** with pagination and actions (`src/pages/dashboard/products/index.vue`)
- **Reusable components** (`src/components/`)
- **Auto‑imported** Vue/Router/Pinia APIs and PrimeVue components
- **Theming** via custom Prime theme preset (`src/main.ts`)

## Prerequisites

- Node.js 18+ and npm 9+

## Environment Variables

Create `.env` in the project root with:

```
# Base URL for backend API. IMPORTANT: include trailing slash
VITE_API_URL=http://localhost:3000/

# Supabase (optional). Required only if you use Supabase features
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Notes:

- Code concatenates endpoints like `${import.meta.env.VITE_API_URL}orders`, so a trailing slash on `VITE_API_URL` is recommended.
- Supabase client is initialized in `src/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Install & Run

```
npm install
npm run dev
```

- Dev server: http://localhost:5173 (by default)

## Build & Preview

```
npm run build
npm run preview
```

- Output will be generated under `dist/`

## NPM Scripts

- `dev` — Start Vite dev server
- `build` — Type-check via `vue-tsc -b` then build with Vite
- `preview` — Preview the production build locally

## Routing & Layouts

- Routes are generated from files under `src/pages/` using `vite-plugin-pages`.
- Use route meta blocks in SFCs to configure layout and guards:

```vue
<route lang="yaml">
meta:
  layout: "dashboard"
  requiresAuth: true
</route>
```

- Layout components live in `src/layouts/` and are wired by `vite-plugin-vue-layouts-next`.

## UI & Theming (PrimeVue + Tailwind)

- PrimeVue is configured in `src/main.ts` with a custom preset based on Aura:
  - Preset defined via `definePreset(Aura, { ... })`
  - `primeicons` and global styles are imported there
- Tailwind v4 is enabled through `@tailwindcss/vite` in `vite.config.ts` and global CSS in `src/style/global.css`
- PrimeVue components are auto‑imported via `unplugin-vue-components` and `@primevue/auto-import-resolver` (see `vite.config.ts`)

## Auto Imports

- `unplugin-auto-import` provides automatic imports for `vue`, `vue-router`, and `pinia` APIs
- Type declarations generated to `src/auto-imports.d.ts` and `src/components.d.ts`

## State, Schemas, Utilities

- Pinia stores: `src/store/` (e.g., `auth.ts`, `product.ts`, `cart.ts`)
- Zod schemas: `src/schemas/` (e.g., `product.schema.ts`, `checkout.schema.ts`)
- Utilities: `src/utilities/currencyFormat.ts`

## API Endpoints Used

The app expects a backend providing endpoints such as:

- `GET {VITE_API_URL}orders`, `.../orders/count`, `.../orders/delivered-count`, `.../orders/not-delivered-count`, `.../orders/total-price`
- `PUT {VITE_API_URL}orders/:id` to update order status
- `DELETE {VITE_API_URL}orders/:id`
- `GET {VITE_API_URL}products?limit=..&skip=..`, `.../products/length`
- `DELETE {VITE_API_URL}products/:id`

Ensure CORS is enabled on the backend to allow the Vite dev origin.

## Common Issues

- Missing or wrong `VITE_API_URL` (e.g., no trailing slash) can break requests
- CORS errors: configure backend CORS to allow the dev server origin (default http://localhost:5173)
- Type errors during build: run `npm run build` or `vue-tsc -b` to see details
- PrimeVue styles missing: verify `primeicons/primeicons.css` and `src/style/global.css` are imported in `src/main.ts`

## Contributing

- Use feature branches and conventional commits if possible
- Keep components small and typed; prefer composition API

## License

This project is provided as-is. Add your license of choice (e.g., MIT) here.
