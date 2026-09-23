export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t-4 border-kerala-yellow bg-kerala-green-dark text-kerala-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold text-kerala-yellow">Appu&apos;s Kerala Store</h3>
          <p className="mt-2 text-sm text-kerala-cream/80">
            From coconut oil and banana chips to kasavu mundu — a taste of Kerala,
            delivered across Viman Nagar, Pune.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-kerala-yellow">Visit us</h4>
          <address className="mt-2 not-italic text-sm text-kerala-cream/80 leading-relaxed">
            Viman Nagar, Pune, Maharashtra
            <br />
            Open daily · 9:00 AM – 9:00 PM
          </address>
        </div>
        <div>
          <h4 className="font-semibold text-kerala-yellow">Delivery</h4>
          <p className="mt-2 text-sm text-kerala-cream/80">
            Fresh groceries and Kerala specials delivered to your doorstep. Secure
            checkout powered by Razorpay.
          </p>
        </div>
      </div>
      <div className="border-t border-kerala-cream/10 py-4 text-center text-xs text-kerala-cream/60">
        © {new Date().getFullYear()} Appu&apos;s Kerala Store. All rights reserved.
      </div>
    </footer>
  );
}
