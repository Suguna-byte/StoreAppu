import KeralaFlourish from "./KeralaFlourish";

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-kerala-yellow bg-kerala-green-dark text-kerala-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <h3 className="font-display text-xl font-semibold italic text-kerala-yellow">Appu&apos;s Kerala Store</h3>
          <KeralaFlourish className="mt-2 h-2.5 w-16" />
          <p className="mt-3 text-sm leading-relaxed text-kerala-cream/75">
            From coconut oil and banana chips to kasavu mundu, a taste of Kerala,
            delivered across Viman Nagar, Pune.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-kerala-yellow/90">Visit us</h4>
          <address className="mt-3 not-italic text-sm leading-relaxed text-kerala-cream/75">
            Viman Nagar, Pune, Maharashtra
            <br />
            Open daily, 9:00 AM to 9:00 PM
          </address>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-kerala-yellow/90">Delivery</h4>
          <p className="mt-3 text-sm leading-relaxed text-kerala-cream/75">
            Fresh groceries and Kerala specials delivered to your doorstep. Secure
            checkout powered by Razorpay.
          </p>
        </div>
      </div>
      <div className="border-t border-kerala-cream/10 py-4 text-center text-xs text-kerala-cream/50">
        &copy; {new Date().getFullYear()} Appu&apos;s Kerala Store. All rights reserved.
      </div>
    </footer>
  );
}
