'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Product {
    id: string; name: string; slug: string; price: number; compare_price?: number;
    images: string[]; stock: number;
}

export default function CollectionSlugPage() {
    const params = useParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [catName, setCatName] = useState('');

    useEffect(() => {
        const slug = params.slug as string;
        Promise.all([
            api.get('/products', { params: { category: slug, limit: 40 } }),
            api.get(`/categories/${slug}`),
        ]).then(([pRes, cRes]) => {
            setProducts(pRes.data.rows || []);
            setCatName(cRes.data.category?.name || slug);
        }).finally(() => setLoading(false));
    }, [params.slug]);

    return (
        <div className="container" style={{ paddingTop: 48, paddingBottom: 48 }}>
            <div style={{ marginBottom: 32 }}>
                <Link href="/collections" style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, color: 'var(--grey)' }}>← All Collections</Link>
                <h1 className="section-title" style={{ marginTop: 16 }}>{catName}</h1>
            </div>
            {loading ? <div className="loading-overlay">Loading…</div> : products.length === 0 ? (
                <div className="loading-overlay">No products in this collection yet.</div>
            ) : (
                <div className="product-grid">
                    {products.map((p) => (
                        <Link key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: 'none' }}>
                            <div className="card card-hover" style={{ padding: 0 }}>
                                <div style={{ aspectRatio: '1', background: 'var(--light-grey)', overflow: 'hidden' }}>
                                    {p.images?.[0] ? (
                                        <img src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${p.images[0]}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 48 }}>🏺</div>
                                    )}
                                </div>
                                <div style={{ padding: '12px 14px 16px' }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.name}</p>
                                    <span style={{ fontWeight: 900, fontSize: 18 }}>₹{Number(p.price).toFixed(0)}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
