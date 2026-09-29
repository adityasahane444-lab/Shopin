"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { useShopin } from "./ShopinProvider";
import ProductCard from "./ProductCard";

const slides = [
  { image: "/hero-1.svg", kicker: "SHOPIN BIG DAYS", title: "Big savings on every cart", text: "Fresh deals across mobiles, electronics, fashion and more.", href: "/deals" },
  { image: "/hero-2.svg", kicker: "WEEKEND DEALS", title: "Upgrade your everyday", text: "Curated essentials with sharp prices and fast delivery.", href: "/shop?sort=discount" },
  { image: "/hero-3.svg", kicker: "NEW FINDS", title: "Discover your next favourite", text: "Browse trending products picked for Shopin shoppers.", href: "/shop?sort=rating" },
];

const mobileCategories = [
  ["For You", "", ShoppingBag, "#efeaff"],
  ["Fashion", "Fashion", Sparkles, "#fff1f6"],
  ["Mobiles", "Mobiles", Smartphone, "#eaf5ff"],
  ["Electronics", "Electronics", Tag, "#eef8ef"],
  ["Beauty", "Beauty", Sparkles, "#fff7e8"],
  ["Home", "Home", ShieldCheck, "#f4efff"],
  ["Grocery", "Grocery", ShoppingBag, "#edfff6"],
  ["Sports", "Sports", Star, "#eef7ff"],
  ["Appliances", "Appliances", ShieldCheck, "#f4f4f7"],
  ["Kids", "Kids", Heart, "#fff0ef"],
];

export default function MobileHome() {
  const { products, user } = useShopin();
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((value) => (value + 1) % slides.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const picks = useMemo(() => products.slice(0, 8), [products]);
  const deals = useMemo(
    () => products
      .slice()
      .sort((a, b) => {
        const da = a.mrp > a.price ? 1 - a.price / a.mrp : 0;
        const db = b.mrp > b.price ? 1 - b.price / b.mrp : 0;
        return db - da;
      })
      .slice(0, 8),
    [products],
  );

  const current = slides[slide];
  const move = (dir: number) => setSlide((value) => (value + dir + slides.length) % slides.length);

  return (
    <div className="mobile-home">
      <section className="mobile-quick-row" aria-label="Shopin shortcuts">
        <Link href="/" className="mobile-brand-tile">
          <span className="brand-mark">S</span>
          <b>Shopin</b>
        </Link>
        <Link href="/shop?category=Grocery" className="quick-tile"><span>🥦</span><b>Grocery</b></Link>
        <Link href="/deals" className="quick-tile"><span>⚡</span><b>Express</b></Link>
        <Link href="/shop?sort=discount" className="quick-tile"><span>🏷️</span><b>Offers</b></Link>
      </section>

      <section className="mobile-address-banner">
        <span className="address-home">⌂</span>
        <div>
          <b>{user ? `DELIVER TO ${user.name.split(" ")[0].toUpperCase()}` : "DELIVER TO HOME"}</b>
          <span>{user ? "Saved address available in your account" : "Add an address for faster delivery"}</span>
        </div>
        <Link href={user ? "/profile" : "/login"}>›</Link>
      </section>

      <section className="mobile-hero-wrap">
        <div className="mobile-hero-copy">
          <span>{current.kicker}</span>
          <h1>{current.title}</h1>
          <p>{current.text}</p>
          <Link href={current.href}>Shop now <ArrowRight size={15} /></Link>
        </div>
        <div className="mobile-hero-art">
          <img src={current.image} alt="Shopin promotion" />
        </div>
        <button className="mobile-hero-arrow left" onClick={() => move(-1)} aria-label="Previous promotion"><ChevronLeft size={18} /></button>
        <button className="mobile-hero-arrow right" onClick={() => move(1)} aria-label="Next promotion"><ChevronRight size={18} /></button>
      </section>
      <div className="mobile-dots" aria-hidden="true">{slides.map((_, i) => <i key={i} className={i === slide ? "active" : ""} />)}</div>

      <section className="mobile-category-strip">
        {mobileCategories.map(([label, category, Icon, bg]) => (
          <Link key={label} href={category ? `/shop?category=${encodeURIComponent(category)}` : "/shop"}>
            <span style={{ background: bg }}><Icon size={20} /></span>
            <small>{label}</small>
          </Link>
        ))}
      </section>

      <section className="mobile-picks-card">
        <div className="mobile-section-title">
          <div><span className="mobile-kicker">PERSONALISED FOR YOU</span><h2>{user ? `${user.name.split(" ")[0]}, top picks for you` : "Top picks for you"} 🎯</h2></div>
          <Link href="/shop">View all <ChevronRight size={17} /></Link>
        </div>
        <div className="mobile-product-rail">
          {picks.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mobile-promo-tile">
        <div>
          <span>SHOPIN SAVINGS ZONE</span>
          <h2>Extra deals for your next order</h2>
          <p>Save more on selected products with free delivery above ₹500.</p>
          <Link href="/deals">Explore deals <ArrowRight size={15} /></Link>
        </div>
        <img src="/hero-2.svg" alt="Shopin savings" />
      </section>

      <section className="mobile-deals-section">
        <div className="mobile-section-title">
          <div><span className="mobile-kicker">LIMITED-TIME OFFERS</span><h2>Deals for you</h2></div>
          <Link href="/deals">See all <ChevronRight size={17} /></Link>
        </div>
        <div className="mobile-product-rail">
          {deals.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="mobile-service-grid">
        <div><Truck size={20} /><b>Fast delivery</b><span>Orders above ₹500</span></div>
        <div><ShieldCheck size={20} /><b>Secure checkout</b><span>Protected shopping flow</span></div>
        <div><Clock3 size={20} /><b>Easy returns</b><span>Simple account controls</span></div>
      </section>
    </div>
  );
}
