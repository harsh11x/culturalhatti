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
      {/* Hero Section */}
      <section className="flex-grow flex flex-col relative w-full border-b-3 border-black">
        {/* Background Pattern Layer with Indian texture */}
        <div className="absolute inset-0 z-0 stepwell-pattern pointer-events-none opacity-30"></div>
        <div className="relative z-10 w-full flex flex-col md:flex-row">
          {/* Left Content: Typography Heavy with Indian texture background */}
          <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-between border-b-3 md:border-b-0 md:border-r-3 border-black relative overflow-hidden" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-background-light/75 z-0"></div>
            
            {/* Subtle Indian pattern overlay */}
            <div className="absolute inset-0 z-0 opacity-5" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,153,51,0.3) 10px, rgba(255,153,51,0.3) 20px)',
            }}></div>
            
            <div className="mb-6 relative z-10">
              <span className="inline-block px-3 py-1.5 bg-primary text-white text-[10px] sm:text-xs font-bold tracking-widest mb-4 border-2 border-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                हस्तशिल्प • Handcrafted Heritage
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tighter uppercase mb-4 text-black">
                Where<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-600 to-red-600 outline-text" style={{ WebkitTextStroke: '1.5px black' }}>Tradition</span><br />
                Meets Art
              </h2>
              <p className="text-base md:text-lg font-medium max-w-md leading-relaxed border-l-4 border-primary pl-4 mb-3 bg-white/60 py-2">
                Celebrating India's rich cultural tapestry through authentic handcrafted textiles, artisan jewelry, and timeless craftsmanship.
              </p>
              <p className="text-xs md:text-sm font-medium max-w-md leading-relaxed text-gray-800 pl-4 mb-6">
                Each piece tells a story of skilled artisans, ancient techniques, and the vibrant soul of Bharat.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link href="/collections" className="px-6 py-3 bg-black text-white text-sm font-bold tracking-widest uppercase border-2 border-black brutalist-shadow hover:brutalist-shadow-hover transition-all flex items-center justify-center gap-2 group">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest group-hover:mr-2 transition-all">Discover Collection</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/collections" className="px-6 py-3 bg-white/70 text-black text-sm font-bold tracking-widest uppercase border-2 border-black hover:bg-primary hover:text-white transition-colors text-center inline-block backdrop-blur-sm">
                  <span className="text-[10px] sm:text-xs">Artisan Stories</span>
                </Link>
              </div>
            </div>
            {/* Cultural Info Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t-2 border-black pt-3 mt-auto relative z-10 bg-white/70 backdrop-blur-md -mx-8 md:-mx-12 lg:-mx-16 px-4 sm:px-8 md:px-12 lg:px-16 -mb-8 md:-mb-12 lg:-mb-16 pb-3">
              <div className="text-center">
                <h3 className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Heritage</h3>
                <p className="font-black text-lg sm:text-xl md:text-2xl text-primary">5000+</p>
                <p className="text-[8px] sm:text-xs text-gray-700 uppercase">Years Old</p>
              </div>
              <div className="text-center border-x-2 border-black px-1 sm:px-2">
                <h3 className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Artisans</h3>
                <p className="font-black text-lg sm:text-xl md:text-2xl text-primary">100+</p>
                <p className="text-[8px] sm:text-xs text-gray-700 uppercase">Master Crafters</p>
              </div>
              <div className="text-center">
                <h3 className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-gray-600 mb-1">Origin</h3>
                <p className="font-black text-base sm:text-lg">भारत</p>
                <p className="text-[8px] sm:text-xs text-gray-700 uppercase">Made in India</p>
              </div>
            </div>
          </div>
          {/* Right Content: Image Heavy */}
          <div className="w-full md:w-1/2 relative overflow-hidden group" style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1609783261796-f972a39b57d5?w=1200&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            {/* Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40 z-5"></div>
            
            {/* Minimal brutalist frame - no colored boxes */}
            <div className="absolute top-0 right-0 w-24 h-24 border-l-3 border-b-3 border-black z-20"></div>
            
            {/* Subtle Indian pattern overlay */}
            <div className="absolute inset-0 z-10 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,153,51,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}></div>
            
            <img alt="Indian fashion model in saffron saree against geometric architecture" className="w-full h-full object-cover object-top sepia-[0.15] contrast-110 group-hover:sepia-0 transition-all duration-700 ease-in-out" style={{ objectPosition: 'center 20%' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuAbB01y3nu6FlIvGBTbqYBpF4ou_HIuMUqVyLquQtXMtFWj5ln2PTR03dSAjYCUXyjS5Hx4rjFaVEmoxP_2e2e6iDT4QWaU86ClRawcQYRCvqzBEKgE0dFdXKFU0NIYIjzd8GauKpEA8Hca-cnnC_Nzbze2OHQJPQqtBjlP28mcv7gB2KD7zAPfaTOiAZ34ZaiPExn3vlDmh8Ef4rgfnJh_PntVwqqksIvdVFty_dlDTIBqM8icPUhj2-XdARmHzt8LP4J2XRf-Y5_o" />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent z-20 border-t-2 border-primary/50">
              <div className="text-white">
                <p className="text-sm font-bold tracking-widest mb-1 text-primary">संग्रह • COLLECTION</p>
                <p className="text-2xl font-bold uppercase">The Stepwell Drape</p>
                <p className="text-xs text-gray-300 mt-1">Chanderi Silk • Jaipur</p>
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

      {/* Featured Categories / Grid */}
      <section className="w-full relative" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-background-light/50 backdrop-blur-sm z-0"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 divide-y-3 md:divide-y-0 md:divide-x-3 divide-black border-b-3 border-black">
          {loading ? (
            <div className="p-8 text-center col-span-3 font-bold uppercase tracking-widest">Loading Collections...</div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center col-span-3 font-bold uppercase tracking-widest">No Collections Found</div>
          ) : (
            categories.slice(0, 3).map((cat, index) => {
              const fallbackImages = [
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBe0Cy4AfeVW_83ctEZ4EhpmhVceuEMtAJul1H7etecDD9or0D_VMBK30kiNG4SWPNn4N7hpMsy6q41E71ev5brdupieCA2MxY5zP7bQ_X9if5IaNoFG6lBTYsPsCv_B7XdcPlGCS3NZNctx1tA6tM3YBIetvzX3QqdOPBiYjFwUfzca6UmHXS7fcwwJ4p22SJvRm3djKkiKN9fhdezdD6ADTFekUap5xAkVv6wTWSpnnxiofyCTmIAQZ_85669iXCugc-N19KimDuy",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBj3UWUK2mFa8p6DorHAsamHyb3axPV4WrAEltVEH_FElsu0FJYXx1jQFOxBYegCb60A-mvDyGJQppoFJ0mz-XKbjyuC4SZX0NJ4AqPyPFNXXF36Sx6A9G7SDrNv4kV01FfxGncGJ4Wrb-t6_S08y2pVbpRaQr8UZE4nPHJU4S67ezPe5ZqUEhQtitqTZdTrq-Dd6fyORrl4ksN1rrquUQDiZO7KmpNsjrXH491QizRED_h9ADBabw2VBJkJLZthFnhStXwN18PLA0q",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBS-r2tHKOIA2fnabA2ErTLMi5XrglFYiH-wNP9rovpcxltXHPswwwm_pKii8LIwl-kbkgVVkQtRqeF-NxGJVX_efWRDxJh-F27__GrMXllabS0BpHx27k6yYbru3TpS-cMEfmN1_OJdxlRAkaeDiDg3Z8QldADpW87b24itOAKCz2e7P-DyZRFDjAdq7uNF3hY2BGkopj5hf9YJ9yW9g5hkyZ6ohyefbVW6DSniwpiX064MG5vs8lyeytMoXYg-ETQGEzHWzjBYu-C"
              ];
              const imgSrc = cat.image_url ? `http://localhost:3001${cat.image_url}` : fallbackImages[index % fallbackImages.length];

              return (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="relative group h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] overflow-hidden cursor-pointer block">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/20 z-10 transition-colors"></div>
                  <img alt={cat.name} className="w-full h-full object-cover sepia-[0.2] group-hover:sepia-0 transition-all duration-500" src={imgSrc} />
                  <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                    <div className="bg-white/80 backdrop-blur-md border-2 sm:border-3 border-black px-4 sm:px-6 md:px-8 py-3 sm:py-4 transform rotate-0 group-hover:-rotate-2 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[6px_6px_0px_0px_rgba(255,153,51,1)] sm:group-hover:shadow-[8px_8px_0px_0px_rgba(255,153,51,1)]">
                      <h3 className="text-base sm:text-xl md:text-2xl font-black uppercase tracking-widest">{cat.name}</h3>
                    </div>
                  </div>
                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Cultural Statement Section */}
      <section className="w-full text-white border-b-3 border-black py-12 md:py-16 lg:py-20 relative overflow-hidden" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/80 z-0"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 z-5 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,153,51,0.2) 40px, rgba(255,153,51,0.2) 41px)',
        }}></div>
        
        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 relative z-10">
          <p className="text-primary font-bold uppercase tracking-widest text-xs sm:text-sm mb-3 inline-block px-3 py-1.5 bg-black/60 border-2 border-primary">विरासत • Heritage</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-tight mb-4">
            <span style={{ color: '#FF9933' }}>Crafted</span> by <span style={{ color: '#138808' }}>Hands</span>,<br />
            <span style={{ color: '#FF9933' }}>Woven</span> with <span style={{ color: '#138808' }}>Soul</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8">
            Every thread carries centuries of tradition. Every pattern echoes ancient wisdom. 
            We celebrate India's master artisans and their timeless craft.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mt-8">
            <div className="text-center border-2 border-primary p-4 sm:p-5 md:p-6 bg-black/60 backdrop-blur-sm min-w-[90px] sm:min-w-[110px]">
              <p className="text-2xl sm:text-3xl font-black text-primary mb-1">28</p>
              <p className="text-[9px] sm:text-xs uppercase tracking-widest text-gray-300">Indian States</p>
            </div>
            <div className="text-center border-2 border-primary p-4 sm:p-5 md:p-6 bg-black/60 backdrop-blur-sm min-w-[90px] sm:min-w-[110px]">
              <p className="text-2xl sm:text-3xl font-black text-primary mb-1">100%</p>
              <p className="text-[9px] sm:text-xs uppercase tracking-widest text-gray-300">Authentic</p>
            </div>
            <div className="text-center border-2 border-primary p-4 sm:p-5 md:p-6 bg-black/60 backdrop-blur-sm min-w-[90px] sm:min-w-[110px]">
              <p className="text-2xl sm:text-3xl font-black text-primary mb-1">∞</p>
              <p className="text-[9px] sm:text-xs uppercase tracking-widest text-gray-300">Timeless</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="w-full p-6 sm:p-8 md:p-12 lg:p-16 border-t-3 border-black relative" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1604608672516-f1b9b1a4a3f3?w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-background-light/70 backdrop-blur-sm z-0"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-8 sm:mb-10 md:mb-12">
            <div>
              <p className="text-primary font-bold uppercase tracking-widest text-[9px] sm:text-xs mb-2 inline-block px-2 sm:px-3 py-1 bg-white/80 backdrop-blur-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">संग्रह • Collection</p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase leading-tight text-black mt-3">Curated<br />Masterpieces</h2>
            </div>
            <Link href="/collections" className="hidden md:inline-block border-b-2 border-black font-bold uppercase tracking-widest text-sm hover:text-primary hover:border-primary transition-colors pb-1">
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
