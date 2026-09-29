"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  Smartphone,
  WalletCards,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useShopin } from "@/components/ShopinProvider";
import SafeImage from "@/components/SafeImage";
export default function Checkout() {
  const {
    user,
    cart,
    products,
    addresses,
    addAddress,
    placeOrder,
    cartSubtotal,
  } = useShopin();
  const router = useRouter();
  const [addressId, setAddressId] = useState(addresses[0]?.id || "");
  const [showAdd, setShowAdd] = useState(addresses.length === 0);
  const [payment, setPayment] = useState<"COD" | "UPI" | "Card">("UPI");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411005",
    type: "Home" as "Home" | "Work",
  });
  const [done, setDone] = useState<string>("");
  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);
  useEffect(() => {
    if (!addressId && addresses[0]) setAddressId(addresses[0].id);
  }, [addresses, addressId]);
  if (!user) return <div className="page-empty" />;
  if (done)
    return (
      <div className="success-page">
        <div className="success-icon">
          <CheckCircle2 size={64} />
        </div>
        <span className="kicker">ORDER CONFIRMED</span>
        <h1>Thanks, {user.name.split(" ")[0]}.</h1>
        <p>
          Your Shopin order <b>{done}</b> has been placed successfully.
        </p>
        <div className="success-actions">
          <Link href="/orders" className="btn btn-primary">
            View order
          </Link>
          <Link href="/shop" className="btn btn-secondary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  const delivery = cartSubtotal >= 500 || cartSubtotal === 0 ? 0 : 49;
  const total = cartSubtotal + delivery;
  const submitAddress = () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode)
      return;
    addAddress(form);
    setShowAdd(false);
    setTimeout(() => {}, 0);
  };
  const orderNow = () => {
    const order = placeOrder(addressId, payment);
    if (order) setDone(order.id);
  };
  return (
    <div className="page-shell checkout-page">
      <div className="breadcrumb">Home / Cart / Checkout</div>
      <div className="checkout-progress">
        <span className="done">
          1 <b>Address</b>
        </span>
        <i />
        <span className="active">
          2 <b>Checkout</b>
        </span>
        <i />
        <span>
          3 <b>Confirmation</b>
        </span>
      </div>
      <div className="checkout-layout">
        <section>
          {
            <div className="checkout-card">
              <div className="checkout-card-title">
                <div>
                  <span className="step-num">1</span>
                  <div>
                    <h3>Delivery address</h3>
                    <p>Choose where you want your order delivered.</p>
                  </div>
                </div>
                <button onClick={() => setShowAdd((v) => !v)}>
                  <Plus size={17} /> Add new
                </button>
              </div>
              {addresses.length > 0 && (
                <div className="address-list">
                  {addresses.map((a) => (
                    <label
                      className={`address-option ${addressId === a.id ? "selected" : ""}`}
                      key={a.id}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={addressId === a.id}
                        onChange={() => setAddressId(a.id)}
                      />
                      <div>
                        <b>
                          {a.name} <small>{a.type}</small>
                        </b>
                        <p>
                          {a.line1}, {a.city}, {a.state} - {a.pincode}
                        </p>
                        <span>Phone: {a.phone}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {showAdd && (
                <div className="address-form">
                  {Object.entries(form).map(([k, v]) =>
                    k === "type" ? (
                      <label key={k}>
                        Type
                        <select
                          value={form.type}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              type: e.target.value as "Home" | "Work",
                            })
                          }
                        >
                          <option>Home</option>
                          <option>Work</option>
                        </select>
                      </label>
                    ) : (
                      <label key={k}>
                        {k === "line1"
                          ? "Address line 1"
                          : k.charAt(0).toUpperCase() + k.slice(1)}
                        <input
                          value={String(v)}
                          onChange={(e) =>
                            setForm({ ...form, [k]: e.target.value })
                          }
                        />
                      </label>
                    ),
                  )}
                  <button className="btn btn-secondary" onClick={submitAddress}>
                    Save address
                  </button>
                </div>
              )}
            </div>
          }
          <div className="checkout-card">
            <div className="checkout-card-title">
              <div>
                <span className="step-num">2</span>
                <div>
                  <h3>Payment method</h3>
                  <p>Choose a payment method for this demo checkout.</p>
                </div>
              </div>
            </div>
            <div className="payment-methods">
              {[
                ["UPI", Smartphone, "Pay with UPI"],
                ["Card", CreditCard, "Credit or debit card"],
                ["COD", WalletCards, "Cash on delivery"],
              ].map(([key, Icon, desc]) => (
                <button
                  key={String(key)}
                  className={
                    payment === key ? "pay-option selected" : "pay-option"
                  }
                  onClick={() => setPayment(key as "COD" | "UPI" | "Card")}
                >
                  <span className="pay-icon">
                    <Icon size={20} />
                  </span>
                  <span>
                    <b>{String(key)}</b>
                    <small>{String(desc)}</small>
                  </span>
                  <span className="radio-dot" />
                </button>
              ))}
            </div>
            <div className="payment-note">
              <ShieldCheck size={17} />
              <span>
                This is a simulated checkout. No real money is charged.
              </span>
            </div>
          </div>
        </section>
        <aside className="summary-card checkout-summary">
          <h3>Order summary</h3>
          {cart.length === 0 ? (
            <p>
              Your cart is empty. <Link href="/shop">Shop now</Link>
            </p>
          ) : (
            <>
              {cart.slice(0, 4).map((i) => {
                const p = products.find((x) => x.id === i.productId);
                return (
                  p && (
                    <div className="mini-product" key={p.id}>
                      <SafeImage src={p.image} alt={p.title} category={p.category} />
                      <span>
                        {i.quantity} × {p.title}
                      </span>
                      <b>₹{(p.price * i.quantity).toLocaleString("en-IN")}</b>
                    </div>
                  )
                );
              })}
              <div className="summary-line">
                <span>Subtotal</span>
                <b>₹{cartSubtotal.toLocaleString("en-IN")}</b>
              </div>
              <div className="summary-line">
                <span>Delivery</span>
                <b>{delivery === 0 ? "FREE" : `₹${delivery}`}</b>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <b>₹{total.toLocaleString("en-IN")}</b>
              </div>
              <button
                className="btn btn-primary full btn-lg"
                disabled={!addressId || cart.length === 0}
                onClick={orderNow}
              >
                Place order
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
