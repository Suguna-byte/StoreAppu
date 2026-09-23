import Link from "next/link";
import KathakaliHero from "@/components/KathakaliHero";
import KeralaPattern from "@/components/KeralaPattern";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { fetchPublic } from "@/lib/django";
import type { Category, Paginated, ProductListItem } from "@/types";

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    fetchPublic<Category[]>("/catalog/categories/").catch(() => []),
    fetchPublic<Paginated<ProductListItem>>("/catalog/products/").catch(() => null),
  ]);

  const featured = products?.results?.slice(0, 8) ?? [];

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-kerala-cream-dark to-kerala-cream py-14">
        <KeralaPattern variant="leaves" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-block rounded-full bg-kerala-yellow/30 px-4 py-1 text-sm font-semibold text-kerala-brown">
              Viman Nagar, Pune
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-kerala-green-dark sm:text-5xl">
              Appu&apos;s Kerala Store
            </h1>
            <p className="mt-4 max-w-lg text-lg text-kerala-brown/90">
              Coconut oil, banana chips, spices, kasavu mundu and everything else that
              tastes and feels like home — delivered fresh from our store to your door.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#categories"
                className="rounded-full bg-kerala-red px-6 py-3 font-semibold text-kerala-cream shadow transition hover:bg-kerala-red-dark"
              >
                Shop Now
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-kerala-green px-6 py-3 font-semibold text-kerala-green-dark transition hover:bg-kerala-green hover:text-kerala-cream"
              >
                Create an account
              </Link>
            </div>
          </div>
          <div className="animate-float-slow">
            <KathakaliHero />
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold text-kerala-green-dark">Shop by Category</h2>
        <p className="mt-1 text-kerala-brown/80">Everything from the kitchen shelf to the wardrobe.</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="relative bg-kerala-green/5 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl font-bold text-kerala-green-dark">Featured Products</h2>
            <p className="mt-1 text-kerala-brown/80">Fresh picks from Appu&apos;s shelves this week.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 rounded-3xl border border-kerala-yellow/40 bg-white/70 p-8 sm:grid-cols-3">
          <Feature icon="🚚" title="Local delivery" text="Fast doorstep delivery across Viman Nagar and nearby Pune." />
          <Feature icon="🔒" title="Secure payments" text="Checkout safely with Razorpay — UPI, cards and wallets supported." />
          <Feature icon="🌴" title="Authentic Kerala" text="Sourced with care, from Malabar spices to Kasargod coconut oil." />
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-2 font-display font-bold text-kerala-brown">{title}</h3>
      <p className="mt-1 text-sm text-kerala-brown/70">{text}</p>
    </div>
  );
}
