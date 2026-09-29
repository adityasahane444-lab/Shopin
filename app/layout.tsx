import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShopinProvider } from "@/components/ShopinProvider";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata = {
  title: "Shopin — Smart Shopping",
  description: "Shopin modern e-commerce experience",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ShopinProvider>
          <Suspense fallback={<div className="route-loading" aria-hidden="true" />}><Header /></Suspense>
          <main className="site-main"><Suspense fallback={<div className="route-loading" aria-hidden="true" />}>{children}</Suspense></main>
          <Footer />
          <MobileBottomNav />
        </ShopinProvider>
      </body>
    </html>
  );
}
