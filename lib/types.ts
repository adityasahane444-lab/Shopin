export type Category = string;

export type Product = {
  id: string;
  title: string;
  brand: string;
  category: Category;
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description: string;
  features: string[];
  stock: number;
  seller: string;
  source?: "shopin" | "original-zip" | "original-catalog";
};

export type CartItem = { productId: string; quantity: number };
export type Address = {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Work";
};
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "customer" | "admin";
  avatar?: string;
};
export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  delivery: number;
  payment: "COD" | "UPI" | "Card";
  address: Address;
  placedAt: string;
  status:
    | "Placed"
    | "Confirmed"
    | "Packed"
    | "Shipped"
    | "Out for Delivery"
    | "Delivered"
    | "Cancelled";
};
