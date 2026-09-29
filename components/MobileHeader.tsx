"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AirVent,
  Baby,
  BookOpen,
  ChevronDown,
  Home,
  Laptop,
  MapPin,
  Mic,
  Search,
  Shirt,
  ShoppingBasket,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Dumbbell,
  Tag,
  UserRound,
  Bike,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useShopin } from "./ShopinProvider";
import SafeImage from "./SafeImage";

const items = [
  ["For You", "", ShoppingBasket],
  ["Fashion", "Fashion", Shirt],
  ["Mobiles", "Mobiles", Smartphone],
  ["Electronics", "Electronics", Laptop],
  ["Beauty", "Beauty", Sparkles],
  ["Home", "Home", Home],
  ["Grocery", "Grocery", ShoppingBasket],
  ["Sports", "Sports", Dumbbell],
  ["Appliances", "Appliances", AirVent],
  ["Kids", "Kids", Baby],
  ["Books", "Books", BookOpen],
  ["Two Wheelers", "Two Wheelers", Bike],
] as const;

export default function MobileHeader() {
  const { user, addresses, cartCount, products } = useShopin();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [q, setQ] = useState("");
  const suggestions = useMemo(() => {
    if (q.trim().length < 2) return [];
    return products.filter((p) => `${p.title} ${p.brand}`.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
  }, [q, products]);
  const address = addresses[0];
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="mobile-header">
      <div className="mobile-header-top">
        <Link href="/" className="mobile-header-brand">
          <span className="mobile-logo-mark">S</span>
          <span><b>Shopin</b><small>shop smart. live better.</small></span>
        </Link>
        <div className="mobile-header-actions">
          <Link href={user ? "/profile" : "/login"} aria-label="Account"><UserRound size={21} /></Link>
          <Link href="/cart" className="mobile-header-cart" aria-label="Cart"><ShoppingCart size={22} />{cartCount > 0 && <b>{cartCount}</b>}</Link>
        </div>
      </div>

      <div className="mobile-location-row">
        <Link href={user ? "/profile" : "/login"} className="mobile-location-pill">
          <MapPin size={16} />
          <span><b>{address ? "DELIVER TO" : "DELIVERY LOCATION"}</b><small>{address ? `${address.name}, ${address.city} ${address.pincode}` : "Add an address for faster checkout"}</small></span>
          <ChevronDown size={15} />
        </Link>
        <Link href="/deals" className="mobile-offer-mini"><Tag size={16} /></Link>
      </div>

      <div className="mobile-search-wrap">
        <form onSubmit={submit} className="mobile-search">
          <Search size={21} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products, brands and more" aria-label="Search products" />
          <button type="button" aria-label="Voice search"><Mic size={20} /></button>
        </form>
        {suggestions.length > 0 && (
          <div className="mobile-suggestions">
            {suggestions.map((p) => (
              <button key={p.id} onClick={() => { setQ(""); router.push(`/product/${p.id}`); }}>
                <SafeImage src={p.image} alt={p.title} category={p.category} />
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <nav className="mobile-category-nav" aria-label="Product categories">
        {items.map(([label, category, Icon]) => {
          const active = category ? pathname === "/shop" && activeCategory.toLowerCase() === category.toLowerCase() : pathname === "/" && !activeCategory;
          const href = category ? `/shop?category=${encodeURIComponent(category)}` : "/";
          return (
            <Link key={label} href={href} className={active ? "active" : ""}>
              <span><Icon size={21} /></span>
              <small>{label}</small>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
