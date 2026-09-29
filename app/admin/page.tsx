"use client";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  Edit3,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useShopin } from "@/components/ShopinProvider";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@/lib/types";
export default function Admin() {
  const {
    user,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useShopin();
  const [mode, setMode] = useState<"dash" | "products" | "orders">("dash");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const blank: Product = {
    id: "",
    title: "",
    brand: "",
    category: "Electronics",
    price: 999,
    mrp: 1499,
    rating: 4,
    reviews: 0,
    image: "/products/earbuds.webp",
    badge: "New",
    stock: 10,
    seller: "Shopin Retail",
    description: "",
    features: ["Quality materials", "Shopin verified seller"],
  };
  const save = (p: Product) => {
    if (editing) {
      updateProduct(p);
    } else {
      addProduct({ ...p, id: `p-${Date.now()}` });
    }
    setEditing(null);
    setShowAdd(false);
  };
  if (!user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h2>Admin access required</h2>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  if (user.role !== "admin")
    return (
      <div className="page-shell">
        <div className="empty-state">
          <h2>You don't have access to this panel.</h2>
          <Link href="/" className="btn btn-secondary">
            Back home
          </Link>
        </div>
      </div>
    );
  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <span className="kicker">SHOPIN CONTROL CENTER</span>
          <h1>Store administration</h1>
          <p>Manage the local catalog and order workflow.</p>
        </div>
        <Link href="/" className="btn btn-secondary">
          Open storefront
        </Link>
      </div>
      <div className="admin-tabs">
        <button
          onClick={() => setMode("dash")}
          className={mode === "dash" ? "active" : ""}
        >
          Overview
        </button>
        <button
          onClick={() => setMode("products")}
          className={mode === "products" ? "active" : ""}
        >
          Products
        </button>
        <button
          onClick={() => setMode("orders")}
          className={mode === "orders" ? "active" : ""}
        >
          Orders
        </button>
      </div>
      {mode === "dash" && (
        <>
          <div className="admin-metrics">
            <div>
              <Package />
              <span>Total products</span>
              <b>{products.length}</b>
            </div>
            <div>
              <ShoppingCart />
              <span>Total orders</span>
              <b>{orders.length}</b>
            </div>
            <div>
              <Boxes />
              <span>Units in stock</span>
              <b>{products.reduce((s, p) => s + p.stock, 0)}</b>
            </div>
            <div>
              <BarChart3 />
              <span>Order value</span>
              <b>
                ₹
                {orders
                  .reduce((s, o) => s + o.total, 0)
                  .toLocaleString("en-IN")}
              </b>
            </div>
          </div>
          <div className="admin-grid">
            <section className="admin-card">
              <h3>Recent orders</h3>
              {orders.slice(0, 6).map((o) => (
                <div className="admin-order-row" key={o.id}>
                  <span>#{o.id}</span>
                  <b>₹{o.total.toLocaleString("en-IN")}</b>
                  <em>{o.status}</em>
                </div>
              ))}
              {!orders.length && (
                <p className="muted">
                  No orders yet. Use the demo customer to create one.
                </p>
              )}
            </section>
            <section className="admin-card">
              <h3>Catalog snapshot</h3>
              {products.slice(0, 6).map((p) => (
                <div className="admin-product-row" key={p.id}>
                  <SafeImage src={p.image} alt={p.title} category={p.category} />
                  <div>
                    <b>{p.title}</b>
                    <span>
                      {p.category} · {p.stock} in stock
                    </span>
                  </div>
                  <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                </div>
              ))}
            </section>
          </div>
        </>
      )}
      {mode === "products" && (
        <section className="admin-card full-card">
          <div className="card-title">
            <div>
              <span className="kicker">CATALOG</span>
              <h2>Products</h2>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditing(null);
                setShowAdd(true);
              }}
            >
              <Plus size={17} /> Add product
            </button>
          </div>
          <div className="product-admin-table">
            {products.map((p) => (
              <div className="product-admin-row" key={p.id}>
                <SafeImage src={p.image} alt={p.title} category={p.category} />
                <div className="pa-main">
                  <b>{p.title}</b>
                  <span>
                    {p.brand} · {p.category} · SKU {p.id}
                  </span>
                </div>
                <strong>₹{p.price.toLocaleString("en-IN")}</strong>
                <span>{p.stock} stock</span>
                <button
                  onClick={() => {
                    setEditing(p);
                    setShowAdd(true);
                  }}
                >
                  <Edit3 size={17} />
                </button>
                <button
                  className="danger-icon"
                  onClick={() => deleteProduct(p.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
      {mode === "orders" && (
        <section className="admin-card full-card">
          <div className="card-title">
            <div>
              <span className="kicker">FULFILMENT</span>
              <h2>All orders</h2>
            </div>
          </div>
          {orders.map((o) => (
            <div className="admin-full-order" key={o.id}>
              <div>
                <b>#{o.id}</b>
                <span>
                  {o.address.name} · {o.address.city}
                </span>
              </div>
              <strong>₹{o.total.toLocaleString("en-IN")}</strong>
              <select
                value={o.status}
                onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
              >
                {[
                  "Placed",
                  "Confirmed",
                  "Packed",
                  "Shipped",
                  "Out for Delivery",
                  "Delivered",
                  "Cancelled",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
          {!orders.length && <p className="muted">No orders yet.</p>}
        </section>
      )}
      {showAdd && (
        <ProductModal
          product={editing || blank}
          onClose={() => {
            setEditing(null);
            setShowAdd(false);
          }}
          onSave={save}
        />
      )}
    </div>
  );
}
function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [p, setP] = useState(product);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="kicker">CATALOG EDITOR</span>
            <h2>{product.id ? "Edit product" : "Add product"}</h2>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-grid">
          {[
            ["title", "Product title"],
            ["brand", "Brand"],
            ["price", "Selling price"],
            ["mrp", "MRP"],
            ["stock", "Stock"],
            ["image", "Image path"],
            ["seller", "Seller"],
            ["description", "Description"],
          ].map(([k, label]) => (
            <label key={k} className={k === "description" ? "wide" : ""}>
              {label}
              {k === "description" ? (
                <textarea
                  value={String((p as any)[k])}
                  onChange={(e) => setP({ ...p, [k]: e.target.value })}
                />
              ) : (
                <input
                  value={String((p as any)[k])}
                  type={
                    ["price", "mrp", "stock"].includes(k) ? "number" : "text"
                  }
                  onChange={(e) =>
                    setP({
                      ...p,
                      [k]: ["price", "mrp", "stock"].includes(k)
                        ? Number(e.target.value)
                        : e.target.value,
                    })
                  }
                />
              )}
            </label>
          ))}
          <label>
            Category
            <select
              value={p.category}
              onChange={(e) =>
                setP({ ...p, category: e.target.value as Product["category"] })
              }
            >
              {[
                "Mobiles",
                "Electronics",
                "Fashion",
                "Home",
                "Beauty",
                "Grocery",
                "Sports",
                "Appliances",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Badge
            <input
              value={p.badge || ""}
              onChange={(e) => setP({ ...p, badge: e.target.value })}
            />
          </label>
          <label>
            Rating
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={p.rating}
              onChange={(e) => setP({ ...p, rating: Number(e.target.value) })}
            />
          </label>
          <label>
            Review count
            <input
              type="number"
              value={p.reviews}
              onChange={(e) => setP({ ...p, reviews: Number(e.target.value) })}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onSave(p)}>
            {product.id ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>
    </div>
  );
}
