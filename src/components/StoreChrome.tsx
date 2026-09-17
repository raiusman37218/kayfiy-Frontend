"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Script from "next/script";

export default function StoreChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-full flex flex-col bg-cream text-charcoal">
      <AnnouncementBar />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer />
      {/* Chatify Live Chat Support */}
      <Script
        src="https://chat-system-wabd.vercel.app/widget.js"
        data-workspace-id="3eb98378-a1cb-4a14-a666-d68624b01bdc"
        strategy="afterInteractive"
      />
    </div>
  );
}
