import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { LeafIcon, ShieldIcon, TruckIcon } from "@/components/icons/UiIcons";
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
      <section
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-20 lg:min-h-[620px] lg:py-28"
        style={{ backgroundImage: "url('/kathakali-hero.jpg')" }}
      >
        {/* Dark-to-transparent scrim so the text stays legible on the left
            while the performer remains visible on the right of the photo. */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="animate-fade-up-in max-w-lg">
            <p className="mb-3 inline-block rounded-full bg-kerala-yellow/90 px-4 py-1 text-sm font-semibold text-kerala-green-dark">
              Viman Nagar, Pune
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-kerala-cream sm:text-5xl">
              Appu&apos;s Kerala Store
            </h1>
            <p className="mt-4 max-w-lg text-lg text-kerala-cream/90">
              Coconut oil, banana chips, spices, kasavu mundu and everything else that
              tastes and feels like home — delivered fresh from our store to your door.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#categories"
                className="rounded-full bg-kerala-red px-6 py-3 font-semibold text-kerala-cream shadow transition hover:-translate-y-0.5 hover:bg-kerala-red-dark hover:shadow-lg active:translate-y-0"
              >
                Shop Now
              </Link>
              <Link
                href="/register"
                className="rounded-full border-2 border-kerala-cream px-6 py-3 font-semibold text-kerala-cream transition hover:-translate-y-0.5 hover:bg-kerala-cream hover:text-kerala-green-dark active:translate-y-0"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-kerala-peach py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold text-kerala-green-dark">Shop by Category</h2>
            <p className="mx-auto mt-2 max-w-md text-kerala-brown/80">
              Everything from the kitchen shelf to the wardrobe.
            </p>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-kerala-yellow" />
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.slug} index={i}>
                <CategoryCard category={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="relative bg-kerala-sage py-14">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl font-bold text-kerala-green-dark">Featured Products</h2>
            <p className="mt-1 text-kerala-brown/80">Fresh picks from Appu&apos;s shelves this week.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 rounded-3xl border border-kerala-yellow/40 bg-white p-8 shadow-sm sm:grid-cols-3">
          <Reveal index={0}>
            <Feature icon={TruckIcon} title="Local delivery" text="Fast doorstep delivery across Viman Nagar and nearby Pune." />
          </Reveal>
          <Reveal index={1}>
            <Feature icon={ShieldIcon} title="Secure payments" text="Checkout safely with Razorpay — UPI, cards and wallets supported." />
          </Reveal>
          <Reveal index={2}>
            <Feature icon={LeafIcon} title="Authentic Kerala" text="Sourced with care, from Malabar spices to Kasargod coconut oil." />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: (props: { className?: string }) => React.ReactElement;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-9 w-9 text-kerala-green" />
      <h3 className="mt-2 font-display font-bold text-kerala-brown">{title}</h3>
      <p className="mt-1 text-sm text-kerala-brown/70">{text}</p>
    </div>
  );
}
