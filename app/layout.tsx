import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShopinProvider } from "@/components/ShopinProvider";

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
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </ShopinProvider>
      </body>
    </html>
  );
}
