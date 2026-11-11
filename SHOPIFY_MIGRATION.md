# Moving Appu's Kerala Store to Shopify

This is a setup guide, not code — the actual store setup happens in your Shopify
account, which this session has no access to (no login, no billing, no API
connector). Everything below is exact steps for you to follow yourself.

## Before you start: pick the no-inventory model that actually fits

"No inventory" can mean two different things on Shopify, and they need different
settings:

1. **Make/stock to order** (almost certainly what fits this store): you don't
   pre-buy stock. When an order comes in, you buy/prepare that exact quantity
   and ship it yourself. This is the realistic option for banana chips, coconut
   oil, spices, kasavu mundu, etc. — there is no mainstream Shopify dropship
   marketplace (DSers, Spocket, CJ Dropshipping) that carries authentic Kerala
   specialty foods or regional clothing. Those networks are mostly generic,
   China-sourced consumer goods.
2. **True dropshipping**: a supplier holds real stock and ships directly to
   your customer under your brand. This only works if you first find and
   contract an actual Kerala-goods supplier willing to do this — that's a
   business relationship you'd need to arrange directly, not something an app
   can manufacture out of nothing. If you later find one, the setup below
   still applies, you'd just swap "you fulfill" for "the supplier fulfills."

The rest of this guide assumes option 1.

## Step 1: Create the store (your action, needs billing)

1. Go to shopify.com and start a free trial, pick a plan (Basic is enough to
   start).
2. Choose your store name / domain (can be a `myshopify.com` subdomain at
   first, add your own domain later).
3. Set your store currency to INR and your address to Viman Nagar, Pune in
   Settings → General, so taxes/shipping defaults are right from day one.

## Step 2: Pick a theme

Don't commission a fully custom theme before the store is live and you know
you'll stick with Shopify — start with a free Online Store 2.0 theme and
reskin its colors:

- **Dawn** (Shopify's own default, free, fast, well-maintained) is the
  easiest starting point.
- In the theme editor, set the brand colors to the palette this project
  already uses: deep teal-green `#244539`, terracotta `#af5330`, antique gold
  `#c8983e`, warm parchment `#f6efdf`. Upload the same logo (`logo.webp` in
  `frontend/public/`) as the store logo.

If you later want this project's exact custom layout (the banner grid, category
icon strip, spotlight section) rebuilt as a real Shopify theme in Liquid, that's
a real coding project I can help with, but it needs a live store connected via
Shopify CLI to preview against, so it comes after Step 1, not before.

## Step 3: Make every product "always orderable" (the no-inventory setting)

For each product in Shopify Admin → Products:

1. Under **Inventory**, turn **"Track quantity"** OFF, or leave it on and turn
   **"Continue selling when out of stock"** ON.
   - Tracking off = simplest, the product is just always purchasable.
   - Tracking on + continue-selling = lets you still see a running count for
     your own planning, it just never blocks a sale at zero.
2. Add a short line to each product description like "Made fresh to order,
   ships in 2 to 3 days" so customers understand the timing, since you're not
   shipping from existing stock.

This is also where the earlier worry about "stock" resolves itself: with
tracking off, there's no stock to run out of. With tracking on, Shopify
already decrements it automatically on every paid order, no code needed.

## Step 4: Order notifications (built in, zero code)

Shopify emails you on every new order by default. To go beyond that:

1. Settings → Notifications → confirm your store owner email is correct;
   this is where the "New order" email template lives if you want to
   customize it.
2. For SMS or WhatsApp instead of just email, install a notification app from
   the Shopify App Store (search "order notifications SMS" or "WhatsApp
   order notifications") and connect your phone number.
3. If you want Slack alerts instead (useful if you're often on your phone),
   the official **Shopify Slack app** posts a message per new order.

None of this needs custom code; it's all toggles in Shopify's own admin.

## Step 5: Low-stock / restock alerts (only relevant if you keep tracking on)

Settings → Notifications has a low-stock threshold option per product
(under Inventory on the product page, set a "low stock" number); Shopify will
flag it in the admin. For an actual push alert, install a free app like
"Stock Alert" from the App Store.

## What to do with the current Next.js/Django app

Keep it running until the Shopify store is actually live and tested end to
end (a real test order, a real payment, a real notification arriving) — don't
cut over before you've confirmed that. Once Shopify is your real storefront:

- You can stop paying for whatever hosts `backend/` (Render/Railway) and the
  Cloudinary media storage, since Shopify hosts everything itself.
- The Next.js frontend (Vercel) can be decommissioned the same way.
- This repository and its design work aren't wasted: the palette, logo,
  category photos and copy all transfer directly into the Shopify theme
  editor in Step 2.

## What I can actually help with from here

- A real custom Shopify theme (Liquid) once you have a live store and share
  CLI/theme access.
- Reviewing your Shopify product descriptions/pricing/notification copy for
  consistency with the voice this project already established.
- Anything on the current Next.js/Django app in the meantime, if you want to
  keep it running in parallel or as a fallback.
