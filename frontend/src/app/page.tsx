import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import CustomerFavorites from "@/components/CustomerFavorites";
import PromoTile from "@/components/PromoTile";
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

  const allProducts = products?.results ?? [];
  const featured = allProducts.slice(0, 8);
  const favorites = allProducts.slice(0, 5);
  const byIcon = (icon: string) => categories.find((c) => c.icon === icon);
  // The two categories we have real photography for that aren't already
  // used elsewhere on the page: cloth and oil go in the hero banner grid,
  // the rest go in the promo strip further down.
  const heroSide = [byIcon("cloth"), byIcon("oil")].filter((c): c is Category => !!c && !!c.image);
  const promoStrip = [byIcon("grocery"), byIcon("home"), byIcon("kerala")].filter(
    (c): c is Category => !!c && !!c.image
  );

  return (
    <div>
      <section className="bg-kerala-cream pb-6 pt-4 sm:pb-10 sm:pt-6">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 lg:h-[520px] lg:grid-cols-3 lg:grid-rows-2">
          <div
            className="relative col-span-2 row-span-2 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/kathakali-hero.jpg')", minHeight: 420 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#1c1710]/92 via-[#1c1710]/55 to-[#1c1710]/5" />
            <div className="relative z-10 flex h-full flex-col justify-center p-6 sm:p-10">
              <div className="animate-fade-up-in max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kerala-yellow">
                  Viman Nagar, Pune
                </p>
                <h1
                  className="mt-4 font-display font-semibold italic leading-[1.05] text-kerala-cream"
                  style={{ fontSize: "clamp(2.25rem, 1.6rem + 3vw, 3.5rem)" }}
                >
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
                    className="ease-fluid bg-kerala-red px-7 py-3 font-semibold text-kerala-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-kerala-red-dark hover:shadow-lg"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/register"
                    className="ease-fluid text-sm font-semibold text-kerala-cream underline decoration-kerala-yellow decoration-2 underline-offset-4 transition-colors duration-300 hover:text-kerala-yellow"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {heroSide.map((c) => (
            <PromoTile
              key={c.slug}
              href={`/category/${c.slug}`}
              image={c.image as string}
              eyebrow={`${c.product_count} products`}
              title={c.name}
              className="min-h-[200px] lg:min-h-0"
            />
          ))}
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
            <div className="mt-8">
              <FeaturedProductsSection products={featured} />
            </div>
          </div>
        </section>
      )}

      {promoStrip.length > 0 && (
        <section className="bg-kerala-cream py-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {promoStrip.map((c) => (
                <Reveal key={c.slug}>
                  <PromoTile
                    href={`/category/${c.slug}`}
                    image={c.image as string}
                    eyebrow={`${c.product_count} products`}
                    title={c.name}
                    className="h-56"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {favorites.length >= 3 && (
        <section className="bg-kerala-peach/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="font-display text-2xl font-semibold text-kerala-green-dark">Customer favorites</h2>
              <KeralaFlourish className="mx-auto mt-1 h-3 w-24" />
            </div>
            <div className="mt-10">
              <CustomerFavorites products={favorites} />
            </div>
          </div>
        </section>
      )}

      <section className="bg-kerala-cream py-20">
        <Reveal>
          <div className="mx-auto max-w-2xl px-4 text-center">
            <KeralaFlourish className="mx-auto h-3 w-24" />
            <p className="mt-6 font-display text-2xl italic leading-relaxed text-kerala-brown sm:text-[28px]">
              We started this shop so the smell of fresh banana chips and good
              coconut oil would never feel far from home, however far Pune
              might be from Kerala.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-kerala-yellow-dark">
              Appu, Founder
            </p>
          </div>
        </Reveal>
      </section>

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

      <section className="relative overflow-hidden bg-kerala-red py-16 text-center text-kerala-cream">
        <div className="relative z-10 mx-auto max-w-xl px-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-kerala-cream/80">Only this week</p>
          <h2 className="mt-3 font-display text-3xl font-semibold italic">A different kind of grocery store.</h2>
          <p className="mt-3 text-kerala-cream/85">
            Everything on our shelves is picked the way we&apos;d pick it for our own kitchen back home.
          </p>
          <Link
            href="#categories"
            className="ease-fluid mt-6 inline-block bg-kerala-cream px-7 py-3 font-semibold text-kerala-red-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-kerala-yellow"
          >
            Shop Now
          </Link>
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
