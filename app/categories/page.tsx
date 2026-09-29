"use client";

import Link from "next/link";
import { ArrowDown, BadgePercent, BookOpen, Bike, Dumbbell, Home, Laptop, Shirt, ShoppingBasket, Smartphone, Sparkles, Tv, Baby } from "lucide-react";
import { useShopin } from "@/components/ShopinProvider";

const groups = [
  ["Mobiles", Smartphone, "Phones, tablets and accessories"],
  ["Appliances", Tv, "TVs and everyday appliances"],
  ["Electronics", Laptop, "Laptops, audio and gadgets"],
  ["Fashion", Shirt, "Men, women and footwear"],
  ["Beauty", Sparkles, "Beauty and personal care"],
  ["Home", Home, "Furniture, kitchen and decor"],
  ["Grocery", ShoppingBasket, "Daily essentials and food"],
  ["Sports", Dumbbell, "Fitness and active lifestyle"],
  ["Kids", Baby, "Toys, baby and kids"],
  ["Books", BookOpen, "Books and learning"],
  ["Two Wheelers", Bike, "Bikes and riding essentials"],
] as const;

export default function CategoriesPage() {
  const { products } = useShopin();
  const counts = new Map<string, number>();
  products.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
  return (
    <main className="categories-page page-shell">
      <div className="breadcrumb">Home / Categories</div>
      <div className="page-heading"><span className="kicker">SHOPIN</span><h1>All categories</h1><p>Explore every product family in one place.</p></div>
      <section className="categories-mobile-layout">
        <aside className="categories-side">
          <Link href="/categories" className="selected"><BadgePercent size={17} /><span>For You</span></Link>
          {groups.map(([name, Icon]) => <Link key={name} href={`/shop?category=${encodeURIComponent(String(name))}`}><Icon size={17} /><span>{String(name)}</span></Link>)}
          <Link href="/shop"><ArrowDown size={17} /><span>View All</span></Link>
        </aside>
        <section className="categories-main-grid">
          <div className="categories-feature-grid">
            {[
              ["Big savings", "/deals"], ["Fresh deals", "/shop?sort=discount"], ["New arrivals", "/shop?sort=rating"], ["Everyday picks", "/shop"],
            ].map(([label, href]) => <Link href={href} key={label} className="category-feature"><span>{label}</span><b>Shop now →</b></Link>)}
          </div>
          <h2>Popular on Shopin</h2>
          <div className="all-category-grid">
            {groups.map(([name, Icon, desc]) => <Link href={`/shop?category=${encodeURIComponent(String(name))}`} key={String(name)} className="all-category-card"><span><Icon size={28} /></span><div><b>{String(name)}</b><small>{String(desc)}</small><em>{counts.get(String(name)) || 0} products</em></div></Link>)}
          </div>
        </section>
      </section>
    </main>
  );
}
