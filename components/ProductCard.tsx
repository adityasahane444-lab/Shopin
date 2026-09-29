"use client";
import Link from "next/link";
import { Heart, Star, ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@/lib/types";
import { useShopin } from "./ShopinProvider";
import SafeImage from "./SafeImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useShopin();
  const wished = wishlist.includes(product.id);
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link href={`/product/${product.id}`}>
          <SafeImage src={product.image} alt={product.title} category={product.category} />
        </Link>
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        <button
          className={`wish-btn ${wished ? "active" : ""}`}
          aria-label="Wishlist"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart size={18} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-body">
        <div className="product-brand">{product.brand}</div>
        <Link href={`/product/${product.id}`} className="product-title">
          {product.title}
        </Link>
        <div className="rating-line">
          <span className="rating">{product.rating.toFixed(1)} ★</span>
          <span className="reviews">
            {product.reviews ? `${product.reviews.toLocaleString()} ratings` : "Catalog rating"}
          </span>
        </div>
        <div className="price-line">
          <b>₹{product.price.toLocaleString("en-IN")}</b>
          {product.mrp > product.price && (
            <>
              <s>₹{product.mrp.toLocaleString("en-IN")}</s>
              <em>{Math.round((1 - product.price / product.mrp) * 100)}% off</em>
            </>
          )}
        </div>
        <p className="delivery">Free delivery on orders above ₹500</p>
        <div className="card-actions">
          <button
            onClick={() => addToCart(product.id)}
            className="btn btn-secondary"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
          <Link href={`/product/${product.id}`} className="btn btn-primary">
            <Zap size={15} /> View
          </Link>
        </div>
      </div>
    </article>
  );
}
