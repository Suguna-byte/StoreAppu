import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import KeralaFlourish from "@/components/KeralaFlourish";
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
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat py-24 lg:min-h-[640px] lg:py-32"
        style={{ backgroundImage: "url('/kathakali-hero.jpg')" }}
      >
        {/* A warm-ink scrim rather than flat black, so it sits with the rest
            of the palette instead of reading as a generic dark overlay. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1c1710]/92 via-[#1c1710]/60 to-[#1c1710]/10" />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="animate-fade-up-in max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kerala-yellow">
              Viman Nagar, Pune
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold italic leading-[1.05] text-kerala-cream sm:text-6xl">
              A little piece
              <br />
              of Kerala,
              <br />
              close to home.
            </h1>
            <KeralaFlourish className="mt-6 h-3 w-28" />
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-kerala-cream/85">
              Coconut oil, banana chips, spices and kasavu mundu, sourced with care
              and delivered fresh from our shelves to your door.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="#categories"
                className="bg-kerala-red px-7 py-3 font-semibold text-kerala-cream transition hover:bg-kerala-red-dark"
              >
                Shop Now
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-kerala-cream underline decoration-kerala-yellow decoration-2 underline-offset-4 transition hover:text-kerala-yellow"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="bg-kerala-peach py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start gap-1">
            <h2 className="font-display text-3xl font-semibold text-kerala-green-dark">Shop by category</h2>
            <KeralaFlourish className="h-3 w-24" />
            <p className="mt-2 max-w-md text-kerala-brown/80">
              Everything from the kitchen shelf to the wardrobe.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:auto-rows-[170px]">
            {categories.map((c, i) => (
              <Reveal key={c.slug} index={i} className={i === 0 ? "col-span-2 row-span-2" : ""}>
                <CategoryCard category={c} large={i === 0} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="relative bg-kerala-sage py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-display text-2xl font-semibold text-kerala-green-dark">Featured products</h2>
            <KeralaFlourish className="mt-1 h-3 w-24" />
            <p className="mt-3 text-kerala-brown/80">Fresh picks from Appu&apos;s shelves this week.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p, i) => (
                <Reveal key={p.id} index={i}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-kerala-green-dark py-12 text-kerala-cream">
        <div className="mx-auto grid max-w-6xl gap-8 divide-y divide-kerala-cream/15 px-4 sm:grid-cols-3 sm:gap-6 sm:divide-x sm:divide-y-0">
          <Reveal index={0}>
            <Feature icon={TruckIcon} title="Local delivery" text="Fast doorstep delivery across Viman Nagar and nearby Pune." />
          </Reveal>
          <Reveal index={1}>
            <Feature icon={ShieldIcon} title="Secure payments" text="Checkout safely with Razorpay: UPI, cards and wallets all supported." />
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
    <div className="flex items-start gap-4 pt-6 first:pt-0 sm:pt-0 sm:first:pl-0 sm:[&:not(:first-child)]:pl-6">
      <Icon className="mt-0.5 h-7 w-7 shrink-0 text-kerala-yellow" />
      <div>
        <h3 className="font-display font-semibold text-kerala-cream">{title}</h3>
        <p className="mt-1 text-sm text-kerala-cream/70">{text}</p>
      </div>
    </div>
  );
}
