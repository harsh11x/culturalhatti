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
      <section className="relative w-full min-h-[100vh] overflow-hidden">
        {/* Main Heritage Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/home.jpg" 
            alt="Traditional Indian heritage architecture"
            className="w-full h-full object-cover object-center"
          />
          {/* Elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full min-h-[100vh] flex flex-col justify-end p-6 sm:p-10 md:p-16 lg:p-20">
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
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-background-dark">Explore Our Heritage</h2>
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

      {/* Cultural Statement Section - Luxury Heritage */}
      <section className="relative w-full py-20 md:py-32 overflow-hidden bg-background-dark">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="heritage-pattern w-full h-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="text-center">
            <span className="inline-block px-5 py-2.5 bg-primary/20 text-primary text-xs font-body font-semibold tracking-[0.3em] border border-primary/30 uppercase mb-8">
              विरासत • Heritage
            </span>
            
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-white">
              Crafted by <span className="text-primary italic">Hands</span>,<br />
              Woven with <span className="text-primary italic">Soul</span>
            </h2>
            
            <p className="font-body text-base sm:text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-16 font-light">
              Every thread carries centuries of tradition. Every pattern echoes ancient wisdom. We celebrate India's master artisans and their timeless craft.
            </p>

            <div className="flex flex-wrap justify-center gap-12 sm:gap-16 md:gap-20 mt-16 pt-12 border-t border-white/10">
              <div className="text-center">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-3">28</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/60 font-light">Indian States</p>
              </div>
              <div className="text-center">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-primary mb-3">100%</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/60 font-light">Authentic</p>
              </div>
              <div className="text-center">
                <p className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-3">∞</p>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-white/60 font-light">Timeless</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid - Luxury */}
      <section className="w-full py-16 md:py-24 bg-background-light">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary mb-3 font-medium">संग्रह • Collection</p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-background-dark">Curated<br />Masterpieces</h2>
            </div>
            <Link href="/collections" className="hidden md:inline-block font-body text-sm font-semibold uppercase tracking-[0.2em] text-secondary hover:text-primary transition-colors border-b border-secondary hover:border-primary pb-1">
              View All Treasures
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center font-body tracking-widest uppercase text-sm">Loading Products...</div>
          ) : featured.length === 0 ? (
            <div className="py-16 text-center font-body tracking-widest uppercase text-sm">No products featured.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {featured.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block bg-white luxury-shadow hover:luxury-shadow-hover transition-all overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
                    {p.images?.[0] ? (
                      <img src={`http://localhost:3001${p.images[0]}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {p.compare_price && (
                      <div className="absolute top-3 right-3 bg-terracotta text-white text-[9px] sm:text-xs font-body font-semibold px-3 py-1.5 uppercase tracking-wider">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <p className="font-body font-medium uppercase tracking-[0.2em] text-[9px] sm:text-xs text-secondary/70 mb-2">{p.category?.name || 'Uncategorized'}</p>
                    <h3 className="font-body font-semibold text-sm sm:text-base leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">{p.name}</h3>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-display text-lg sm:text-xl md:text-2xl font-bold text-background-dark">₹{Number(p.price).toFixed(0)}</span>
                      {p.compare_price && (
                        <span className="text-gray-400 line-through text-xs sm:text-sm font-body">₹{Number(p.compare_price).toFixed(0)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-10 md:mt-14 text-center">
            <Link href="/collections" className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-background-dark font-body font-semibold uppercase tracking-[0.2em] text-sm hover:bg-accent transition-all group luxury-shadow">
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
