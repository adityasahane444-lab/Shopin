"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  initialShopinCatalog,
  normalizeOriginalCatalog,
  ORIGINAL_CATALOG_URL,
} from "@/lib/catalog";
import type { Address, CartItem, Order, Product, User } from "@/lib/types";

type ContextValue = {
  mounted: boolean;
  products: Product[];
  user: User | null;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  addresses: Address[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (
    name: string,
    email: string,
    password: string,
  ) => { ok: boolean; message: string };
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, "name" | "email" | "phone" | "avatar">>) => {
    ok: boolean;
    message: string;
  };
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  placeOrder: (addressId: string, payment: Order["payment"]) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cartCount: number;
  cartSubtotal: number;
};

const Ctx = createContext<ContextValue | null>(null);

const PRODUCT_CACHE_KEY = "shopin_products_v6";
const USERS_KEY = "shopin_users_v1";
const SESSION_KEY = "shopin_session_v1";
const ORDERS_KEY = "shopin_orders_v1";
const LEGACY_CART_KEY = "shopin_cart_v1";
const LEGACY_WISHLIST_KEY = "shopin_wishlist_v1";
const LEGACY_ADDRESSES_KEY = "shopin_addresses_v1";
const CART_PREFIX = "shopin_cart_v2_";
const WISHLIST_PREFIX = "shopin_wishlist_v2_";
const ADDRESSES_PREFIX = "shopin_addresses_v2_";

function sanitizeProductImages(items: Product[]) {
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const item of items) {
    const image = item.image
      .replace(/^\/original-assets\/img\//, "/original-assets/")
      .replace(/^\.\.\/img\//, "/original-assets/")
      .replace(/^\.\.\//, "/original-assets/");
    const key = item.title.trim().toLowerCase().replace(/\s+/g, " ");
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ ...item, image });
  }
  return result;
}

const defaultUsers: User[] = [
  {
    id: "u-demo",
    name: "Aditya",
    email: "demo@shopin.in",
    password: "shopin123",
    role: "customer",
    phone: "",
  },
  {
    id: "u-admin",
    name: "Shopin Admin",
    email: "admin@shopin.in",
    password: "admin123",
    role: "admin",
    phone: "",
  },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable or full; the in-memory app still works.
  }
}

export function ShopinProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialShopinCatalog);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [user, setUser] = useState<User | null>(null);
  const [dataUserId, setDataUserId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);

  const loadUserData = (userId: string, migrateLegacy = false) => {
    const cartKey = `${CART_PREFIX}${userId}`;
    const wishlistKey = `${WISHLIST_PREFIX}${userId}`;
    const addressKey = `${ADDRESSES_PREFIX}${userId}`;

    const storedCart = localStorage.getItem(cartKey);
    const storedWishlist = localStorage.getItem(wishlistKey);
    const storedAddresses = localStorage.getItem(addressKey);

    let nextCart = storedCart ? read<CartItem[]>(cartKey, []) : [];
    let nextWishlist = storedWishlist ? read<string[]>(wishlistKey, []) : [];
    let nextAddresses = storedAddresses ? read<Address[]>(addressKey, []) : [];

    // The previous build used global v1 keys. Migrate them only to the existing
    // demo account, never to newly registered accounts, so accounts cannot leak data.
    if (migrateLegacy && userId === "u-demo") {
      if (!storedCart) nextCart = read<CartItem[]>(LEGACY_CART_KEY, []);
      if (!storedWishlist) nextWishlist = read<string[]>(LEGACY_WISHLIST_KEY, []);
      if (!storedAddresses) nextAddresses = read<Address[]>(LEGACY_ADDRESSES_KEY, []);
      if (nextCart.length) write(cartKey, nextCart);
      if (nextWishlist.length) write(wishlistKey, nextWishlist);
      if (nextAddresses.length) write(addressKey, nextAddresses);
    }

    setCart(nextCart);
    setWishlist(nextWishlist);
    setAddresses(nextAddresses);
    setDataUserId(userId);
  };

  useEffect(() => {
    const cached = read<Product[] | null>(PRODUCT_CACHE_KEY, null);
    const base = cached?.length
      ? sanitizeProductImages(cached)
      : sanitizeProductImages(initialShopinCatalog);
    const storedUsers = read<User[]>(USERS_KEY, defaultUsers);
    const session = read<User | null>(SESSION_KEY, null);

    setProducts(base);
    setUsers(storedUsers);
    setOrders(read<Order[]>(ORDERS_KEY, []));
    setUser(session);
    setMounted(true);

    if (session) {
      loadUserData(session.id, true);
    } else {
      setDataUserId(null);
      setCart([]);
      setWishlist([]);
      setAddresses([]);
    }

    if (!cached?.some((p) => p.source === "original-catalog")) {
      fetch(ORIGINAL_CATALOG_URL, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
          return response.json();
        })
        .then((payload) => {
          const imported = normalizeOriginalCatalog(payload);
          if (imported.length) {
            setProducts((current) => sanitizeProductImages([...current, ...imported]));
          }
        })
        .catch(() => {
          // The store remains fully usable with the bundled catalog when offline.
        });
    }
  }, []);

  useEffect(() => {
    if (mounted) write(PRODUCT_CACHE_KEY, products);
  }, [products, mounted]);

  useEffect(() => {
    if (mounted) write(USERS_KEY, users);
  }, [users, mounted]);

  useEffect(() => {
    if (mounted) write(SESSION_KEY, user);
  }, [user, mounted]);

  useEffect(() => {
    if (mounted) write(ORDERS_KEY, orders);
  }, [orders, mounted]);

  // User-owned data is persisted only while the storage owner matches the session.
  // This prevents a previous account's state from being copied into a new account.
  useEffect(() => {
    if (mounted && user && dataUserId === user.id) {
      write(`${CART_PREFIX}${user.id}`, cart);
      write(`${WISHLIST_PREFIX}${user.id}`, wishlist);
      write(`${ADDRESSES_PREFIX}${user.id}`, addresses);
    }
  }, [cart, wishlist, addresses, user, dataUserId, mounted]);

  const login = (email: string, password: string) => {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (!found) return { ok: false, message: "Invalid email or password." };
    loadUserData(found.id);
    setUser(found);
    write(SESSION_KEY, found);
    return { ok: true, message: "Welcome back." };
  };

  const register = (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail))
      return {
        ok: false,
        message: "An account already exists with this email.",
      };

    const next: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role: "customer",
      phone: "",
    };

    setUsers((prev) => [...prev, next]);
    // New users always start with an empty private shopping/account state.
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    setDataUserId(next.id);
    setUser(next);
    write(`${CART_PREFIX}${next.id}`, []);
    write(`${WISHLIST_PREFIX}${next.id}`, []);
    write(`${ADDRESSES_PREFIX}${next.id}`, []);
    write(SESSION_KEY, next);
    return { ok: true, message: "Account created." };
  };

  const logout = () => {
    setUser(null);
    setDataUserId(null);
    setCart([]);
    setWishlist([]);
    setAddresses([]);
    write(SESSION_KEY, null);
  };

  const updateProfile = (
    patch: Partial<Pick<User, "name" | "email" | "phone" | "avatar">>,
  ) => {
    if (!user) return { ok: false, message: "Please login first." };

    const name = patch.name !== undefined ? patch.name.trim() : user.name;
    const email =
      patch.email !== undefined ? patch.email.trim().toLowerCase() : user.email;
    const phone = patch.phone !== undefined ? patch.phone.trim() : user.phone || "";

    if (!name) return { ok: false, message: "Name cannot be empty." };
    if (!email) return { ok: false, message: "Email cannot be empty." };
    if (
      users.some(
        (u) => u.id !== user.id && u.email.toLowerCase() === email,
      )
    ) {
      return { ok: false, message: "That email is already used by another account." };
    }

    const updated: User = {
      ...user,
      ...patch,
      name,
      email,
      phone,
    };

    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    setUser(updated);
    write(SESSION_KEY, updated);
    return { ok: true, message: "Profile updated successfully." };
  };

  const addToCart = (productId: string, quantity = 1) =>
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing)
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(i.quantity + quantity, 99) }
            : i,
        );
      return [...prev, { productId, quantity }];
    });

  const updateCartQty = (productId: string, quantity: number) =>
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    );

  const removeFromCart = (productId: string) =>
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  const clearCart = () => setCart([]);
  const toggleWishlist = (productId: string) =>
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((x) => x !== productId)
        : [...prev, productId],
    );

  const addAddress = (address: Omit<Address, "id">) =>
    setAddresses((prev) => [...prev, { ...address, id: `a-${Date.now()}` }]);

  const updateAddress = (address: Address) =>
    setAddresses((prev) =>
      prev.map((a) => (a.id === address.id ? address : a)),
    );

  const deleteAddress = (id: string) =>
    setAddresses((prev) => prev.filter((a) => a.id !== id));

  const placeOrder = (addressId: string, payment: Order["payment"]) => {
    if (!user || cart.length === 0) return null;
    const address = addresses.find((a) => a.id === addressId);
    if (!address) return null;
    const subtotal = cart.reduce(
      (sum, item) =>
        sum +
        (products.find((p) => p.id === item.productId)?.price ?? 0) *
          item.quantity,
      0,
    );
    const delivery = subtotal >= 500 ? 0 : 49;
    const order: Order = {
      id: `SPN${Date.now().toString().slice(-8)}`,
      userId: user.id,
      items: [...cart],
      total: subtotal + delivery,
      subtotal,
      delivery,
      payment,
      address,
      placedAt: new Date().toISOString(),
      status: "Placed",
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
    return order;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
    );

  const addProduct = (product: Product) =>
    setProducts((prev) => [product, ...prev]);
  const updateProduct = (product: Product) =>
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          (products.find((p) => p.id === item.productId)?.price ?? 0) *
            item.quantity,
        0,
      ),
    [cart, products],
  );

  const value: ContextValue = {
    mounted,
    products,
    user,
    cart,
    wishlist,
    orders,
    addresses,
    login,
    register,
    logout,
    updateProfile,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
    addAddress,
    updateAddress,
    deleteAddress,
    placeOrder,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    cartCount: cart.reduce((s, i) => s + i.quantity, 0),
    cartSubtotal,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShopin() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useShopin must be used inside ShopinProvider");
  return ctx;
}
