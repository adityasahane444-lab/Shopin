# Shopin QA checklist

Run `npm install` and `npm run dev`, then verify:

- `/shop?category=Mobiles` shows only Mobiles.
- Top category navigation changes the category and active underline.
- Price slider, brand, discount and rating filters update the product count.
- Each sort option visibly changes ordering.
- Product cards show their product image; broken local legacy paths are normalized.
- Product detail, Add to Cart, Wishlist, Checkout, Orders and Profile work.
- `/sw.js` returns 200 (minimal placeholder service worker).
- Old `shopin_products_v5` cache is no longer used; current catalog cache is `shopin_products_v6`.
