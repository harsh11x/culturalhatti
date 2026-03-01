'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useCartStore } from '@/store';
import { ImageIcon, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

interface Product {
    id: string; name: string; slug: string; price: number; compare_price?: number;
    description?: string; images: string[]; stock: number; category?: { name: string };
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const addItem = useCartStore((s) => s.addItem);

    useEffect(() => {
        api.get(`/products/${params.slug}`)
            .then(r => setProduct(r.data.product))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [params.slug]);

    const handleAdd = () => {
        if (!product) return;
        addItem({ product_id: product.id, name: product.name, price: Number(product.price), image: product.images?.[0] || '', quantity: qty, stock: product.stock });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div className="min-h-screen bg-[#1a1211] flex items-center justify-center text-white text-2xl font-bold uppercase tracking-widest">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-[#1a1211] flex items-center justify-center text-white text-2xl font-bold uppercase tracking-widest">Product not found.</div>;

    const discount = product.compare_price && product.compare_price > product.price
        ? Math.round((1 - Number(product.price) / Number(product.compare_price)) * 100)
        : null;

    return (
        <div className="bg-[#1a1211] font-display text-white antialiased min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col pt-16 lg:pt-0">
                {/* Main Content Area: Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)]">

                    {/* Left: Gallery (Sticky on Desktop) */}
                    <div className="lg:col-span-7 relative bg-[#100a0a]">
                        <div className="lg:sticky lg:top-[80px] h-full lg:h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-1 gap-[1px] bg-[#4a3a39]">
                                {/* Main Image */}
                                <div className="aspect-[4/5] w-full relative bg-[#2a1e1d] group overflow-hidden">
                                    {product.images?.[0] ? (
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url(${product.images[0].startsWith('http') ? product.images[0] : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${product.images[0]}`})` }}>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <ImageIcon className="w-16 h-16 text-slate-600" />
                                            <span className="text-slate-500 font-bold uppercase tracking-widest mt-4">No Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Images Grid */}
                                {product.images?.length > 1 && (
                                    <div className={`grid ${product.images.length === 2 ? 'grid-cols-1' : 'grid-cols-2'} gap-[1px]`}>
                                        {product.images.slice(1).map((img, i) => (
                                            <div key={i} className="aspect-[3/4] w-full relative bg-[#2a1e1d] group overflow-hidden">
                                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/${img}`})` }}>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Details (Scrollable) */}
                    <div className="lg:col-span-5 bg-[#1a1211] border-l border-[#4a3a39] flex flex-col">
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
