'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useWishlistStore } from '@/store';
import api, { getAssetUrl } from '@/lib/api';
import { ProductMedia } from '@/components/ProductMedia';
import { Heart } from 'lucide-react';

interface WishlistProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category?: { name: string };
}

export default function WishlistPage() {
    const user = useAuthStore((s) => s.user);
    const setProductIds = useWishlistStore((s) => s.setProductIds);
    const removeId = useWishlistStore((s) => s.removeId);
    const router = useRouter();
    const [items, setItems] = useState<{ Product: WishlistProduct }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.replace('/login?redirect=/wishlist');
            return;
        }
        api.get('/wishlist')
            .then((r) => {
                setItems(r.data.items || []);
                setProductIds((r.data.items || []).map((i: any) => i.Product?.id).filter(Boolean));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user, router]);

    const handleRemove = async (productId: string) => {
        await api.delete(`/wishlist/${productId}`).catch(() => {});
        setItems((prev) => prev.filter((i) => i.Product?.id !== productId));
        removeId(productId);
    };

    if (!user) return null;
    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold uppercase">Loading…</div>;

    return (
        <main className="flex-grow w-full max-w-6xl mx-auto p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">Wishlist</h1>
            {items.length === 0 ? (
                <div className="text-center py-16">
                    <Heart className="w-16 h-16 mx-auto text-slate-300 mb-4" strokeWidth={1} />
                    <p className="text-lg text-slate-600 mb-4">Your wishlist is empty</p>
                    <Link href="/collections" className="text-primary font-bold underline uppercase">Continue Shopping</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map(({ Product: p }) =>
                        p ? (
                            <div key={p.id} className="group border-2 border-black bg-white">
                                <Link href={`/products/${p.slug}`} className="block aspect-[4/5] relative overflow-hidden bg-slate-100">
                                    <ProductMedia path={p.images?.[0] || ''} className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500" />
                                </Link>
                                <div className="p-4">
                                    <p className="text-xs uppercase text-slate-500">{p.category?.name}</p>
                                    <Link href={`/products/${p.slug}`} className="font-bold text-lg hover:text-primary line-clamp-2">
                                        {p.name}
                                    </Link>
                                    <p className="font-black text-primary mt-1">₹{Number(p.price).toFixed(0)}</p>
                                    <button
                                        onClick={() => handleRemove(p.id)}
                                        className="mt-3 text-sm font-bold uppercase text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </main>
    );
}
