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
      {/* Hero Section - Full Width Heritage Architecture */}
      <section className="relative w-full min-h-[70vh] md:min-h-[85vh] border-b-3 border-black overflow-hidden">
        {/* Main Heritage Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1609783261796-f972a39b57d5?w=2000&q=90" 
            alt="Traditional Indian architecture with cultural heritage"
            className="w-full h-full object-cover"
          />
          {/* Warm overlay for authentic feel */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full min-h-[70vh] md:min-h-[85vh] flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Top Badge */}
          <div className="absolute top-8 left-6 sm:left-8 md:left-12">
            <span className="inline-block px-4 py-2 bg-primary text-white text-xs font-bold tracking-widest border-2 border-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              हस्तशिल्प • Handcrafted Heritage
            </span>
          </div>

          {/* Main Headline - Bottom Left */}
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-6 text-white drop-shadow-2xl">
              Where<br />
              <span className="text-primary">Tradition</span><br />
              Meets Art
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-bold text-white/90 max-w-2xl mb-8 leading-relaxed drop-shadow-lg">
              Celebrating India's rich cultural tapestry through authentic handcrafted textiles, artisan jewelry, and timeless craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/collections" className="px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase border-2 border-black brutalist-shadow hover:bg-primary hover:text-white hover:border-primary transition-all inline-flex items-center justify-center gap-2 group">
                <span className="text-xs font-bold uppercase tracking-widest">Explore Collection</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/collections" className="px-8 py-4 bg-black/80 backdrop-blur-sm text-white text-sm font-bold tracking-widest uppercase border-2 border-white hover:bg-primary hover:border-primary transition-all inline-flex items-center justify-center">
                <span className="text-xs">Artisan Stories</span>
              </Link>
            </div>

            {/* Cultural Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 mt-8">
              <div className="text-white">
                <p className="text-3xl sm:text-4xl font-black text-primary drop-shadow-lg">5000+</p>
                <p className="text-xs uppercase tracking-widest text-white/80">Years Heritage</p>
              </div>
              <div className="text-white border-l-2 border-white/30 pl-6 sm:pl-8">
                <p className="text-3xl sm:text-4xl font-black text-primary drop-shadow-lg">100+</p>
                <p className="text-xs uppercase tracking-widest text-white/80">Master Artisans</p>
              </div>
              <div className="text-white border-l-2 border-white/30 pl-6 sm:pl-8">
                <p className="text-2xl sm:text-3xl font-black drop-shadow-lg">भारत</p>
                <p className="text-xs uppercase tracking-widest text-white/80">Made in India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="bg-primary text-white border-b-3 border-black overflow-hidden py-3 whitespace-nowrap relative">
        <div className="animate-marquee inline-block">
          {Array(4).fill(0).map((_, i) => (
            <span key={i}>
              <span className="text-lg font-bold tracking-widest mx-4">मुफ़्त शिपिंग • FREE SHIPPING PAN INDIA •</span>
              <span className="text-lg font-bold tracking-widest mx-4">हस्तनिर्मित • HANDCRAFTED BY ARTISANS •</span>
              <span className="text-lg font-bold tracking-widest mx-4">प्रामाणिक • AUTHENTIC HERITAGE •</span>
              <span className="text-lg font-bold tracking-widest mx-4">CULTURAL HATTI •</span>
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

      {/* Featured Categories - Heritage Architecture Style */}
      <section className="w-full relative border-b-3 border-black">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-3 md:divide-y-0 md:divide-x-3 divide-black">
          {loading ? (
            <div className="p-8 text-center col-span-3 font-bold uppercase tracking-widest bg-background-light">Loading Collections...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center col-span-3 font-bold uppercase tracking-widest bg-background-light">No Collections Found</div>
          ) : (
            categories.slice(0, 3).map((cat, index) => {
              const fallbackImages = [
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=90",
                "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=90",
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=90"
              ];
              const imgSrc = cat.image_url ? `http://localhost:3001${cat.image_url}` : fallbackImages[index % fallbackImages.length];

              return (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="relative group h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden cursor-pointer block">
                  <img alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" src={imgSrc} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all z-10"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
                    <div className="bg-white/90 backdrop-blur-md border-3 border-black px-6 py-4 inline-block transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(255,153,51,1)]">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Cultural Statement Section - Warm Heritage */}
      <section className="w-full text-white border-b-3 border-black py-16 md:py-24 relative overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=90")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Warm earthy overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-black/60 to-black/80 z-0"></div>
        
        <div className="max-w-5xl mx-auto text-center px-6 sm:px-8 relative z-10">
          <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4 inline-block px-4 py-2 bg-black/70 border-2 border-primary shadow-[4px_4px_0px_0px_rgba(255,153,51,1)]">विरासत • Heritage</p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6">
            <span style={{ color: '#FF9933' }}>Crafted</span> by <span style={{ color: '#138808' }}>Hands</span>,<br />
            <span style={{ color: '#FF9933' }}>Woven</span> with <span style={{ color: '#138808' }}>Soul</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            Every thread carries centuries of tradition. Every pattern echoes ancient wisdom. 
            We celebrate India's master artisans and their timeless craft.
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 mt-12">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-primary mb-2 drop-shadow-lg">28</p>
              <p className="text-xs uppercase tracking-widest text-white/80">Indian States</p>
            </div>
            <div className="text-center border-l-2 border-white/30 pl-6 sm:pl-8 md:pl-12">
              <p className="text-4xl sm:text-5xl font-black text-primary mb-2 drop-shadow-lg">100%</p>
              <p className="text-xs uppercase tracking-widest text-white/80">Authentic</p>
            </div>
            <div className="text-center border-l-2 border-white/30 pl-6 sm:pl-8 md:pl-12">
              <p className="text-4xl sm:text-5xl font-black text-primary mb-2 drop-shadow-lg">∞</p>
              <p className="text-xs uppercase tracking-widest text-white/80">Timeless</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid - Warm Heritage Background */}
      <section className="w-full p-6 sm:p-8 md:p-12 lg:p-16 relative" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=90")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Warm overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/95 via-background-light/90 to-orange-50/95 z-0"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-8 sm:mb-10 md:mb-12">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest text-xs mb-3 inline-block px-4 py-2 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">संग्रह • Collection</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight text-black mt-3">Curated<br />Masterpieces</h2>
            </div>
            <Link href="/collections" className="hidden md:inline-block border-b-3 border-black font-bold uppercase tracking-widest text-sm hover:text-primary hover:border-primary transition-colors pb-1">
              View All Treasures
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center font-bold tracking-widest uppercase text-sm">Loading Products...</div>
          ) : featured.length === 0 ? (
            <div className="py-16 text-center font-bold tracking-widest uppercase text-sm">No products featured.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {featured.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group block border-2 sm:border-3 border-black p-3 sm:p-4 brutalist-shadow hover:brutalist-shadow-hover bg-white transition-all">
                  <div className="aspect-[3/4] overflow-hidden border-2 border-black mb-3 relative bg-gray-100">
                    {p.images?.[0] ? (
                      <img src={`http://localhost:3001${p.images[0]}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    {p.compare_price && (
                      <div className="absolute top-1 right-1 bg-primary text-white text-[9px] sm:text-xs font-bold px-1.5 py-0.5 border border-black uppercase">
                        Sale
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-widest text-[9px] sm:text-xs text-gray-500">{p.category?.name || 'Uncategorized'}</p>
                    <h3 className="font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-black text-base sm:text-lg md:text-xl">₹{Number(p.price).toFixed(0)}</span>
                      {p.compare_price && (
                        <span className="text-gray-400 line-through text-xs sm:text-sm font-bold">₹{Number(p.compare_price).toFixed(0)}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 sm:mt-10 md:mt-12 text-center md:hidden">
            <Link href="/collections" className="inline-block border-b-2 border-black font-bold uppercase tracking-widest text-xs sm:text-sm hover:text-primary hover:border-primary transition-colors pb-1">
              View All Arrivals
            </Link>
          </div>
        </div>
      </section>

    </>
  );
}
