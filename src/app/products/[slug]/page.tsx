'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { ProductMedia } from '@/components/ProductMedia';
import { useCartStore, useAuthStore, useWishlistStore } from '@/store';
import { Truck, ShieldCheck, RotateCcw, Heart, Star } from 'lucide-react';

interface Review { id: string; rating: number; comment?: string; created_at: string; User?: { name: string } }
interface Product {
    id: string; name: string; slug: string; price: number; compare_price?: number;
    description?: string; images: string[]; stock: number; category?: { name: string };
    avg_rating?: string; reviews?: Review[];
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const addItem = useCartStore((s) => s.addItem);
    const user = useAuthStore((s) => s.user);
    const { hasProduct, addId, removeId, setProductIds } = useWishlistStore();

    useEffect(() => {
        api.get(`/products/${params.slug}`)
            .then(r => {
                setProduct(r.data.product);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [params.slug]);

    useEffect(() => {
        api.get(`/products/${params.slug}/related`).then(r => setRelated(r.data.products || [])).catch(() => {});
    }, [params.slug]);

    useEffect(() => {
        if (user) {
            api.get('/wishlist/ids').then(r => setProductIds(r.data.product_ids || [])).catch(() => {});
        }
    }, [user]);

    const handleAdd = () => {
        if (!product) return;
        addItem({ product_id: product.id, name: product.name, price: Number(product.price), image: product.images?.[0] || '', quantity: qty, stock: product.stock });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const toggleWishlist = async () => {
        if (!user || !product) return;
        const inWishlist = hasProduct(product.id);
        try {
            if (inWishlist) {
                await api.delete(`/wishlist/${product.id}`);
                removeId(product.id);
            } else {
                await api.post('/wishlist', { product_id: product.id });
                addId(product.id);
            }
        } catch (_) {}
    };

    const submitReview = async () => {
        if (!user || !product || reviewRating < 1 || reviewRating > 5) return;
        setSubmittingReview(true);
        try {
            await api.post(`/products/${product.slug}/review`, { rating: reviewRating, comment: reviewComment || undefined });
            const r = await api.get(`/products/${params.slug}`);
            setProduct(r.data.product);
            setReviewRating(0);
            setReviewComment('');
        } catch (_) {}
        setSubmittingReview(false);
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
                                {/* Main Image/Video */}
                                <div className="aspect-[4/5] w-full relative bg-[#2a1e1d] group overflow-hidden">
                                    <ProductMedia
                                        path={product.images?.[0] || ''}
                                        className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Additional Media Grid */}
                                {product.images?.length > 1 && (
                                    <div className={`grid ${product.images.length === 2 ? 'grid-cols-1' : 'grid-cols-2'} gap-[1px]`}>
                                        {product.images.slice(1).map((img, i) => (
                                            <div key={i} className="aspect-[3/4] w-full relative bg-[#2a1e1d] group overflow-hidden">
                                                <ProductMedia
                                                    path={img}
                                                    className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
                                                />
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
                                <div className="flex items-center gap-3">
                                    {user && (
                                        <button onClick={toggleWishlist} className="p-1.5 rounded hover:bg-[#2a1e1d] transition-colors">
                                            <Heart className={`w-5 h-5 ${hasProduct(product.id) ? 'fill-primary text-primary' : 'text-slate-400'}`} strokeWidth={1.5} />
                                        </button>
                                    )}
                                    {discount && <span className="text-primary font-bold">{discount}% OFF</span>}
                                </div>
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
                                {product.avg_rating && (
                                    <div className="flex items-center gap-1 mt-2 text-sm">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-white font-bold">{product.avg_rating}</span>
                                        <span className="text-slate-500">({product.reviews?.length || 0} reviews)</span>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            <div className="border-t border-b border-[#4a3a39] py-6">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm uppercase tracking-widest text-slate-300">Quantity</span>
                                </div>
                                <div className="flex w-32 h-12 border border-[#4a3a39]">
                                    <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex-1 text-slate-400 hover:text-white text-xl bg-transparent">−</button>
                                    <span className="flex-1 flex items-center justify-center text-sm font-bold">{qty}</span>
                                    <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="flex-1 text-slate-400 hover:text-white text-xl bg-transparent">+</button>
                                </div>
                            </div>

                            {/* Add to Cart - placed high for visibility on all screens */}
                            <div className="lg:mt-0">
                                <button
                                    onClick={handleAdd}
                                    disabled={product.stock === 0}
                                    className="w-full h-14 bg-primary hover:bg-[#b0120a] text-white transition-all uppercase font-bold tracking-widest text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent">
                                    {added ? 'ADDED ✓' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                                </button>
                            </div>

                            {/* Storytelling / Desc Section */}
                            <div className="space-y-4 pt-4 border-t border-[#4a3a39]">
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

                            {/* Reviews */}
                            <div className="border-t border-[#4a3a39] pt-6">
                                <h3 className="text-xl text-white font-bold mb-4">Reviews</h3>
                                {product.reviews?.length ? (
                                    <div className="space-y-4 mb-6">
                                        {product.reviews.map((r) => (
                                            <div key={r.id} className="p-4 bg-[#2a1e1d] rounded">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-white font-bold">{r.User?.name || 'Anonymous'}</span>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4,5].map((i) => <Star key={i} className={`w-4 h-4 ${i <= r.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`} />)}
                                                    </div>
                                                    <span className="text-xs text-slate-500">{new Date(r.created_at).toLocaleDateString()}</span>
                                                </div>
                                                {r.comment && <p className="text-slate-300 text-sm">{r.comment}</p>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm mb-4">No reviews yet.</p>
                                )}
                                {user && (
                                    <div className="p-4 bg-[#2a1e1d] rounded">
                                        <p className="text-sm font-bold text-white mb-2">Write a review</p>
                                        <div className="flex gap-1 mb-2">
                                            {[1,2,3,4,5].map((i) => (
                                                <button key={i} onClick={() => setReviewRating(i)} className="p-1">
                                                    <Star className={`w-6 h-6 ${i <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-500'}`} />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Your review (optional)" className="w-full bg-[#1a1211] border border-[#4a3a39] text-white px-3 py-2 text-sm mb-2 resize-none h-20" />
                                        <button onClick={submitReview} disabled={submittingReview || reviewRating < 1} className="px-4 py-2 bg-primary text-white text-sm font-bold uppercase disabled:opacity-50">
                                            {submittingReview ? 'Submitting…' : 'Submit'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Related Products */}
                            {related.length > 0 && (
                                <div className="border-t border-[#4a3a39] pt-6">
                                    <h3 className="text-xl text-white font-bold mb-4">You May Also Like</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {related.slice(0, 4).map((p) => (
                                            <Link key={p.id} href={`/products/${p.slug}`} className="group block">
                                                <div className="aspect-[3/4] relative overflow-hidden bg-[#2a1e1d] mb-2">
                                                    <ProductMedia path={p.images?.[0]} className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                                </div>
                                                <p className="text-sm text-slate-400 truncate">{p.name}</p>
                                                <p className="text-white font-bold">₹{Number(p.price).toFixed(0)}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
