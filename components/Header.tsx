"use client";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Search,
  ShoppingCart,
  UserRound,
  ChevronDown,
  Package,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useShopin } from "./ShopinProvider";
import SafeImage from "./SafeImage";
import { SHOP_CATEGORIES, normalizeCategory } from "@/lib/categories";
import MobileHeader from "./MobileHeader";

const cats = SHOP_CATEGORIES;
export default function Header() {
  const { user, logout, cartCount, products } = useShopin();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategoryRaw = searchParams.get("category") || "";
  const activeCategory = activeCategoryRaw ? normalizeCategory(activeCategoryRaw) : "";
  const activeSort = searchParams.get("sort") || "featured";
  const activeQuery = searchParams.get("q") || "";
  const suggestions = useMemo(
    () =>
      q.length < 2
        ? []
        : products
            .filter(
              (p) =>
                p.title.toLowerCase().includes(q.toLowerCase()) ||
                p.brand.toLowerCase().includes(q.toLowerCase()),
            )
            .slice(0, 5),
    [q, products],
  );
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <>
      <MobileHeader />
      <div className="top-strip">
        <div>India's smart shopping destination</div>
        <div className="top-links">
          <span>Sell on Shopin</span>
          <span>Gift Cards</span>
          <span>Help Center</span>
        </div>
      </div>
      <header className="header">
        <Link href="/" className="brand">
          <img src="/brand/shopin-logo.svg" alt="Shopin" />
        </Link>
        <button className="location-pill">
          <MapPin size={17} />
          <span>
            <small>Deliver to</small>
            <b>Pune 411005</b>
          </span>
          <ChevronDown size={14} />
        </button>
        <div className="search-wrap">
          <form onSubmit={submit} className="search">
            <Search size={19} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products, brands and more"
              aria-label="Search"
            />
            <button>Search</button>
          </form>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setQ("");
                    router.push(`/product/${p.id}`);
                  }}
                >
                  <SafeImage src={p.image} alt={p.title} category={p.category} />
                  <span>{p.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="header-actions">
          <div
            className="account-area"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <Link href={user ? "/profile" : "/login"} className="head-action">
              <UserRound size={19} />
              <span>
                {user ? user.name.split(" ")[0] : "Login"}
                <small>Account</small>
              </span>
              <ChevronDown size={14} />
            </Link>
            {open && user && (
              <div className="account-menu">
                <Link href="/profile">My Profile</Link>
                <Link href="/orders">My Orders</Link>
                <Link href="/profile#wishlist">Wishlist</Link>
                {user.role === "admin" && (
                  <Link href="/admin">Admin Panel</Link>
                )}
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </div>
          <Link href="/orders" className="head-action">
            <Package size={19} />
            <span>
              Orders<small>Track</small>
            </span>
          </Link>
          <Link href="/profile#wishlist" className="head-action">
            <Heart size={19} />
            <span>
              Wishlist<small>Saved</small>
            </span>
          </Link>
          <Link href="/cart" className="cart-link">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartCount > 0 && <b>{cartCount}</b>}
          </Link>
        </div>
      </header>
      <nav className="cat-nav">
        <div className="cat-inner">
          <Link href="/shop" className={pathname === "/shop" && !activeCategory && !activeQuery && activeSort === "featured" ? "active" : ""}>
            All
          </Link>
          <Link
            href="/shop?sort=discount"
            className={pathname === "/shop" && !activeCategory && !activeQuery && activeSort === "discount" ? "active" : ""}
          >
            Top Offers
          </Link>
          {cats.map((c) => (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className={pathname === "/shop" && activeCategory === c ? "active" : ""}
            >
              {c}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
