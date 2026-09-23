import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import { DjangoApiError, fetchPublic } from "@/lib/django";
import type { ProductDetail } from "@/types";

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    return await fetchPublic<ProductDetail>(`/catalog/products/${slug}/`);
  } catch (err) {
    if (err instanceof DjangoApiError && err.status === 404) return null;
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description || `Buy ${product.name} online from Appu's Kerala Store, Viman Nagar, Pune.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [product.images[0].image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const primaryImage = product.images.find((i) => i.is_primary) || product.images[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: primaryImage?.image,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-6 text-sm text-kerala-brown/70">
        <Link href="/" className="hover:text-kerala-red">Home</Link>
        {" / "}
        <Link href={`/category/${product.category}`} className="hover:text-kerala-red">
          {product.category_name}
        </Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-kerala-yellow/30 bg-kerala-cream-dark">
          {primaryImage ? (
            <Image src={primaryImage.image} alt={primaryImage.alt_text || product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-7xl">🥥</div>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-kerala-green">
            {product.category_name}
          </span>
          <h1 className="mt-1 font-display text-3xl font-bold text-kerala-brown">{product.name}</h1>
          <p className="mt-2 text-sm text-kerala-brown/60">Sold by {product.seller_name}</p>

          <p className="mt-4 font-display text-3xl font-extrabold text-kerala-green-dark">
            ₹{product.price} <span className="text-base font-normal text-kerala-brown/70">/ {product.unit}</span>
          </p>

          <p className={`mt-2 text-sm font-semibold ${product.in_stock ? "text-kerala-green" : "text-kerala-red"}`}>
            {product.in_stock ? `${product.stock} in stock` : "Currently out of stock"}
          </p>

          <p className="mt-6 leading-relaxed text-kerala-brown/90">{product.description}</p>

          <AddToCartButton productId={product.id} disabled={!product.in_stock} className="mt-8 px-8 py-3 text-base" />
        </div>
      </div>
    </div>
  );
}
