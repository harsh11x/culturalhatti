'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { getAssetUrl } from '@/lib/api';
import { Search, ImageIcon } from 'lucide-react';

interface Product {
    id: string; name: string; slug: string; price: number; compare_price?: number;
    images: string[]; stock: number; category?: { name: string };
}
interface Category {
    id: string; name: string; slug: string;
}

export default function CollectionsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selected, setSelected] = useState('');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const LIMIT = 20;

    const fetchProducts = async (pageOverride?: number) => {
        setLoading(true);
        try {
            const p = pageOverride ?? page;
            const params: Record<string, string | number> = { page: p, limit: LIMIT };
            if (selected) params.category = selected;
            if (search) params.search = search;
            const res = await api.get('/products', { params });
            setProducts(res.data.rows || []);
            setTotal(res.data.count || 0);
            if (pageOverride !== undefined) setPage(1);
        } catch {
            setProducts([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get('/categories').then(r => setCategories(r.data.categories || [])).catch(() => setCategories([]));
    }, []);
    useEffect(() => { fetchProducts(); }, [selected, page]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(1);
    };

    return (
        <main className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 bg-background-light">
            {/* Sidebar Filters (Desktop) */}
            <aside className="hidden lg:block col-span-3 border-r-3 border-black bg-background-light">
                <div className="sticky top-24 p-6 flex flex-col gap-8">
                    <div>
                        <h3 className="text-xl font-bold uppercase mb-4 border-b-4 border-accent inline-block">Category</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 cursor-pointer group" onClick={() => { setSelected(''); setPage(1); }}>
                                <div className={`size-4 border-2 border-black ${selected === '' ? 'bg-primary' : 'group-hover:bg-primary'}`}></div>
                                <span className="text-base font-bold uppercase">All Products</span>
                            </li>
                            {categories.map((c) => (
                                <li key={c.id} className="flex items-center gap-2 cursor-pointer group" onClick={() => { setSelected(c.slug); setPage(1); }}>
                                    <div className={`size-4 border-2 border-black ${selected === c.slug ? 'bg-primary' : 'group-hover:bg-primary'}`}></div>
                                    <span className="text-base font-bold uppercase">{c.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </aside>

            {/* Product Grid Area */}
            <div className="col-span-1 lg:col-span-9 flex flex-col min-h-screen">
                {/* Search & Breadcrumbs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b-3 border-black bg-white">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide mb-4 sm:mb-0">
                        <Link className="hover:underline decoration-2" href="/">Home</Link>
                        <span>/</span>
                        <span className="underline decoration-2">{selected ? categories.find(c => c.slug === selected)?.name : 'All Collections'}</span>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <form onSubmit={handleSearch} className="flex w-full sm:w-auto border-2 border-black">
                            <div className="px-3 flex items-center justify-center border-r-2 border-black bg-gray-100">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                className="w-full sm:w-64 bg-white border-none focus:ring-0 text-sm font-bold uppercase placeholder-gray-400 text-black px-3 py-2"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </form>
                    </div>
                </div>

                {/* Page Title Area */}
                <div className="p-8 border-b-3 border-black relative overflow-hidden group bg-accent text-black">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 -mr-8 -mt-8 rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none relative z-10">
                        {selected ? categories.find(c => c.slug === selected)?.name : 'New Arrivals'}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg font-medium uppercase tracking-tight text-gray-800 relative z-10">
                        Curated selection of hand-loomed textiles and traditional crafts.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="p-12 text-center text-xl font-bold uppercase tracking-widest text-black">Loading Archive...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center text-xl font-bold uppercase tracking-widest text-black">No artifacts found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b-3 border-black">
                            {products.map((p, idx) => (
                                <Link key={p.id} href={`/products/${p.slug}`} className={`group ${idx < products.length - (products.length % 3 === 0 ? 3 : products.length % 3) ? 'border-b-3' : ''} md:border-r-3 border-black relative flex flex-col h-full bg-white hover:bg-gray-50 transition-colors`}>
                                    {p.stock === 0 && (
                                        <div className="absolute flex top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold uppercase z-10 border-b-3 border-l-3 border-black">Sold Out</div>
                                    )}
                                    {p.compare_price && p.stock > 0 && (
                                        <div className="absolute flex top-0 left-0 bg-accent text-black px-3 py-1 text-xs font-bold uppercase z-10 border-b-3 border-r-3 border-black">Sale</div>
                                    )}
                                    <div className="relative w-full aspect-[4/5] overflow-hidden border-b-3 border-black">
                                        {p.images?.[0] ? (
                                            <div
                                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                                style={{ backgroundImage: `url(${getAssetUrl(p.images[0])})` }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-bold uppercase text-lg leading-tight mb-2 line-clamp-2">{p.name}</h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-4">{p.category?.name || 'Artifact'}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-black border-dashed">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black">₹{Number(p.price).toFixed(0)}</span>
                                                {p.compare_price && (
                                                    <span className="text-sm font-bold text-gray-400 line-through">₹{Number(p.compare_price).toFixed(0)}</span>
                                                )}
                                            </div>
                                            <button className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-wider hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black hover:border-black" disabled={p.stock === 0}>
                                                {p.stock === 0 ? 'Out' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {total > LIMIT && (
                    <div className="p-8 flex justify-center border-t-3 border-black bg-background-light gap-4">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-full md:w-auto bg-transparent border-3 border-black text-black text-sm font-black uppercase py-3 px-8 hover:bg-black hover:text-white transition-all brutalist-shadow hover:brutalist-shadow-hover disabled:opacity-50 disabled:brutalist-shadow-none">
                            Previous
                        </button>
                        <span className="px-4 py-3 font-bold uppercase flex items-center">Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)} disabled={products.length < LIMIT} className="w-full md:w-auto bg-transparent border-3 border-black text-black text-sm font-black uppercase py-3 px-8 hover:bg-black hover:text-white transition-all brutalist-shadow hover:brutalist-shadow-hover disabled:opacity-50 disabled:brutalist-shadow-none">
                            Next
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
