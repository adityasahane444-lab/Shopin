# Shopin — Mobile-first e-commerce website

Shopin is a Next.js + React + TypeScript shopping website with a responsive desktop storefront and a dedicated mobile shopping experience.

## Main shopping flows

- Home storefront
- Product search and suggestions
- Category navigation
- Product listing with filters
- Sorting by price, rating and discount
- Product detail pages
- Wishlist
- Cart
- Checkout
- COD / UPI / Card demo payment selection
- Order creation and tracking timeline
- Account and profile editing
- Saved addresses with add / edit / delete
- Customer/admin demo accounts
- Admin product and order controls

## Mobile UI update

The mobile layout is intentionally designed as a separate mobile composition rather than simply shrinking the desktop UI. It includes:

- Shopin-branded shortcut tiles
- Delivery/location row
- Large rounded search bar
- Icon-based horizontal category rail
- Promotional carousel
- Personalized horizontal product rails
- Deals section
- Dedicated Categories screen with a left category rail
- Account hub with quick actions
- Mobile cart purchase bar
- Mobile product-page buy bar
- Fixed five-item bottom navigation: Home, Deals, Categories, Account, Cart

The layout is inspired by familiar Indian shopping-app interaction patterns shown in the supplied mobile reference screenshots, but uses Shopin branding, original UI copy and non-Flipkart product/brand assets.

## Product catalog

The supplied original ZIP's explicit catalog is bundled in `public/catalog/original-plus-products.json`. The project can also import the larger public catalog referenced by the original project and caches it in the browser.

## Local data model

This version is a self-contained demo. User accounts, profile edits, cart, wishlist, addresses and orders are persisted in browser `localStorage` with per-user storage keys.

That means the same user does not automatically share server-side data between different devices or browsers. For a real multi-user production marketplace, move accounts/orders/cart/address data to a database and server-side authentication.

## Demo accounts

Customer:

`demo@shopin.in` / `shopin123`

Admin:

`admin@shopin.in` / `admin123`

## Local development

Requirements:

- Node.js 24.x is the recommended runtime for this release.
- npm

Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run typecheck
npm run build
npm run start
```

## Vercel deployment

The repository includes `vercel.json`, a Node 24 pin and a dedicated `DEPLOYMENT.md` guide. Vercel detects Next.js automatically; the project uses:

- Framework: Next.js
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: Vercel default
- Install Command: `npm install`
- Required environment variables: none

See `DEPLOYMENT.md` for the exact GitHub and Vercel steps.
### Hydration safety

Browser-only session, cart, wishlist, address, profile, and cached-catalog reads are deferred until after the initial React hydration pass. This prevents a saved login session from changing the first client render and causing Next.js hydration mismatch errors.
