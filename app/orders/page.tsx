"use client";
import Link from "next/link";
import { ChevronRight, Package, ShoppingBag } from "lucide-react";
import { useShopin } from "@/components/ShopinProvider";
import SafeImage from "@/components/SafeImage";
const statuses = [
  "Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];
export default function Orders() {
  const { user, orders, products } = useShopin();
  const mine = user ? orders.filter((o) => o.userId === user.id) : [];
  if (!user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <Package size={42} />
          <h2>Login to view your orders</h2>
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
        </div>
      </div>
    );
  return (
    <div className="page-shell">
      <div className="breadcrumb">Home / My Orders</div>
      <div className="page-heading">
        <div>
          <span className="kicker">ACCOUNT</span>
          <h1>My orders</h1>
          <p>Track every Shopin purchase in one place.</p>
        </div>
      </div>
      {mine.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={42} />
          <h2>No orders yet</h2>
          <p>Your placed orders will appear here.</p>
          <Link href="/shop" className="btn btn-primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {mine.map((o) => {
            const progress = statuses.indexOf(o.status);
            return (
              <article className="order-card" key={o.id}>
                <div className="order-head">
                  <div>
                    <b>Order #{o.id}</b>
                    <span>
                      Placed{" "}
                      {new Date(o.placedAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className={`status status-${o.status.replaceAll(" ", "-").toLowerCase()}`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="order-items">
                  {o.items.map((i) => {
                    const p = products.find((x) => x.id === i.productId);
                    return (
                      p && (
                        <div key={p.id} className="order-item">
                          <SafeImage src={p.image} alt={p.title} category={p.category} />
                          <div>
                            <b>{p.title}</b>
                            <span>
                              Qty {i.quantity} · ₹
                              {(p.price * i.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
                <div className="timeline">
                  {statuses.map((s, i) => (
                    <div
                      className={i <= progress ? "stage done" : "stage"}
                      key={s}
                    >
                      <span>{i + 1}</span>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>
                <div className="order-foot">
                  <span>
                    Deliver to{" "}
                    <b>
                      {o.address.city}, {o.address.state}
                    </b>{" "}
                    · {o.payment}
                  </span>
                  <b>₹{o.total.toLocaleString("en-IN")}</b>
                  <Link href="/shop">
                    Buy again <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
