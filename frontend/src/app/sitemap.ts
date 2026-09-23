import type { MetadataRoute } from "next";
import { fetchPublic } from "@/lib/django";
import type { Category, Paginated, ProductListItem } from "@/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    fetchPublic<Category[]>("/catalog/categories/").catch(() => []),
    fetchPublic<Paginated<ProductListItem>>("/catalog/products/").catch(() => null),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/register`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products?.results ?? []).map((p) => ({
    url: `${siteUrl}/products/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
