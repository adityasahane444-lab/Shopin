import type { Product } from "./types";
import { seedProducts } from "./products";
import { normalizeCategory } from "./categories";

type OriginalProduct = {
  name: string;
  description?: string;
  productImg?: string;
  rating?: number;
  category?: string;
  price?: number;
};

export const ORIGINAL_CATALOG_URL =
  "https://raw.githubusercontent.com/csathnere/APIs/main/json-ec/product.json";
export const ORIGINAL_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/csathnere/APIs/main/json-ec/product-img/";

const brandPatterns = [
  "Apple",
  "Google",
  "Samsung",
  "SAMSUNG",
  "OnePlus",
  "OPPO",
  "vivo",
  "realme",
  "POCO",
  "Motorola",
  "MOTOROLA",
  "Infinix",
  "REDMI",
  "Xiaomi",
  "boAt",
  "Boult",
  "OneOdio",
  "Noise",
  "JBL",
  "Sony",
  "Philips",
  "LG",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Acer",
];

function getBrand(name: string) {
  const match = brandPatterns.find((brand) =>
    name.toLowerCase().startsWith(brand.toLowerCase()),
  );
  if (match) return match;
  return name.split(/\s+/)[0] || "Shopin";
}

function safePrice(price: unknown) {
  const parsed = Number(price);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : 0;
}

function makeRemoteProduct(item: OriginalProduct, index: number): Product {
  const price = safePrice(item.price);
  const title = String(item.name || `Catalog product ${index + 1}`).trim();
  const imageName = String(item.productImg || "").trim();
  const image = imageName
    ? `${ORIGINAL_IMAGE_BASE_URL}${encodeURIComponent(imageName).replace(/%2F/g, "/")}`
    : "/hero-3.svg";
  const rating = Math.max(0, Math.min(5, Number(item.rating) || 0));
  const category = normalizeCategory(item.category, title);

  return {
    id: `original-catalog-${index + 1}`,
    title,
    brand: getBrand(title),
    category,
    price,
    mrp: price,
    rating,
    reviews: 0,
    image,
    description: String(item.description || title).trim(),
    features: [
      `Catalog category: ${item.category || "General"}`,
      "Product from the original catalog referenced by the supplied ZIP",
    ],
    stock: 25,
    seller: "Shopin Marketplace",
    source: "original-catalog",
  };
}

function makeLegacyProduct(item: {
  name: string;
  price: string;
  image: string;
  category: string;
}, index: number): Product {
  const price = safePrice(String(item.price).replace(/[^0-9.]/g, ""));
  const image = item.image.startsWith("http")
    ? item.image
    : item.image
        .replace(/^\.\.\/img\//, "/original-assets/")
        .replace(/^\.\.\//, "/original-assets/")
        .replace(/^\/original-assets\/img\//, "/original-assets/");
  return {
    id: `original-zip-${index + 1}`,
    title: item.name,
    brand: getBrand(item.name),
    category: normalizeCategory(item.category, item.name),
    price,
    mrp: price,
    rating: 4.2,
    reviews: 0,
    image,
    badge: "Original catalog",
    description: item.name,
    features: ["Included from your supplied ZIP", "Shopin catalog listing"],
    stock: 25,
    seller: "Shopin Marketplace",
    source: "original-zip",
  };
}

export const legacyProducts: Product[] = [
  { name: "Moto G", price: "₹9999", image: "../img/phone-6.webp", category: "Mobile" },
  { name: "Poco M6", price: "₹11,999", image: "../img/phone-2.webp", category: "Mobile" },
  { name: "Poco C65", price: "₹21,999", image: "../img/phone-3.webp", category: "Mobile" },
  { name: "Moto A14", price: "₹19,999", image: "../img/phone-5.webp", category: "Mobile" },
  { name: "Samsung Galaxy", price: "₹15,999", image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s22-ultra-5g-2.jpg", category: "Mobile" },
  { name: "iPhone 12", price: "₹59,999", image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-12-r1.jpg", category: "Mobile" },
  { name: "Dell Inspiron 15", price: "₹45,999", image: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3530-intel/media-gallery/silver-plastic/notebook-inspiron-15-3530-nt-plastic-usbc-silver-gallery-4.psd?fmt=pjpg&pscan=auto&scl=1&wid=4582&hei=2810&qlt=100,1&resMode=sharp2&size=4582,2810&chrss=full&imwidth=5000", category: "Laptop" },
  { name: "HP Pavilion x360", price: "₹55,999", image: "https://m.media-amazon.com/images/I/71Njhmxnc5L.jpg", category: "Laptop" },
  { name: "Apple MacBook Air", price: "₹92,999", image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034", category: "Laptop" },
  { name: "Logitech MX Master 3", price: "₹8,499", image: "https://m.media-amazon.com/images/I/613a-3jtieL.jpg", category: "Accessory" },
  { name: "Sony WH-1000XM4", price: "₹29,990", image: "https://www.sony.co.in/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF", category: "Accessory" },
  { name: "Philips Air Fryer", price: "₹12,999", image: "https://m.media-amazon.com/images/I/61uCr9G6hIL._AC_UF894,1000_QL80_.jpg", category: "Home Appliance" },
  { name: "Samsung 32' Smart TV", price: "₹22,999", image: "https://images.samsung.com/is/image/samsung/p6pim/in/ua32t4340akxxl/gallery/in-hd-tv-ua32t4340akxxl-front-black-537470101?$650_519_PNG$", category: "Home Appliance" },
].map(makeLegacyProduct);

export const initialShopinCatalog = [...seedProducts, ...legacyProducts];

export function normalizeOriginalCatalog(payload: unknown): Product[] {
  if (!Array.isArray(payload)) return [];
  return payload
    .filter((item): item is OriginalProduct => Boolean(item && typeof item === "object"))
    .map((item, index) => makeRemoteProduct(item, index))
    .filter((p) => p.price > 0 && p.title.length > 0);
}
