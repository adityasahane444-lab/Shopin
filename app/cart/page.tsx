"use client";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useShopin } from "@/components/ShopinProvider";
import SafeImage from "@/components/SafeImage";
export default function Cart() {
  const { cart, products, updateCartQty, removeFromCart, cartSubtotal } =
    useShopin();
  const delivery = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 49;
  return (
    <div className="page-shell">
      <div className="breadcrumb">Home / Cart</div>
      <div className="page-heading">
        <div>
          <span className="kicker">YOUR BAG</span>
          <h1>Shopping cart</h1>
          <p>
            {cart.reduce((s, x) => s + x.quantity, 0)} items saved for checkout
          </p>
        </div>
      </div>
      {cart.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={42} />
          <h2>Your cart is empty</h2>
          <p>Find something you love and bring it here.</p>
          <Link href="/shop" className="btn btn-primary">
            Continue shopping <ArrowRight />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {cart.map((item) => {
              const p = products.find((x) => x.id === item.productId);
              if (!p) return null;
              return (
                <div className="cart-item" key={p.id}>
                  <Link href={`/product/${p.id}`} className="cart-img">
                    <SafeImage src={p.image} alt={p.title} category={p.category} />
                  </Link>
                  <div className="cart-info">
                    <span>{p.brand}</span>
                    <Link href={`/product/${p.id}`}>{p.title}</Link>
                    <div className="price-line">
                      <b>₹{p.price.toLocaleString("en-IN")}</b>
                      <s>₹{p.mrp.toLocaleString("en-IN")}</s>
                    </div>
                    <div className="cart-controls">
                      <div className="qty">
                        <button
                          onClick={() => updateCartQty(p.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(p.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        className="remove"
                        onClick={() => removeFromCart(p.id)}
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    ₹{(p.price * item.quantity).toLocaleString("en-IN")}
                  </div>
                </div>
              );
            })}
            <div className="cart-assurance">
              <Check /> Safe and secure checkout · Free delivery above ₹500 ·
              Easy returns
            </div>
          </section>
          <aside className="summary-card">
            <h3>Price details</h3>
            <div>
              <span>Price ({cart.length} items)</span>
              <b>₹{cartSubtotal.toLocaleString("en-IN")}</b>
            </div>
            <div>
              <span>Delivery</span>
              <b>{delivery === 0 ? "FREE" : `₹${delivery}`}</b>
            </div>
            <div className="summary-total">
              <span>Total amount</span>
              <b>₹{(cartSubtotal + delivery).toLocaleString("en-IN")}</b>
            </div>
            <p className="save-note">
              You are saving ₹
              {cart
                .reduce((s, i) => {
                  const p = products.find((x) => x.id === i.productId);
                  return s + (p ? (p.mrp - p.price) * i.quantity : 0);
                }, 0)
                .toLocaleString("en-IN")}{" "}
              on this order.
            </p>
            <Link href="/checkout" className="btn btn-primary full btn-lg">
              Proceed to checkout <ArrowRight />
            </Link>
          </aside>
          <div className="mobile-cart-bar">
            <div><small>Total</small><b>₹{(cartSubtotal + delivery).toLocaleString("en-IN")}</b></div>
            <Link href="/checkout" className="btn btn-primary">Proceed to buy <ArrowRight size={16} /></Link>
          </div>
        </div>
      )}
    </div>
  );
}
