import type { Metadata } from "next";
import "./globals.css";
import { BackToTop, Footer, Header, MobileQuickNav, PageProgress } from "@/components/site-shell";
import { PwaClient } from "@/components/pwa-client";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: { default: "Tekirdağ Basketbol İl Temsilciliği", template: "%s | Tekirdağ Basketbol" },
  description: "Tekirdağ basketbol müsabakaları, sonuçları, ligler ve duyurular.",
  openGraph: { title: "Tekirdağ Basketbol İl Temsilciliği", description: "Tekirdağ basketbolunun dijital buluşma noktası.", locale: "tr_TR", type: "website" },
  twitter: { card: "summary", title: "Tekirdağ Basketbol İl Temsilciliği", description: "Maç programları, sonuçlar ve duyurular." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <Header />
        <PageProgress />
        <PwaClient />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <MobileQuickNav />
      </body>
    </html>
  );
}
