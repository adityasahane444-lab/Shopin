"use client";

import Link from "next/link";
import { BadgePercent, Clock3, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useShopin } from "@/components/ShopinProvider";

export default function DealsPage() {
  const { products } = useShopin();
  const deals = products.slice().sort((a, b) => {
    const da = a.mrp > a.price ? 1 - a.price / a.mrp : 0;
    const db = b.mrp > b.price ? 1 - b.price / b.mrp : 0;
    return db - da;
  });
  return (
    <main className="deals-page page-shell">
      <div className="breadcrumb">Home / Deals</div>
      <section className="deals-hero">
        <div><span className="kicker">SHOPIN DEALS</span><h1>Save more on your next cart.</h1><p>Discount-led shopping across the categories you browse most.</p><Link href="/shop?sort=discount" className="btn btn-primary">Shop biggest discounts</Link></div>
        <div className="deals-hero-icons"><BadgePercent size={38} /><Sparkles size={30} /><Clock3 size={30} /></div>
      </section>
      <div className="deals-title"><div><span className="kicker">LIVE NOW</span><h2>Top offers</h2></div><span>{deals.length} products</span></div>
      <div className="product-grid">{deals.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </main>
  );
}
