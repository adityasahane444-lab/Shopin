# Shopin — Full E-commerce Demo

Shopin is a Next.js + React + TypeScript e-commerce storefront with product browsing, search, filters, cart, wishlist, login/register, saved addresses, checkout, orders, account pages and a local admin panel.

## Original product catalog included

The supplied ZIP contained an explicit `plus/products.json` list and its JavaScript also referenced a larger external product catalog at:

`https://raw.githubusercontent.com/csathnere/APIs/main/json-ec/product.json`

Shopin keeps the explicit local catalog at `public/catalog/original-plus-products.json` and automatically imports every product record from that larger referenced catalog on the first browser launch. Imported products are cached in localStorage so admin edits persist after the initial sync.

The original catalog's product images are loaded from the same public image repository used by the supplied project. Internet access is therefore required for the full remote catalog image set; the bundled Shopin catalog remains usable offline.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo accounts

Customer: `demo@shopin.in` / `shopin123`

Admin: `admin@shopin.in` / `admin123`

## Reset the catalog

Shopin stores demo data in browser localStorage. To re-import the original catalog after making changes, clear the site's local storage and reload.

## Catalog/UI fixes in this version

- Top navigation includes **All**, **Top Offers**, and all Shopin shopping categories.
- Category URLs and the filter panel stay synchronized when navigation happens within `/shop`.
- Category normalization handles the original ZIP labels such as `Mobile`, `Laptop`, `Accessory`, `Home Appliance`, plus nested catalog labels such as `electronics/earphones`, `appliances/TV`, `appliances/washing`, `fashion-men`, `fashion-women`, `beauty&toys`, `home&furniture`, `kids toys`, and `two-wheelers`.
- Price filtering uses the real catalog maximum instead of a fixed ₹2,00,000 ceiling.
- Sorting supports Featured, Low to High, High to Low, Top Rated, and Biggest Discount.
- Broken/missing local product-image references now fall back to matching product illustrations instead of unrelated banners.
- The Shopin product cache key was bumped to `shopin_products_v5`, so older cached category/image mappings do not survive this update.
- The original ZIP product catalog remains bundled at `public/catalog/original-plus-products.json`.

## QA note

TypeScript/TSX syntax and local image references were checked in the build workspace. A full `next build` was not run in this environment because package downloads are unavailable here; run `npm run build` on your laptop after `npm install` for the final production build check.


### Troubleshooting asset 404s
The project bundles the original ZIP image library under `public/original-assets/` and normalizes legacy `/original-assets/img/...` paths. Product catalog cache key is `shopin_products_v6`.

## Account isolation and profile editing

Shopin v7 stores customer-owned cart, wishlist, and address data under the logged-in user's unique ID. The old global v1 storage keys are migrated only to the built-in demo account, never to newly registered users. This prevents one account's address from appearing in another account.

The Profile tab supports editing the customer's name, email, phone number, and profile photo. Saved delivery addresses can also be edited or deleted. Account type remains read-only because it controls customer/admin permissions.
"# Shopin" 
