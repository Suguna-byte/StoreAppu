import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { DjangoApiError, fetchPublic } from "@/lib/django";
import type { Category, Paginated, ProductListItem } from "@/types";

async function getCategory(slug: string): Promise<Category | null> {
  try {
    return await fetchPublic<Category>(`/catalog/categories/${slug}/`);
  } catch (err) {
    // A genuine 404 from Django means the category doesn't exist. Any other
    // failure (network blip, 5xx) should surface as a real error, not a
    // misleading "not found" page.
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
  const category = await getCategory(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} — Shop Online`,
    description:
      category.description ||
      `Browse ${category.name} at Appu's Kerala Store, Viman Nagar, Pune. ${category.product_count} products available.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const products = await fetchPublic<Paginated<ProductListItem>>(
    `/catalog/products/?category__slug=${slug}`
  ).catch(() => null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-kerala-green-dark">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-2xl text-kerala-brown/80">{category.description}</p>}

      {products && products.results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-kerala-brown/70">No products in this category yet — check back soon!</p>
      )}
    </div>
  );
}
