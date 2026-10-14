import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { fetchPublic } from "@/lib/django";
import type { Paginated, ProductListItem } from "@/types";

export const metadata: Metadata = { title: "Search results" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const products = q
    ? await fetchPublic<Paginated<ProductListItem>>(`/catalog/products/?search=${encodeURIComponent(q)}`).catch(
        () => null
      )
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-up-in">
        <h1 className="font-display text-3xl font-bold text-kerala-green-dark">
          {q ? `Results for “${q}”` : "Search"}
        </h1>
        {products && (
          <p className="mt-2 text-kerala-brown/70">
            {products.results.length} product{products.results.length === 1 ? "" : "s"} found.
          </p>
        )}
      </div>

      {products && products.results.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.results.map((p, i) => (
            <Reveal key={p.id} index={i}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-kerala-brown/70">
          {q ? "No products matched your search. Try a different word." : "Type something in the search bar to get started."}
        </p>
      )}
    </div>
  );
}
