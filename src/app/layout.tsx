import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Apple (India)",
  description:
    "Discover the innovative world of Apple and shop everything iPhone, iPad, Apple Watch, Mac, and Apple TV, plus explore accessories, entertainment, and expert device support.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">
          <CartProvider>{children}</CartProvider>
        </div>
      </body>
    </html>
  );
}
