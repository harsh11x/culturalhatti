'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { ArrowRight, ImageIcon } from 'lucide-react';

interface Product {
  id: string; name: string; slug: string; price: number; compare_price?: number;
  images: string[]; category?: { name: string };
}
interface Category {
  id: string; name: string; slug: string; image_url?: string;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true&limit=8'),
      api.get('/categories'),
    ]).then(([pRes, cRes]) => {
      setFeatured(pRes.data.rows || []);
      setCategories(cRes.data.categories || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero Section - Luxury Royal Heritage */}
      <section className="relative w-full min-h-[85vh]  overflow-hidden">
        {/* Main Heritage Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/home.jpg" 
            alt="Traditional Indian heritage architecture"
            className="w-full h-full object-cover object-[center_40%] md:object-center"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full min-h-[85vh] md:min-h-[90vh] flex flex-col justify-end p-6 sm:p-10 md:p-16 lg:p-20">
          {/* Top Badge - Elegant */}
          <div className="absolute top-8 sm:top-12 left-6 sm:left-10 md:left-16">
            <span className="inline-block px-5 py-2.5 bg-primary/90 backdrop-blur-sm text-background-dark text-xs font-semibold tracking-[0.3em] border border-primary uppercase">
              हस्तशिल्प • Handcrafted Heritage
            </span>
          </div>

          {/* Main Headline - Luxury Typography */}
          <div className="max-w-5xl">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] mb-6 text-white">
              Where<br />
              <span className="text-primary italic">Tradition</span><br />
              Meets Art
            </h1>
            <p className="font-body text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-10 leading-relaxed font-light">
              Celebrating India's rich cultural tapestry through authentic handcrafted textiles, artisan jewelry, and timeless craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/collections" className="px-10 py-4 bg-primary text-background-dark text-sm font-body font-semibold tracking-[0.2em] uppercase hover:bg-accent transition-all inline-flex items-center justify-center gap-3 group luxury-shadow">
                <span>Explore Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/collections" className="px-10 py-4 bg-transparent backdrop-blur-sm text-white text-sm font-body font-semibold tracking-[0.2em] uppercase border border-white/50 hover:bg-white/10 hover:border-white transition-all inline-flex items-center justify-center">
                <span>Our Artisans</span>
              </Link>
            </div>

            {/* Cultural Stats - Elegant */}
            <div className="flex flex-wrap gap-8 sm:gap-12 mt-12 pt-8 border-t border-white/20">
              <div className="text-white">
                <p className="font-display text-4xl sm:text-5xl font-bold text-primary mb-1">5000+</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70 font-light">Years of Heritage</p>
              </div>
              <div className="text-white">
                <p className="font-display text-4xl sm:text-5xl font-bold text-primary mb-1">100+</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70 font-light">Master Artisans</p>
              </div>
              <div className="text-white">
                <p className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">भारत</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70 font-light">Made in India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner - Luxury */}
      <div className="bg-background-dark text-white overflow-hidden py-4 whitespace-nowrap relative">
        <div className="animate-marquee inline-block">
          {Array(4).fill(0).map((_, i) => (
            <span key={i}>
              <span className="font-body text-sm font-medium tracking-[0.3em] mx-6">मुफ़्त शिपिंग • FREE SHIPPING PAN INDIA •</span>
              <span className="font-body text-sm font-medium tracking-[0.3em] mx-6">हस्तनिर्मित • HANDCRAFTED BY ARTISANS •</span>
              <span className="font-body text-sm font-medium tracking-[0.3em] mx-6">प्रामाणिक • AUTHENTIC HERITAGE •</span>
              <span className="font-body text-sm font-medium tracking-[0.3em] mx-6 text-primary">CULTURAL HATTI •</span>
            </span>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
          }
          .animate-marquee {
              display: inline-block;
              animation: marquee 25s linear infinite;
              white-space: nowrap;
          }
        `}} />
      </div>

      {/* Featured Categories - Luxury Grid */}
      <section className="w-full bg-background-light py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary mb-3 font-medium">संग्रह • Collections</p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-background-dark mb-8">Explore Our Heritage</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/collections" className="inline-flex items-center gap-3 px-8 py-3 bg-primary text-background-dark font-body font-semibold uppercase tracking-[0.2em] text-sm hover:bg-accent transition-all group luxury-shadow">
                <span>View All Products</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/collections" className="inline-flex items-center gap-3 px-8 py-3 bg-transparent text-background-dark font-body font-semibold uppercase tracking-[0.2em] text-sm border-2 border-background-dark hover:bg-background-dark hover:text-white transition-all">
                <span>View All Treasures</span>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center font-body uppercase tracking-widest text-sm">Loading Collections...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center font-body uppercase tracking-widest text-sm">No Collections Found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {categories.slice(0, 3).map((cat, index) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90",
                  "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=90",
                  "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=90"
                ];
                const imgSrc = cat.image_url ? `http://localhost:3001${cat.image_url}` : fallbackImages[index % fallbackImages.length];

                return (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="relative group h-[450px] sm:h-[500px] overflow-hidden cursor-pointer block luxury-shadow hover:luxury-shadow-hover transition-all duration-500">
                    <img alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out" src={imgSrc} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/30 to-transparent group-hover:from-background-dark/80 transition-all z-10"></div>
                    
                    <div className="absolute inset-0 flex items-end p-6 sm:p-8 z-20">
                      <div>
                        <div className="w-12 h-0.5 bg-primary mb-4"></div>
                        <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                        <p className="font-body text-xs uppercase tracking-[0.2em] text-white/70">Explore Collection</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Cultural Statement Section - Enhanced Heritage */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, #8B6F47 0%, #C9A86A 50%, #D4AF37 100%)'
      }}>
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="heritage-pattern w-full h-full"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white/20 rotate-45"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-white/20 rotate-12"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="text-center">
            <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm text-white text-xs font-body font-semibold tracking-[0.3em] border border-white/30 uppercase mb-8">
              विरासत • Heritage
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white drop-shadow-lg">
              Crafted by <span className="italic">Hands</span>,<br />
              Woven with <span className="italic">Soul</span>
            </h2>
            
            <p className="font-body text-lg sm:text-xl md:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto mb-16 font-light drop-shadow">
              Every thread carries centuries of tradition. Every pattern echoes ancient wisdom. We celebrate India's master artisans and their timeless craft.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 mt-16 pt-12 border-t border-white/30 max-w-4xl mx-auto">
              <div className="text-center bg-white/10 backdrop-blur-sm p-8 luxury-shadow">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 drop-shadow-lg">29</p>
                <p className="font-body text-sm uppercase tracking-[0.2em] text-white/90 font-medium">Indian States</p>
                <p className="font-body text-xs text-white/70 mt-2">Pan-India Reach</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm p-8 luxury-shadow">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 drop-shadow-lg">100%</p>
                <p className="font-body text-sm uppercase tracking-[0.2em] text-white/90 font-medium">Authentic</p>
                <p className="font-body text-xs text-white/70 mt-2">Verified Craftsmanship</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm p-8 luxury-shadow">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3 drop-shadow-lg">5000+</p>
                <p className="font-body text-sm uppercase tracking-[0.2em] text-white/90 font-medium">Years</p>
                <p className="font-body text-xs text-white/70 mt-2">Heritage & Tradition</p>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}
