"use client";

import Link from "next/link";
import { BadgePercent, Grid2X2, Home, ShoppingCart, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useShopin } from "./ShopinProvider";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user, cartCount } = useShopin();
  const accountHref = user ? "/profile" : "/login";
  const items = [
    ["/", "Home", Home],
    ["/deals", "Deals", BadgePercent],
    ["/categories", "Categories", Grid2X2],
    [accountHref, "Account", UserRound],
    ["/cart", "Cart", ShoppingCart],
  ] as const;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile shopping navigation">
      {items.map(([href, label, Icon]) => {
        const active = href === "/"
          ? pathname === "/"
          : href === "/cart"
            ? pathname === "/cart"
            : href === "/profile" || href === "/login"
              ? pathname === "/profile" || pathname === "/login"
              : pathname.startsWith(href);
        return (
          <Link key={label} href={href} className={active ? "active" : ""}>
            <span className="mobile-nav-icon">
              <Icon size={21} strokeWidth={active ? 2.6 : 2} />
              {label === "Cart" && cartCount > 0 && <b>{cartCount > 99 ? "99+" : cartCount}</b>}
            </span>
            <small>{label}</small>
          </Link>
        );
      })}
    </nav>
  );
}
