# Shopin deployment guide

## Recommended stack

- GitHub: source control
- Vercel: hosting for the Next.js website
- Next.js 16.3.6
- React 19.3.0
- Node.js 24.x
- npm

## 1. Check the project locally

Use Node 24.x for this release. Then, from the `Shopin` folder:

```powershell
node -v
npm -v
npm install
npm run typecheck
npm run build
npm run start
```

Open `http://localhost:3000` and test the main routes.

## 2. Put the project on GitHub

Create a new GitHub repository, then run from the `Shopin` folder:

```powershell
git init
git add .
git commit -m "feat: Shopin mobile-first ecommerce"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/shopin.git
git push -u origin main
```

Do not commit `node_modules`, `.next`, local environment files, passwords, API keys, or other secrets. The supplied `.gitignore` excludes those local artifacts.

## 3. Create the Vercel project

In Vercel:

1. Select **Add New → Project**.
2. Import the Shopin GitHub repository.
3. Keep the Root Directory at `./`.
4. Let Vercel detect **Next.js**.
5. Use **Node.js 24.x** for the project runtime if the dashboard asks you to choose a version.
6. Use `npm run build` as the build command (the repository's `vercel.json` already specifies it).
7. Leave Output Directory at the framework default.
8. Click Deploy.

No environment variables are required by the current codebase.

## 4. What must be available for deployment

Required:

- GitHub account
- Vercel account
- Node.js 24.x for the recommended local build environment
- npm
- Internet access during `npm install`

Not required for this demo:

- Supabase
- Stripe/Razorpay account
- Email provider
- Firebase
- Any paid API

## 5. External catalog dependency

The broader catalog can be fetched from the public catalog endpoint referenced by the original supplied project. If that endpoint is unreachable, Shopin still starts with the bundled catalog. Remote catalog images may require internet access.

For a fully self-contained production catalog, download the approved catalog/images into your own storage and replace the external URL.

## 6. Current data-storage limitation

Shopin currently stores demo accounts, carts, wishlists, addresses, profile edits and orders in browser `localStorage`.

This works on Vercel as a demo/portfolio application because the browser owns that data. It is not the same as a server-backed marketplace: a user who opens the deployed site from a different browser/device will not see the same localStorage data.

For a real marketplace, replace the localStorage provider with a server/database layer for:

- users and secure authentication
- products and inventory
- carts
- addresses
- orders and order status
- payments
- coupons
- reviews
- notifications

## 7. Production smoke test after deployment

Open the live URL on both desktop and a phone-sized viewport and verify:

- Home page
- Mobile bottom navigation
- Categories page
- Top mobile category rail
- Search suggestions
- Category filtering
- Brand, discount, rating and price filters
- Sorting
- Product detail page
- Add to cart
- Wishlist
- Login / registration
- Profile editing
- Address add / edit / delete
- Checkout
- Order creation
- Orders page
- Admin login and product/order controls

Then perform the account-isolation test:

1. Log into the demo account.
2. Add an address and cart item.
3. Log out.
4. Create a new account.
5. Confirm the new account has its own empty address/cart/wishlist state.
