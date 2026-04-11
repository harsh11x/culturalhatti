import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import AuthModal from '@/components/AuthModal';
import CartSidebar from '@/components/CartSidebar';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { INSTAGRAM_URL, SITE_NAME, SITE_URL } from '@/lib/site';

const defaultDescription =
  'Shop authentic Indian fashion in Amritsar: designer sarees, women’s suits, handbags & purses, clutches, jewelry & accessories. Handcrafted tradition, PAN India delivery — Cultural Hatti.';

const seoKeywords = [
  'Indian traditional clothing',
  'women ethnic wear India',
  'buy sarees online India',
  'designer sarees',
  'Indian suits for women',
  'salwar suits',
  'handbags India',
  'ladies purses online',
  'clutch bags India',
  'Indian jewelry accessories',
  'handcrafted textiles',
  'Amritsar ethnic wear store',
  'Cultural Hatti',
  'Indian heritage fashion',
  'wedding sarees',
  'party wear suits',
  'potli bags',
  'traditional Indian bags',
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Sarees, Suits, Bags & Indian Heritage Fashion | Amritsar`,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: seoKeywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Indian Sarees, Women’s Suits, Handbags & Tradition`,
    description: defaultDescription,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: `${SITE_NAME} logo` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — Indian Ethnic Wear & Accessories`,
    description: defaultDescription,
    images: ['/logo.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
  },
  category: 'shopping',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2C2416',
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: defaultDescription,
  sameAs: [INSTAGRAM_URL],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: defaultDescription,
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className="light">
      <body className="bg-background-light text-black font-display overflow-x-hidden min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navbar />
        <AuthModal />
        <CartSidebar />
        <div className="flex-grow flex flex-col">
          {children}
        </div>
        <Analytics />
        <SpeedInsights />
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
                    <a href="/category/suits" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Suits</a>
                    <a href="/category/bags" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Bags</a>
                    <a href="/category/accessories" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Accessories</a>
                    <a href="/category/kids" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Kids</a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h4 className="text-primary font-body font-semibold uppercase tracking-[0.2em] text-xs mb-2">Help</h4>
                    <a href="/contact" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Contact Us</a>
                    <a href="/track-order" className="font-body text-sm text-white/80 hover:text-primary transition-colors">Track Order</a>
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
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" title="Instagram @culturalhattiamritsar">IG</a>
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href="#">FB</a>
                <a className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all font-body text-xs font-semibold" href="#">PT</a>
              </div>
              <div className="text-center md:text-right">
                <p className="text-primary font-body font-medium uppercase tracking-[0.2em] text-xs mb-2">Free Shipping — PAN India</p>
                <p className="font-body text-xs text-white/50">© 2026 Cultural Hatti. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
