import type { Metadata } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import CartSidebar from '@/components/CartSidebar';

export const metadata: Metadata = {
  title: 'Cultural Hatti – Authentic Indian Crafts & Culture',
  description: 'Discover authentic Indian crafts, textiles, and cultural artifacts. Mobile-first brutalist Indian e-commerce.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <body className="bg-background-light text-black font-display overflow-x-hidden min-h-screen flex flex-col">
        <Navbar />
        <AuthModal />
        <CartSidebar />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <footer className="w-full mx-auto bg-background-dark text-white p-10 md:p-20 mt-auto">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 mb-12">
              <div className="lg:col-span-5">
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4">Join Our Heritage</h2>
                <p className="font-body text-sm text-white/70 mb-6 font-light">Subscribe to receive exclusive updates and 10% off your first order.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input className="bg-white/10 border border-white/20 text-white px-5 py-3 flex-1 focus:ring-0 focus:border-primary placeholder-white/50 font-body text-sm transition-colors" placeholder="Email Address" type="email" />
                  <button className="bg-primary text-background-dark px-8 py-3 font-body font-semibold uppercase tracking-[0.15em] hover:bg-accent transition-colors whitespace-nowrap text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="flex flex-col gap-3">
                    <h4 className="text-primary font-body font-semibold uppercase tracking-[0.2em] text-xs mb-2">Shop</h4>
                    <a href="/category/sarees" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Sarees</a>
                    <a href="/category/women-suits" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Suits</a>
                    <a href="/category/women-bags" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Bags</a>
                    <a href="/category/accessories" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Accessories</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-primary font-body font-semibold uppercase tracking-[0.2em] text-xs mb-2">Help</h4>
                    <a href="#" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Contact Us</a>
                    <a href="#" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Track Order</a>
                    <a href="/policies/returns" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Returns</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-primary font-body font-semibold uppercase tracking-[0.2em] text-xs mb-2">Legal</h4>
                    <a href="/policies/privacy" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="/policies/terms" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Terms & Conditions</a>
                    <a href="/policies/shipping" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Shipping Policy</a>
                    <a href="/policies/returns" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Return Policy</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-5">
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href="#">IG</a>
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href="#">FB</a>
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href="#">PT</a>
              </div>
              <div className="text-center md:text-right">
                <p className="text-primary font-body font-medium uppercase tracking-[0.2em] text-xs mb-2">Free Shipping Above ₹999</p>
                <p className="font-body text-xs text-white/50">© 2026 Cultural Hatti. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
