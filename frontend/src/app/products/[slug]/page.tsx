'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useCartStore } from '@/store';
import { ImageIcon, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

interface VariationOption {
    value: string;
    images?: string[];
    image?: string; // fallback
}
interface Variation {
    name: string;
    options: VariationOption[];
}
interface Product {
    id: string; name: string; slug: string; price: number; compare_price?: number;
    description?: string; images: string[]; stock: number; category?: { name: string };
    variations?: Variation[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        api.get(`/products/${params.slug}`)
            .then(r => {
                const p = r.data.product;
                setProduct(p);
                // Initialize selected variations
                if (p.variations && p.variations.length > 0) {
                    const initial: Record<string, string> = {};
                    p.variations.forEach((v: Variation) => {
                        if (v.options && v.options.length > 0) {
                            initial[v.name] = v.options[0].value;
                        }
                    });
                    setSelectedVariations(initial);
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [params.slug]);

    const handleAdd = () => {
        if (!product) return;
        const variationLabel = Object.entries(selectedVariations).map(([k, v]) => `${k}: ${v}`).join(', ');
        const finalName = variationLabel ? `${product.name} (${variationLabel})` : product.name;
        
        // Find if selected variation has a specific image
        let selectedImage = product.images?.[0] || '';
        for (const v of product.variations || []) {
            const selectedVal = selectedVariations[v.name];
            const opt = v.options.find(o => o.value === selectedVal);
            if (opt?.image) {
                selectedImage = opt.image;
                break;
            }
        }

        addItem({ 
            product_id: product.id, 
            name: finalName, 
            price: Number(product.price), 
            image: selectedImage,
            quantity: qty, 
            stock: product.stock 
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="min-h-screen bg-[#1a1211] flex items-center justify-center text-white text-2xl font-bold uppercase tracking-widest">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-[#1a1211] flex items-center justify-center text-white text-2xl font-bold uppercase tracking-widest">Product not found.</div>;

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - Number(product.price) / Number(product.compare_price)) * 100)
        : null;

    // Determine the main image and gallery images to show
    let currentGallery = product.images || [];
    let selectedVariationOption: VariationOption | null = null;
    
    // For now, handle the first variation as the primary variant switcher (e.g. Color or Pattern)
    if (product.variations && product.variations.length > 0) {
        const v = product.variations[0];
        const selectedVal = selectedVariations[v.name];
        selectedVariationOption = v.options.find(o => o.value === selectedVal) || null;
        
        if (selectedVariationOption) {
            const varImages = selectedVariationOption.images || (selectedVariationOption.image ? [selectedVariationOption.image] : []);
            if (varImages.length > 0) {
                // ONLY show variation images if they exist
                currentGallery = varImages;
            }
        }
    }

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const mainImage = currentGallery[currentImageIndex] || product.images?.[0];

    const formatImageUrl = (url: string) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${url}`;
    };

    return (
        <div className="bg-[#1a1211] font-display text-white antialiased min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col pt-16 lg:pt-0">
                {/* Main Content Area: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-[1fr_112px] bg-[#100a0a] border-r border-[#4a3a39]">
                        {/* Center: Main Gallery Area */}
                        <div className="relative flex flex-col h-[60vh] md:h-[calc(100vh-80px)] overflow-hidden">
                            {/* Main Large Image */}
                            <div className="flex-grow flex items-center justify-center p-4 sm:p-8 bg-black/20">
                                {mainImage ? (
                                    <img 
                                        src={formatImageUrl(mainImage)} 
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain transition-all duration-500 animate-in fade-in zoom-in-95"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center opacity-20">
                                        <ImageIcon className="w-20 h-20" />
                                        <span className="mt-4 uppercase tracking-[0.3em] text-sm">No Image Available</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Bottom Gallery Strip (Images only for the selected variation) */}
                            {currentGallery.length > 1 && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-3 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 z-20">
                                    {currentGallery.map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setCurrentImageIndex(i)}
                                            className={`relative w-12 h-16 sm:w-16 sm:h-20 flex-shrink-0 transition-all duration-300 ${
                                                currentImageIndex === i 
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-black scale-110' 
                                                : 'opacity-50 hover:opacity-100 hover:scale-105'
                                            }`}
                                        >
                                            <img src={formatImageUrl(img)} className="w-full h-full object-cover rounded-sm shadow-2xl" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Variation Selector Strip */}
                        <div className="w-full md:w-28 bg-[#15100f] border-t md:border-t-0 md:border-l border-[#4a3a39] flex flex-row md:flex-col items-center py-6 gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar z-30">
                            <span className="hidden md:block text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold rotate-180 [writing-mode:vertical-lr] mb-2 opacity-50">Select Variant</span>
                            
                            {product.variations?.map((v) => (
                                <div key={v.name} className="flex flex-row md:flex-col items-center gap-4 px-4 md:px-0">
                                    {v.options.map((opt) => {
                                        const isSelected = selectedVariations[v.name] === opt.value;
                                        const thumb = opt.images?.[0] || opt.image || product.images[0];
                                        return (
                                            <button
                                                key={opt.value}
                                                onClick={() => {
                                                    setSelectedVariations(prev => ({ ...prev, [v.name]: opt.value }));
                                                    setCurrentImageIndex(0);
                                                }}
                                                className={`group relative w-16 h-20 md:w-20 md:h-24 flex-shrink-0 border-2 transition-all duration-300 rounded-lg overflow-hidden ${
                                                    isSelected ? 'border-primary scale-110 shadow-[0_0_20px_rgba(235,59,48,0.3)]' : 'border-white/5 hover:border-white/30'
                                                }`}
                                            >
                                                <img src={formatImageUrl(thumb)} className={`w-full h-full object-cover transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}`} />
                                                <div className={`absolute bottom-0 left-0 right-0 py-1 text-[8px] font-bold text-center uppercase tracking-tighter truncate px-1 transition-all ${
                                                    isSelected ? 'bg-primary text-white' : 'bg-black/80 text-slate-300 group-hover:text-white'
                                                }`}>
                                                    {opt.value}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                            {(!product.variations || product.variations.length === 0) && (
                                <div className="hidden md:flex flex-col items-center gap-2 opacity-20">
                                    <div className="w-1 h-24 bg-gradient-to-b from-transparent via-slate-500 to-transparent"></div>
                                    <span className="text-[10px] uppercase tracking-widest rotate-90 [writing-mode:vertical-lr] whitespace-nowrap">Standard Edition</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Details (Scrollable) */}
                    <div className="lg:col-span-4 bg-[#1a1211] flex flex-col">
                        <div className="p-6 md:p-10 lg:p-12 flex flex-col gap-10">

                            {/* Breadcrumbs & Meta */}
                            <div className="flex justify-between items-start text-xs uppercase tracking-widest text-[#94a3b8]">
                                <div className="flex gap-2">
                                    <Link href="/collections" className="hover:text-white">Collections</Link>
                                    <span>/</span>
                                    <span>{product.category?.name || 'Artifact'}</span>
                                </div>
                                {discount && <span className="text-primary font-bold">{discount}% OFF</span>}
                            </div>

                            {/* Title Block */}
                            <div>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[0.9] text-white tracking-tighter mb-4">
                                    {product.name}
                                </h1>
                                <div className="h-px w-24 bg-primary mt-6 mb-6"></div>
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-3xl font-bold text-white tracking-tight">₹ {Number(product.price).toFixed(0)}</span>
                                    {product.compare_price && (
                                        <span className="text-sm text-slate-500 line-through">₹ {Number(product.compare_price).toFixed(0)}</span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 uppercase">Inclusive of all taxes.</p>
                                <p className={`text-xs mt-4 uppercase tracking-widest font-bold ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-yellow-500' : 'text-primary'}`}>
                                    {product.stock > 10 ? 'IN STOCK' : product.stock > 0 ? `ONLY ${product.stock} LEFT` : 'SOLD OUT'}
                                </p>
                            </div>

                            {/* Variations Section (Only for non-visual variations that aren't already in the side strip) */}
                            {product.variations && product.variations.some(v => v.options.every(o => !o.images?.length && !o.image)) && (
                                <div className="p-8 bg-black/30 border-y border-[#4a3a39] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {product.variations.filter(v => v.options.every(o => !o.images?.length && !o.image)).map((v) => (
                                        <div key={v.name} className="space-y-4">
                                            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                                                <span>Select {v.name}</span>
                                                <span className="text-white">{selectedVariations[v.name]}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {v.options.map((opt) => {
                                                    const isSelected = selectedVariations[v.name] === opt.value;
                                                    return (
                                                        <button
                                                            key={opt.value}
                                                            onClick={() => setSelectedVariations(prev => ({ ...prev, [v.name]: opt.value }))}
                                                            className={`px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 border ${
                                                                isSelected 
                                                                ? 'bg-white text-black border-white font-bold' 
                                                                : 'bg-transparent text-slate-400 border-[#4a3a39] hover:border-white hover:text-white'
                                                            }`}
                                                        >
                                                            {opt.value}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="border-t border-b border-[#4a3a39] py-8">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm uppercase tracking-widest text-slate-300">Quantity</span>
                                </div>
                                <div className="flex w-32 h-12 border border-[#4a3a39]">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex-1 text-slate-400 hover:text-white text-xl bg-transparent">−</button>
                                    <span className="flex-1 flex items-center justify-center text-sm font-bold">{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="flex-1 text-slate-400 hover:text-white text-xl bg-transparent">+</button>
                                </div>
                            </div>

                            {/* Storytelling / Desc Section */}
                            <div className="space-y-4">
                                <h3 className="text-2xl text-white italic">The Artifact</h3>
                                <p className="text-slate-300 font-light leading-relaxed text-lg whitespace-pre-wrap">
                                    {product.description || 'No description available for this artifact.'}
                                </p>
                                <div className="flex gap-6 pt-4">
                                    <div className="flex flex-col gap-1 items-center">
                                        <Truck className="w-6 h-6 text-slate-400" />
                                        <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] text-center">Free Ship</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-center">
                                        <ShieldCheck className="w-6 h-6 text-slate-400" />
                                        <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] text-center">Secured</span>
                                    </div>
                                    <div className="flex flex-col gap-1 items-center">
                                        <RotateCcw className="w-6 h-6 text-slate-400" />
                                        <span className="text-[10px] uppercase tracking-widest text-[#94a3b8] text-center">Easy Returns</span>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer to ensure content isn't covered by sticky footer on small screens */}
                            <div className="h-24 lg:h-0"></div>
                        </div>

                        {/* Sticky CTA Footer (Desktop: inside the right column, Mobile: fixed bottom) */}
                        <div className="fixed bottom-0 left-0 right-0 lg:sticky lg:bottom-0 p-4 bg-[#1a1211] border-t border-[#4a3a39] lg:border-t-0 z-40 backdrop-blur-md lg:backdrop-blur-none bg-opacity-90 lg:bg-opacity-100 lg:mt-auto">
                            <div className="flex gap-4 items-stretch h-14">
                                <button
                                    onClick={handleAdd}
                                    disabled={product.stock === 0}
                                    className="flex-1 bg-primary hover:bg-[#b0120a] text-white transition-all uppercase font-bold tracking-widest text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent">
                                    {added ? 'ADDED ✓' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
