"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useShopin } from "@/components/ShopinProvider";
import { SHOP_CATEGORIES, normalizeCategory } from "@/lib/categories";

const sortOptions = [
  ["featured", "Sort: Featured"],
  ["priceAsc", "Price: Low to High"],
  ["priceDesc", "Price: High to Low"],
  ["rating", "Top Rated"],
  ["discount", "Biggest Discount"],
] as const;

function discountOf(price: number, mrp: number) {
  return mrp > price && mrp > 0 ? (1 - price / mrp) * 100 : 0;
}

export default function Shop() {
  const { products } = useShopin();
  const params = useSearchParams();
  const queryQ = params.get("q") || "";
  const queryCategory = params.get("category") || "";
  const querySort = params.get("sort") || "featured";
  const canonicalQueryCategory = queryCategory
    ? normalizeCategory(queryCategory)
    : "";
  const maxAvailable = useMemo(
    () => Math.max(1000, ...products.map((p) => p.price)),
    [products],
  );
  const priceMax = Math.max(1000, Math.ceil(maxAvailable / 500) * 500);

  const [q, setQ] = useState(queryQ);
  const [cat, setCat] = useState<string>(canonicalQueryCategory);
  const [sort, setSort] = useState(sortOptions.some(([v]) => v === querySort) ? querySort : "featured");
  const [max, setMax] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [brand, setBrand] = useState("");
  const [minDiscount, setMinDiscount] = useState(0);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setQ(queryQ);
    setCat(canonicalQueryCategory);
    setSort(sortOptions.some(([v]) => v === querySort) ? querySort : "featured");
  }, [queryQ, canonicalQueryCategory, querySort]);

  const effectiveMax = max ?? priceMax;
  const brands = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => counts.set(p.brand, (counts.get(p.brand) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      const text = `${p.title} ${p.brand} ${p.category}`.toLowerCase();
      return (
        (!cat || p.category === cat) &&
        p.price <= effectiveMax &&
        p.rating >= minRating &&
        (!brand || p.brand === brand) &&
        discountOf(p.price, p.mrp) >= minDiscount &&
        (!q || text.includes(q.toLowerCase().trim()))
      );
    });

    return list.sort((a, b) => {
      switch (sort) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating || b.reviews - a.reviews;
        case "discount":
          return discountOf(b.price, b.mrp) - discountOf(a.price, a.mrp);
        default:
          return 0;
      }
    });
  }, [products, q, cat, sort, effectiveMax, minRating, brand, minDiscount]);

  const resetFilters = () => {
    setQ("");
    setCat("");
    setMax(null);
    setMinRating(0);
    setBrand("");
    setMinDiscount(0);
    setSort("featured");
  };

  return (
    <div className="shop-page">
      <div className="breadcrumb">
        Home <span>/</span> Shop {cat && <><span>/</span>{cat}</>}
      </div>
      <div className="shop-layout">
        <aside className={`filter-panel ${mobileFilters ? "show" : ""}`}>
          <div className="filter-title">
            <b>Filters</b>
            <button onClick={() => setMobileFilters(false)} aria-label="Close filters">
              <X size={18} />
            </button>
          </div>

          <label>
            Search
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Product, brand or category"
            />
          </label>

          <div className="filter-group">
            <b>Category</b>
            <button
              className={!cat ? "filter-option selected" : "filter-option"}
              onClick={() => setCat("")}
            >
              <span>All categories</span><small>{products.length}</small>
            </button>
            {SHOP_CATEGORIES.map((c) => (
              <button
                key={c}
                className={cat === c ? "filter-option selected" : "filter-option"}
                onClick={() => setCat(c)}
              >
                <span>{c}</span><small>{categoryCounts.get(c) || 0}</small>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <b>Maximum price</b>
            <input
              type="range"
              min="0"
              max={String(priceMax)}
              step="500"
              value={Math.min(effectiveMax, priceMax)}
              onChange={(e) => setMax(Number(e.target.value))}
            />
            <div className="range-values">
              <span>₹0</span>
              <span>₹{effectiveMax.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="filter-group">
            <b>Brand</b>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Filter by brand">
              <option value="">All brands</option>
              {brands.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <b>Discount</b>
            {[10, 20, 30, 50].map((d) => (
              <button
                key={d}
                className={minDiscount === d ? "filter-option selected" : "filter-option"}
                onClick={() => setMinDiscount(minDiscount === d ? 0 : d)}
              >
                <span>{d}% & above</span>
              </button>
            ))}
          </div>

          <div className="filter-group">
            <b>Rating</b>
            {[4, 3, 2].map((r) => (
              <button
                key={r}
                className={minRating === r ? "filter-option selected" : "filter-option"}
                onClick={() => setMinRating(minRating === r ? 0 : r)}
              >
                <span>{r}★ & above</span>
              </button>
            ))}
          </div>

          <button className="btn btn-secondary full" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        <section className="results">
          <div className="results-head">
            <div>
              <span className="kicker">SHOP</span>
              <h1>{q ? `Results for “${q}”` : cat || "All products"}</h1>
              <p>{filtered.length} products</p>
            </div>
            <div className="sort-area">
              <button className="mobile-filter-btn" onClick={() => setMobileFilters(true)}>
                <SlidersHorizontal size={17} /> Filters
              </button>
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
                {sortOptions.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {filtered.length ? (
            <div className="product-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another category, search term, rating or price range.</p>
              <button className="btn btn-primary" onClick={resetFilters}>Clear all filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
