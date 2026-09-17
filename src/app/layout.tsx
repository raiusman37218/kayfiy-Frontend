import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Playfair_Display } from "next/font/google";
import StoreChrome from "@/components/StoreChrome";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const body = Jost({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KAYFIY — Comfort Wear & Women's Innerwear",
    template: "%s | KAYFIY",
  },
  description:
    "KAYFIY makes bras, bra sets, nightwear, panties and shapewear designed for supreme everyday comfort, breathable fabrics and honest Pakistani sizing.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${heading.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <StoreChrome>{children}</StoreChrome>
      </body>
    </html>
  );
}
