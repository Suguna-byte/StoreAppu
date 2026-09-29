import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { fetchPublic } from "@/lib/django";
import type { Category } from "@/types";

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const display = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Appu's Kerala Store | Kerala Groceries & Fashion in Viman Nagar, Pune",
    template: "%s | Appu's Kerala Store",
  },
  description:
    "Authentic Kerala groceries, spices, snacks and clothing — coconut oil, banana chips, kasavu mundu and more — delivered across Viman Nagar, Pune.",
  keywords: [
    "Kerala store Pune",
    "Viman Nagar grocery",
    "coconut oil online",
    "banana chips",
    "mundu online",
    "Kerala spices Pune",
  ],
  openGraph: {
    title: "Appu's Kerala Store",
    description: "Authentic Kerala groceries and fashion, delivered across Viman Nagar, Pune.",
    url: siteUrl,
    siteName: "Appu's Kerala Store",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Appu's Kerala Store",
    description: "Authentic Kerala groceries and fashion, delivered across Viman Nagar, Pune.",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await fetchPublic<Category[]>("/catalog/categories/").catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GroceryStore",
    name: "Appu's Kerala Store",
    image: `${siteUrl}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Viman Nagar, Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    servesCuisine: "Kerala",
    priceRange: "₹₹",
  };

  return (
    <html lang="en">
      <body className={`${body.variable} ${display.variable} antialiased`}>
        {/* Scroll-reveal animations rely on JS; without it, .reveal elements
            would stay at opacity:0 forever, hiding real content (bad for
            no-JS users and non-JS-executing crawlers). */}
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col bg-kerala-cream">
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
