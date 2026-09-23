import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import KeralaPattern from "@/components/KeralaPattern";
import { fetchPublic } from "@/lib/django";
import type { Category } from "@/types";

const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const display = Playfair_Display({
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ToastProvider>
          <div className="relative flex min-h-screen flex-col">
            <KeralaPattern variant="mural" />
            <Header categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
