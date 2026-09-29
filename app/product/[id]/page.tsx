"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  RotateCcw,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useShopin } from "@/components/ShopinProvider";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/SafeImage";
export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { products, addToCart, toggleWishlist, wishlist } = useShopin();
  const p = useMemo(() => products.find((x) => x.id === id), [products, id]);
  const [qty, setQty] = useState(1);
  if (!p)
    return (
      <div className="empty-state page-empty">
        <h2>Product not found</h2>
        <Link className="btn btn-primary" href="/shop">
          Back to shop
        </Link>
      </div>
    );
  const wished = wishlist.includes(p.id);
  return (
    <div className="product-page">
      <div className="breadcrumb">
        Home / {p.category} / {p.title}
      </div>
      <div className="detail-card">
        <div className="detail-gallery">
          <div className="main-image">
            <SafeImage src={p.image} alt={p.title} category={p.category} />
            <span className="detail-badge">{p.badge || "Shopin Pick"}</span>
          </div>
        </div>
        <div className="detail-copy">
          <div className="product-brand">{p.brand}</div>
          <h1>{p.title}</h1>
          <div className="rating-big">
            <span>{p.rating.toFixed(1)} ★</span>
            <b>{p.reviews.toLocaleString()} ratings & reviews</b>
          </div>
          <div className="price-big">
            <b>₹{p.price.toLocaleString("en-IN")}</b>
            {p.mrp > p.price && (
              <>
                <s>₹{p.mrp.toLocaleString("en-IN")}</s>
                <em>{Math.round((1 - p.price / p.mrp) * 100)}% off</em>
              </>
            )}
          </div>
          <div className="offer-box">
            <b>Extra ₹250 off</b>
            <span>Use coupon SHOPIN250 on orders above ₹1,999.</span>
          </div>
          <div className="delivery-box">
            <b>Delivery available</b>
            <span>
              Enter pincode on checkout for address-specific delivery.
            </span>
          </div>
          <div className="qty-row">
            <b>Quantity</b>
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus size={15} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>
                <Plus size={15} />
              </button>
            </div>
            <span className="stock">
              <Check size={15} /> {p.stock} in stock
            </span>
          </div>
          <div className="detail-actions">
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => addToCart(p.id, qty)}
            >
              <ShoppingCart /> Add to cart
            </button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                addToCart(p.id, qty);
                router.push("/checkout");
              }}
            >
              <Zap /> Buy now
            </button>
            <button
              className={`icon-btn heart-large ${wished ? "active" : ""}`}
              onClick={() => toggleWishlist(p.id)}
            >
              <Heart fill={wished ? "currentColor" : "none"} />
            </button>
          </div>
          <div className="promise-strip">
            <span>
              <Truck />
              Fast delivery
            </span>
            <span>
              <ShieldCheck />
              Secure payment
            </span>
            <span>
              <RotateCcw />
              Easy returns
            </span>
          </div>
        </div>
      </div>
      <div className="detail-lower">
        <section className="spec-card">
          <span className="kicker">PRODUCT DETAILS</span>
          <h2>About this product</h2>
          <p>{p.description}</p>
          <h3>Highlights</h3>
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Check size={16} />
                {f}
              </li>
            ))}
          </ul>
        </section>
        <section className="rating-card">
          <span className="kicker">CUSTOMER REVIEWS</span>
          <h2>
            {p.rating.toFixed(1)} <Star fill="currentColor" size={18} />{" "}
          </h2>
          <p>{p.reviews.toLocaleString()} verified ratings</p>
          <div className="review-bars">
            {[5, 4, 3, 2, 1].map((r) => (
              <div key={r}>
                <span>{r} ★</span>
                <div className="bar">
                  <i style={{ width: `${r === 5 ? 82 : r === 4 ? 12 : 4}%` }} />
                </div>
                <small>{r === 5 ? "82%" : ""}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="kicker">YOU MAY ALSO LIKE</span>
            <h2>More from Shopin</h2>
          </div>
        </div>
        <div className="product-grid">
          {products
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
