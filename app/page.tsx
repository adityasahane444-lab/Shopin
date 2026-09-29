"use client";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  ChevronRight,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useShopin } from "@/components/ShopinProvider";

const categoryCards = [
  ["Mobiles", "/original-assets/vivo-y17s-forest-green-4gb-ram-128gb-storage-250x250.webp", "Phones & tablets"],
  ["Electronics", "/products/gaming-keyboard-product.svg", "Audio, cameras & more"],
  ["Fashion", "/products/shirt-product.svg", "Clothing & footwear"],
  ["Home", "/products/dining-table-product.svg", "Furniture & kitchen"],
  ["Beauty", "/products/serum-product.svg", "Beauty & grooming"],
  ["Grocery", "/products/almonds-product.svg", "Everyday essentials"],
  ["Sports", "/products/running-shoes-product.svg", "Fitness & sports"],
  ["Appliances", "/products/ac-product.svg", "Large & small appliances"],
];
const categories = categoryCards;
export default function Home() {
  const { products } = useShopin();
  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">THE NEW SHOPPING STANDARD</span>
          <h1>
            Great products.
            <br />
            <span>Better choices.</span>
          </h1>
          <p>
            Discover everyday essentials, electronics, fashion and more —
            thoughtfully curated for your next great find.
          </p>
          <div className="hero-actions">
            <Link href="/shop" className="btn btn-primary btn-lg">
              Shop now <ArrowRight size={18} />
            </Link>
            <Link href="/shop?sort=discount" className="btn btn-ghost btn-lg">
              Explore deals
            </Link>
          </div>
          <div className="trust-row">
            <span>
              <ShieldCheck size={17} /> Secure payments
            </span>
            <span>
              <Truck size={17} /> Fast delivery
            </span>
            <span>
              <RotateCcw size={17} /> Easy returns
            </span>
          </div>
        </div>
        <div className="hero-art">
          <img src="/hero-1.svg" alt="Shopin shopping" />
          <div className="float-card">
            <b>₹499</b>
            <span>Best-seller deals</span>
          </div>
        </div>
      </section>
      <section className="benefits">
        <div>
          <ShieldCheck />
          <span>
            <b>100% secure</b> checkout
          </span>
        </div>
        <div>
          <Truck />
          <span>
            <b>Free delivery</b> over ₹500
          </span>
        </div>
        <div>
          <RotateCcw />
          <span>
            <b>7-day easy</b> returns
          </span>
        </div>
        <div>
          <Headphones />
          <span>
            <b>24×7</b> customer care
          </span>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="kicker">BROWSE BY MOOD</span>
            <h2>Shop by category</h2>
          </div>
          <Link href="/shop">
            View all <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link
              key={c[0]}
              href={`/shop?category=${encodeURIComponent(c[0])}`}
              className="category-card"
            >
              <div className="cat-img">
                <img src={c[1]} alt={c[0]} />
              </div>
              <b>{c[0]}</b>
              <span>{c[2]}</span>
              <ChevronRight size={17} />
            </Link>
          ))}
        </div>
      </section>
      <section className="promo">
        <div>
          <span className="kicker">WEEKEND DROP</span>
          <h2>Upgrade your everyday.</h2>
          <p>
            Curated picks with sharp prices across tech, home and lifestyle.
          </p>
          <Link href="/shop" className="btn btn-dark">
            See collection <ArrowRight size={17} />
          </Link>
        </div>
        <img src="/hero-2.svg" alt="Weekend collection" />
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="kicker">MOST LOVED</span>
            <h2>Trending right now</h2>
          </div>
          <Link href="/shop?sort=rating">
            See all <ArrowRight size={17} />
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <section className="section soft">
        <div className="section-head">
          <div>
            <span className="kicker">SHOPIN PROMISE</span>
            <h2>Made for confident shopping.</h2>
          </div>
        </div>
        <div className="promise-grid">
          <div>
            <b>Transparent pricing</b>
            <p>
              No confusing checkout surprises. See your subtotal, delivery and
              final total before you pay.
            </p>
          </div>
          <div>
            <b>Human-friendly support</b>
            <p>
              Simple account, order and return flows designed to help you get
              things done.
            </p>
          </div>
          <div>
            <b>Local-first feel</b>
            <p>
              Indian rupee pricing, familiar payment methods and delivery-ready
              address capture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
