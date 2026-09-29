"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Camera,
  Heart,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  Plus,
  Save,
  Settings,
  Trash2,
  UserRound,
  X,
  WalletCards,
  ChevronRight,
} from "lucide-react";
import { useShopin } from "@/components/ShopinProvider";
import SafeImage from "@/components/SafeImage";
import type { Address } from "@/lib/types";

const emptyAddress = {
  name: "",
  phone: "",
  line1: "",
  city: "Pune",
  state: "Maharashtra",
  pincode: "411005",
  type: "Home" as "Home" | "Work",
};

export default function Profile() {
  const {
    user,
    logout,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    updateProfile,
    wishlist,
    products,
    orders,
  } = useShopin();

  const [tab, setTab] = useState("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  useEffect(() => {
    if (!user) return;
    setProfileForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#wishlist")
      setTab("wishlist");
  }, []);

  if (!user)
    return (
      <div className="page-shell">
        <div className="empty-state">
          <UserRound size={42} />
          <h2>Sign in to manage your account</h2>
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );

  const openNewAddress = () => {
    setEditingAddressId(null);
    setAddressForm({ ...emptyAddress, name: user.name, phone: user.phone || "" });
    setShowAdd(true);
  };

  const openEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      line1: address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      type: address.type,
    });
    setShowAdd(true);
  };

  const closeAddressForm = () => {
    setShowAdd(false);
    setEditingAddressId(null);
    setAddressForm({ ...emptyAddress, name: user.name, phone: user.phone || "" });
  };

  const saveAddress = () => {
    if (
      !addressForm.name.trim() ||
      !addressForm.phone.trim() ||
      !addressForm.line1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.state.trim() ||
      !/^\d{6}$/.test(addressForm.pincode.trim())
    ) {
      return;
    }

    if (editingAddressId) {
      updateAddress({ ...addressForm, id: editingAddressId });
    } else {
      addAddress({ ...addressForm });
    }
    closeAddressForm();
  };

  const saveProfile = () => {
    const result = updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone,
      avatar: profileForm.avatar || undefined,
    });
    setProfileMsg(result.message);
    setProfileError(!result.ok);
    if (result.ok) setEditingProfile(false);
  };

  const onAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileMsg("Please select an image file.");
      setProfileError(true);
      return;
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setProfileMsg("Profile photo must be smaller than 1.5 MB.");
      setProfileError(true);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm((current) => ({ ...current, avatar: String(reader.result || "") }));
      setProfileMsg("");
      setProfileError(false);
    };
    reader.readAsDataURL(file);
  };

  const wishProducts = products.filter((p) => wishlist.includes(p.id));

  const mobileAccountActions = [
    ["orders", "Orders", Package, `${orders.filter((o) => o.userId === user.id).length} purchases`],
    ["wishlist", "Wishlist", Heart, `${wishProducts.length} saved items`],
    ["addresses", "Saved addresses", MapPin, `${addresses.length} saved`],
    ["settings", "Profile settings", Settings, "Edit your details"],
  ] as const;

  return (
    <div className="page-shell account-page">
      <div className="breadcrumb">Home / My Account</div>
      <section className="mobile-account-hub">
        <div className="mobile-account-greeting">
          <div className="mobile-account-avatar">{user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name.slice(0, 1).toUpperCase()}</div>
          <div><small>Hey, {user.name.split(" ")[0]}</small><h1>Welcome to your Shopin account</h1></div>
          <button onClick={() => setEditingProfile(true)} aria-label="Edit profile"><Pencil size={17} /></button>
        </div>
        <div className="mobile-supercoin-card"><div><span>Your Shopin balance</span><b>₹0</b></div><div><span>Shopping points</span><b>0</b></div><WalletCards size={22} /></div>
        <div className="mobile-account-quick-grid">
          {mobileAccountActions.map(([key, label, Icon, meta]) => (
            <button key={key} onClick={() => {
              if (key === "settings") {
                setTab("profile");
                setProfileMsg("");
                setProfileError(false);
                setProfileForm({
                  name: user.name || "",
                  email: user.email || "",
                  phone: user.phone || "",
                  avatar: user.avatar || "",
                });
                setEditingProfile(true);
              } else {
                setTab(String(key));
              }
            }}><span><Icon size={21} /></span><div><b>{label}</b><small>{meta}</small></div><ChevronRight size={16} /></button>
          ))}
        </div>
        <div className="mobile-account-section">
          <span className="mobile-kicker">SHOPIN HELP</span>
          <Link href="/deals">Coupons & offers <ChevronRight size={16} /></Link>
          {user.role === "admin" && <Link href="/admin">Admin panel <ChevronRight size={16} /></Link>}
        </div>
      </section>
      <div className="account-layout">
        <aside className="account-nav">
          <div className="account-person">
            <div className="avatar-wrap">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-img" />
              ) : (
                <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
              )}
            </div>
            <div>
              <small>Hello,</small>
              <b>{user.name}</b>
            </div>
          </div>
          {[
            ["profile", "Profile", UserRound],
            ["orders", "My Orders", Package],
            ["addresses", "Addresses", MapPin],
            ["wishlist", "Wishlist", Heart],
            ["settings", "Settings", Settings],
          ].map(([key, label, Icon]) => (
            <button
              key={String(key)}
              onClick={() => setTab(String(key))}
              className={tab === key ? "active" : ""}
            >
              <Icon size={18} />
              {String(label)}
            </button>
          ))}
          {user.role === "admin" && (
            <Link href="/admin">
              Admin panel <span>→</span>
            </Link>
          )}
          <button className="logout-link" onClick={logout}>
            Logout
          </button>
        </aside>

        <section className="account-content">
          {tab === "profile" && (
            <>
              <div className="content-card">
                <div className="card-title">
                  <div>
                    <span className="kicker">YOUR PROFILE</span>
                    <h2>Personal information</h2>
                  </div>
                  {!editingProfile ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setProfileForm({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          avatar: user.avatar || "",
                        });
                        setProfileMsg("");
                        setProfileError(false);
                        setEditingProfile(true);
                      }}
                    >
                      <Pencil size={15} /> Edit profile
                    </button>
                  ) : (
                    <div className="profile-edit-actions">
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setEditingProfile(false);
                          setProfileMsg("");
                        }}
                      >
                        <X size={15} /> Cancel
                      </button>
                      <button className="btn btn-primary" onClick={saveProfile}>
                        <Save size={15} /> Save changes
                      </button>
                    </div>
                  )}
                </div>

                {profileMsg && (
                  <div className={profileError ? "notice error" : "notice success"}>
                    {profileMsg}
                  </div>
                )}

                {editingProfile ? (
                  <div className="profile-editor">
                    <div className="profile-photo-editor">
                      {profileForm.avatar ? (
                        <img src={profileForm.avatar} alt="Profile preview" className="profile-photo-preview" />
                      ) : (
                        <div className="profile-photo-placeholder">
                          {profileForm.name.slice(0, 1).toUpperCase() || <UserRound size={28} />}
                        </div>
                      )}
                      <label className="photo-upload-btn">
                        <Camera size={15} /> Change photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={onAvatarChange}
                          hidden
                        />
                      </label>
                      {profileForm.avatar && (
                        <button
                          className="remove-photo"
                          onClick={() => setProfileForm((current) => ({ ...current, avatar: "" }))}
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                    <div className="profile-editor-fields">
                      <label>
                        <span>Full name</span>
                        <div className="editor-input-wrap">
                          <UserRound size={16} />
                          <input
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            placeholder="Your full name"
                          />
                        </div>
                      </label>
                      <label>
                        <span>Email address</span>
                        <div className="editor-input-wrap">
                          <Mail size={16} />
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            placeholder="you@example.com"
                          />
                        </div>
                      </label>
                      <label>
                        <span>Phone number</span>
                        <div className="editor-input-wrap">
                          <Phone size={16} />
                          <input
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            placeholder="10-digit phone number"
                          />
                        </div>
                      </label>
                      <label>
                        <span>Account type</span>
                        <div className="editor-input-wrap disabled-input">
                          <Settings size={16} />
                          <input
                            value={user.role === "admin" ? "Administrator" : "Customer"}
                            readOnly
                          />
                        </div>
                        <small className="field-help">Account type is managed by Shopin and cannot be edited.</small>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="profile-grid">
                    <div>
                      <small>Name</small>
                      <b>{user.name}</b>
                    </div>
                    <div>
                      <small>Email</small>
                      <b>{user.email}</b>
                    </div>
                    <div>
                      <small>Phone</small>
                      <b>{user.phone || "Not added"}</b>
                    </div>
                    <div>
                      <small>Account type</small>
                      <b>{user.role === "admin" ? "Administrator" : "Customer"}</b>
                    </div>
                  </div>
                )}
              </div>

              <div className="stats-row">
                <div>
                  <Package />
                  <b>{orders.filter((o) => o.userId === user.id).length}</b>
                  <span>Orders</span>
                </div>
                <div>
                  <Heart />
                  <b>{wishlist.length}</b>
                  <span>Wishlist</span>
                </div>
                <div>
                  <MapPin />
                  <b>{addresses.length}</b>
                  <span>Addresses</span>
                </div>
              </div>
            </>
          )}

          {tab === "orders" && (
            <div className="content-card">
              <div className="card-title">
                <div>
                  <span className="kicker">PURCHASE HISTORY</span>
                  <h2>Your orders</h2>
                </div>
                <Link href="/orders">View all →</Link>
              </div>
              {orders
                .filter((o) => o.userId === user.id)
                .slice(0, 4)
                .map((o) => (
                  <div className="compact-order" key={o.id}>
                    <span>#{o.id}</span>
                    <b>₹{o.total.toLocaleString("en-IN")}</b>
                    <em>{o.status}</em>
                    <small>{new Date(o.placedAt).toLocaleDateString("en-IN")}</small>
                  </div>
                ))}
              {orders.filter((o) => o.userId === user.id).length === 0 && (
                <p className="muted">No orders yet.</p>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="content-card">
              <div className="card-title">
                <div>
                  <span className="kicker">DELIVERY</span>
                  <h2>Saved addresses</h2>
                </div>
                <button className="btn btn-secondary" onClick={openNewAddress}>
                  <Plus size={16} /> Add address
                </button>
              </div>

              {showAdd && (
                <div className="address-form">
                  {([
                    ["name", "Name"],
                    ["phone", "Phone"],
                    ["line1", "Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["pincode", "Pincode"],
                  ] as const).map(([key, label]) => (
                    <label key={key}>
                      {label}
                      <input
                        value={addressForm[key]}
                        onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })}
                        inputMode={key === "phone" || key === "pincode" ? "numeric" : undefined}
                        maxLength={key === "pincode" ? 6 : undefined}
                      />
                    </label>
                  ))}
                  <label>
                    Type
                    <select
                      value={addressForm.type}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          type: e.target.value as "Home" | "Work",
                        })
                      }
                    >
                      <option>Home</option>
                      <option>Work</option>
                    </select>
                  </label>
                  <div className="address-form-actions">
                    <button className="btn btn-ghost" onClick={closeAddressForm}>
                      Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveAddress}>
                      <Save size={15} /> {editingAddressId ? "Update address" : "Save address"}
                    </button>
                  </div>
                </div>
              )}

              <div className="saved-addresses">
                {addresses.map((a) => (
                  <div className="saved-address" key={a.id}>
                    <MapPin />
                    <div>
                      <b>
                        {a.name} <small>{a.type}</small>
                      </b>
                      <p>
                        {a.line1}, {a.city}, {a.state} - {a.pincode}
                      </p>
                      <span>{a.phone}</span>
                    </div>
                    <div className="address-card-actions">
                      <button title="Edit address" onClick={() => openEditAddress(a)}>
                        <Pencil size={16} />
                      </button>
                      <button title="Delete address" onClick={() => deleteAddress(a.id)}>
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {addresses.length === 0 && !showAdd && (
                <p className="muted">No saved addresses yet.</p>
              )}
            </div>
          )}

          {tab === "wishlist" && (
            <div className="content-card">
              <div className="card-title">
                <div>
                  <span className="kicker">SAVED ITEMS</span>
                  <h2>Wishlist</h2>
                </div>
              </div>
              {wishProducts.length ? (
                <div className="product-grid wish-grid">
                  {wishProducts.map((p) => (
                    <div key={p.id}>
                      <Link href={`/product/${p.id}`}>
                        <SafeImage
                          src={p.image}
                          alt={p.title}
                          category={p.category}
                          style={{ width: "100%", height: 160, objectFit: "contain" }}
                        />
                      </Link>
                      <b>{p.title}</b>
                      <div className="price-line">
                        <b>₹{p.price.toLocaleString("en-IN")}</b>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">Your wishlist is empty. Save products you want to revisit.</p>
              )}
            </div>
          )}

          {tab === "settings" && (
            <div className="content-card">
              <div className="card-title">
                <div>
                  <span className="kicker">ACCOUNT</span>
                  <h2>Settings</h2>
                </div>
              </div>
              <div className="setting-row">
                <div>
                  <b>Profile editing</b>
                  <p>Edit your name, email, phone and profile photo from the Profile tab.</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setTab("profile")}>
                  Edit profile
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Change password</b>
                  <p>For this local demo, account credentials are stored in browser storage.</p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    alert("Demo: password management would be connected to a real auth provider in production.")
                  }
                >
                  Manage
                </button>
              </div>
              <div className="setting-row">
                <div>
                  <b>Notifications</b>
                  <p>Order updates and shopping alerts.</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span />
                </label>
              </div>
              <div className="setting-row danger">
                <div>
                  <b>Sign out of Shopin</b>
                  <p>End your current browser session.</p>
                </div>
                <button className="btn btn-danger" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
