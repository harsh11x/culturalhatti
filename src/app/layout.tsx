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
        <footer className="w-full mx-auto border-t-3 border-black bg-black text-background-light p-8 md:p-16 mt-auto">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-6">Join the Cult.<br />Get 10% Off.</h2>
              <div className="flex w-full">
                <input className="bg-transparent border-2 border-background-light text-background-light px-6 py-4 w-full focus:ring-0 focus:border-primary placeholder-gray-500 font-bold uppercase transition-colors" placeholder="EMAIL ADDRESS" type="email" />
                <button className="bg-background-light text-black px-8 py-4 font-black uppercase border-2 border-background-light hover:bg-primary hover:text-white hover:border-primary transition-colors whitespace-nowrap">
                  Sign Up
                </button>
              </div>
            </div>
            <div className="text-left md:text-right flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8 justify-end">
                <div className="flex flex-col gap-2">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Shop</h4>
                  <a href="/category/sarees" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Sarees</a>
                  <a href="/category/women-suits" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Suits</a>
                  <a href="/category/women-bags" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Bags</a>
                  <a href="/category/accessories" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Accessories</a>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Help</h4>
                  <a href="#" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Contact Us</a>
                  <a href="#" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Track Order</a>
                  <a href="/policies/returns" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Returns</a>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Legal</h4>
                  <a href="/policies/privacy" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Privacy Policy</a>
                  <a href="/policies/terms" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Terms & Conditions</a>
                  <a href="/policies/shipping" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Shipping Policy</a>
                  <a href="/policies/returns" className="text-sm font-bold tracking-widest hover:text-primary transition-colors uppercase">Return Policy</a>
                </div>
              </div>
              <div className="flex gap-4 justify-start md:justify-end mt-4">
                <a className="w-10 h-10 border border-background-light flex items-center justify-center hover:bg-background-light hover:text-black transition-colors" href="#">IG</a>
                <a className="w-10 h-10 border border-background-light flex items-center justify-center hover:bg-background-light hover:text-black transition-colors" href="#">FB</a>
                <a className="w-10 h-10 border border-background-light flex items-center justify-center hover:bg-background-light hover:text-black transition-colors" href="#">PT</a>
              </div>
              <div>
                <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Free shipping PAN INDIA</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">© 2026 Cultural Hatti. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
