import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <img
            src="/brand/shopin-logo.svg"
            alt="Shopin"
            className="footer-logo"
          />
          <p>Shop smarter. Live better.</p>
          <small>© 2026 Shopin. Built as a modern e-commerce project.</small>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/shop">Shop</Link>
          <Link href="/profile">My Account</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <div>
          <h4>Customer Care</h4>
          <span>24×7 support</span>
          <span>Easy returns</span>
          <span>Secure checkout</span>
          <span>Help center</span>
        </div>
        <div>
          <h4>Payment</h4>
          <span>UPI</span>
          <span>Credit / Debit Cards</span>
          <span>Cash on Delivery</span>
          <span>Razorpay-ready checkout</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Made for fast, clean and joyful shopping.</span>
        <span>Privacy · Terms · Returns</span>
      </div>
    </footer>
  );
}
