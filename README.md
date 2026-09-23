# Appu's Kerala Store

A full-stack e-commerce app for a Kerala grocery & fashion store in Viman Nagar, Pune.

- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **Backend:** Django 5 + Django REST Framework
- **Payments:** Razorpay (order creation, signature verification, webhook)
- **Auth:** JWT (SimpleJWT) issued by Django, stored as httpOnly cookies by Next.js

## How the two apps talk to each other (read this first)

The browser **never talks to Django directly**. Next.js acts as a secure
backend-for-frontend (BFF):

```
Browser  ──same-origin──>  Next.js server  ──server-to-server──>  Django API
 (cookies only,               (holds the JWT,                     (JWT in
  no JWT visible)              proxies requests)                   Authorization header)
```

- Public pages (home, category, product) are Server Components that fetch
  straight from Django using the server-only `DJANGO_API_URL` env var — this
  is why product pages render fully server-side for SEO.
- Login/Register hit `/api/auth/login` and `/api/auth/register` (Next.js
  Route Handlers), which call Django, then set the JWT `access_token` /
  `refresh_token` as **httpOnly, SameSite=Lax** cookies. Client-side
  JavaScript can never read these tokens (defends against XSS token theft),
  and `SameSite=Lax` blocks cross-site form submissions from using them
  (defends against CSRF).
- Every authenticated client action (cart, checkout, seller dashboard) calls
  `/api/proxy/<path>`, a catch-all Route Handler that reads the cookie,
  attaches `Authorization: Bearer <token>` server-side, forwards the request
  to Django, and transparently refreshes an expired access token using the
  refresh token — the browser only ever sees its own cookies.

Because of this, **CORS is not actually load-bearing** for browser traffic
(server-to-server calls aren't subject to CORS) — it's configured on Django
anyway for flexibility, but it's not something you need to fight with.

## Project layout

```
StoreAppu/
├── backend/     Django project (accounts, catalog, cart, orders, payments apps)
└── frontend/    Next.js app (src/app, src/components, src/lib)
```

---

## 1. Local setup

### 1.1 Backend (Django)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env              # defaults work out of the box (SQLite, DEBUG=True)

python manage.py migrate
python manage.py seed_store       # creates demo categories, products, and a seller account
python manage.py createsuperuser  # your own admin login
python manage.py runserver 0.0.0.0:8000
```

Django is now running at `http://127.0.0.1:8000`. Check it with:
`curl http://127.0.0.1:8000/api/catalog/categories/`

The seed command creates a demo seller: `appu@keralastore.test` / password
`ChangeMe123!` (already has `is_seller=True`, so you can log in as this user
on the frontend and use `/seller`).

### 1.2 Frontend (Next.js)

In a second terminal:

```bash
cd frontend
npm install
cp .env.local.example .env.local  # points DJANGO_API_URL at your local Django
npm run dev
```

Visit `http://localhost:3000`. That's the whole connection — as long as
`DJANGO_API_URL=http://127.0.0.1:8000` in `frontend/.env.local` matches where
Django is running, the two are wired up.

### 1.3 Making a user a seller

Sellers add/manage products. There's no public "become a seller" signup (by
design — this is a single-store app) — grant it from Django admin:

1. Go to `http://127.0.0.1:8000/admin`, log in with your superuser.
2. Open **Accounts → Users**, pick the user, tick **is_seller**, save.
3. That user can now visit `/seller` on the frontend to add products and
   manage stock.

### 1.4 Setting up Razorpay (test mode)

1. Create a free account at Razorpay and switch to **Test Mode**.
2. Go to **Settings → API Keys → Generate Test Key**. Copy the Key ID and
   Key Secret into `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```
3. (Optional but recommended) Go to **Settings → Webhooks**, add a webhook
   pointing at `https://<your-backend-domain>/api/payments/webhook/` for the
   `payment.captured` event, and copy the webhook secret into
   `RAZORPAY_WEBHOOK_SECRET`. This is the authoritative fallback that
   confirms payment and decrements stock even if the customer closes the
   browser tab right after paying.
4. Restart Django. Test payments with Razorpay's test card `4111 1111 1111
   1111`, any future expiry, any CVV, and any OTP screen that appears (test
   mode auto-approves).

### 1.5 How a payment actually completes (for your understanding)

1. Customer clicks **Pay** on `/checkout` → frontend calls
   `POST /api/orders/checkout/` → Django snapshots the cart into an `Order`
   (status `pending`), address included.
2. Frontend calls `POST /api/payments/create-order/` → Django creates a
   matching order on Razorpay's side and returns the Razorpay order id.
3. Frontend opens the Razorpay Checkout popup with that order id.
4. On success, Razorpay hands the frontend a payment id + signature. The
   frontend calls `POST /api/payments/verify/`, which:
   - Recomputes the HMAC-SHA256 signature with your `RAZORPAY_KEY_SECRET`
     and rejects the payment if it doesn't match (this is what stops someone
     from faking a "successful payment" call from devtools).
   - Row-locks the ordered products (`select_for_update`) and decrements
     stock — this is done inside one DB transaction so two customers can
     never both succeed buying the last unit.
   - Marks the order `paid` and empties the cart.
5. The Razorpay webhook (`/api/payments/webhook/`) calls the same
   stock-decrement logic idempotently, so even if step 4 never reaches your
   server (tab closed, network drop), the order still gets marked paid once
   Razorpay confirms it server-side.

---

## 2. Deploying (kept minimal — everything below has a free tier)

| Piece | Where | Why |
|---|---|---|
| Frontend | **Vercel** | Built for Next.js, zero-config |
| Backend | **Render** (or Railway) | Free/cheap always-on Django + Postgres |
| Database | Render/Railway's managed **Postgres**, or **Neon** | Managed, free tier |
| Product images | **Cloudinary** | Render/Railway's filesystem is wiped on every deploy — Cloudinary keeps uploaded images permanently |

### 2.1 Deploy the backend to Render

1. Push this repo to GitHub.
2. On Render: **New → Web Service**, connect the repo, set **Root Directory**
   to `backend`.
3. Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   Start command: `python manage.py migrate && gunicorn config.wsgi:application`
4. Add a **Postgres** instance on Render (New → PostgreSQL) and copy its
   **Internal Database URL**.
5. Set these environment variables on the web service:
   ```
   DJANGO_SECRET_KEY=<generate a long random string>
   DEBUG=False
   ALLOWED_HOSTS=<your-backend>.onrender.com
   DATABASE_URL=<the Postgres Internal Database URL>
   CORS_ALLOWED_ORIGINS=https://<your-frontend>.vercel.app
   CSRF_TRUSTED_ORIGINS=https://<your-frontend>.vercel.app
   SECURE_SSL_REDIRECT=True
   COOKIE_SECURE=True
   RAZORPAY_KEY_ID=...
   RAZORPAY_KEY_SECRET=...
   RAZORPAY_WEBHOOK_SECRET=...
   CLOUDINARY_URL=<from your Cloudinary dashboard>
   ```
6. Deploy. Then run once, from Render's shell tab: `python manage.py createsuperuser`
   and `python manage.py seed_store` (optional demo data).

### 2.2 Deploy the frontend to Vercel

1. On Vercel: **New Project**, import the repo, set **Root Directory** to
   `frontend`.
2. Set environment variables:
   ```
   DJANGO_API_URL=https://<your-backend>.onrender.com
   NEXT_PUBLIC_SITE_URL=https://<your-frontend>.vercel.app
   ```
3. Deploy. Vercel auto-detects Next.js — no build command changes needed.
4. Go back to Render and double check `CORS_ALLOWED_ORIGINS` /
   `CSRF_TRUSTED_ORIGINS` match your real Vercel URL (including `https://`).

### 2.3 Cloudinary for product images

1. Sign up at cloudinary.com (free tier), copy the **API Environment
   variable** shown on your dashboard — it looks like
   `cloudinary://<key>:<secret>@<cloud_name>`.
2. Paste it into Render's `CLOUDINARY_URL` env var. That's it — Django
   automatically switches product image uploads to Cloudinary storage when
   this variable is set (see `backend/config/settings.py`).

### 2.4 Point the Razorpay webhook at production

Update the webhook URL in the Razorpay dashboard to
`https://<your-backend>.onrender.com/api/payments/webhook/`, and switch your
API keys from Test to Live mode when you're ready to accept real payments.

---

## 3. Environment variable reference

**`backend/.env`** (see `backend/.env.example`): `DJANGO_SECRET_KEY`,
`DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`,
`CSRF_TRUSTED_ORIGINS`, `SECURE_SSL_REDIRECT`, `COOKIE_SECURE`,
`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`,
`CLOUDINARY_URL`.

**`frontend/.env.local`** (see `frontend/.env.local.example`):
`DJANGO_API_URL` (server-only — never exposed to the browser),
`NEXT_PUBLIC_SITE_URL` (used for canonical URLs / sitemap / Open Graph).

## 4. Security notes

- JWTs live only in httpOnly cookies; browser JS never touches them.
- Passwords go through Django's password validators (min length, common
  password check, similarity check) before hashing (PBKDF2, Django default).
- Razorpay payments are verified server-side via HMAC signature — the
  frontend's "success" callback is never trusted on its own.
- Stock decrements happen inside a locked DB transaction to prevent
  overselling under concurrent checkouts.
- DRF throttling (60 req/min anonymous, 240/min authenticated) is on by
  default to slow down brute-force/spam attempts.
- `/cart`, `/checkout`, `/orders`, `/seller` are gated both optimistically
  (Next.js `proxy.ts`, i.e. middleware) and authoritatively (Django
  permission classes on every endpoint) — the frontend check is just for UX,
  the backend check is what actually protects the data.
