'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ImageIcon } from 'lucide-react';
import api from '@/lib/api';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number;
    stock: number;
    images: string[];
    category?: { name: string };
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const categoryTitle = slug
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products', { params: { category: slug, limit: 100 } });
                setProducts(res.data.rows || []);
            } catch (err) {
                console.error('Error fetching category products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [slug]);

    const filteredProducts = products
        .filter(p => {
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (minPrice !== '' && p.price < minPrice) return false;
            if (maxPrice !== '' && p.price > maxPrice) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'price-low') return a.price - b.price;
            if (sortBy === 'price-high') return b.price - a.price;
            return 0;
        });

    return (
        <main className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 bg-background-light">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block col-span-3 border-r-3 border-black bg-background-light">
                <div className="sticky top-24 p-6 flex flex-col gap-8">
                    <div>
                        <h3 className="text-xl font-bold uppercase mb-4 border-b-4 border-accent inline-block">Filters</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Search</label>
                                <input
                                    type="text"
                                    className="w-full bg-white border-2 border-black focus:ring-0 text-sm font-bold placeholder-gray-400 text-black px-3 py-2"
                                    placeholder="Search in category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Min Price</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white border-2 border-black focus:ring-0 text-sm font-bold placeholder-gray-400 text-black px-3 py-2"
                                        placeholder="₹ 0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-bold uppercase tracking-widest block mb-2">Max Price</label>
                                    <input
                                        type="number"
                                        className="w-full bg-white border-2 border-black focus:ring-0 text-sm font-bold placeholder-gray-400 text-black px-3 py-2"
                                        placeholder="₹ Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest block mb-2">Sort By</label>
                                <select
                                    className="w-full bg-white border-2 border-black focus:ring-0 text-sm font-bold uppercase text-black px-3 py-2 cursor-pointer"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Product Grid Area */}
            <div className="col-span-1 lg:col-span-9 flex flex-col min-h-screen">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap items-center justify-between p-6 border-b-3 border-black bg-accent text-black">
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
                        <Link className="hover:underline decoration-2" href="/">Home</Link>
                        <span>/</span>
                        <Link className="hover:underline decoration-2" href="/collections">Collections</Link>
                        <span>/</span>
                        <span className="underline decoration-2">{categoryTitle}</span>
                    </div>
                    {/* Mobile Filter Toggles could go here */}
                </div>

                {/* Page Title Area */}
                <div className="p-8 border-b-3 border-black relative overflow-hidden group bg-white text-black">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 -mr-8 -mt-8 rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none relative z-10">
                        {categoryTitle}
                    </h1>
                    <p className="mt-4 max-w-xl text-lg font-medium uppercase tracking-tight text-gray-500 relative z-10">
                        Explore our complete {categoryTitle.toLowerCase()} collection.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="flex-grow">
                    {loading ? (
                        <div className="p-12 text-center text-xl font-bold uppercase tracking-widest text-black">Loading Styles...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-12 text-center text-xl font-bold uppercase tracking-widest text-black">No products match your criteria.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b-3 border-black">
                            {filteredProducts.map((p, idx) => (
                                <Link key={p.id} href={`/products/${p.slug}`} className={`group ${idx < filteredProducts.length - (filteredProducts.length % 3 === 0 ? 3 : filteredProducts.length % 3) ? 'border-b-3' : ''} md:border-r-3 border-black relative flex flex-col h-full bg-white hover:bg-gray-50 transition-colors`}>
                                    {p.stock === 0 && (
                                        <div className="absolute flex top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold uppercase z-10 border-b-3 border-l-3 border-black">Sold Out</div>
                                    )}
                                    {((p as any).compare_price || p.compare_at_price) && p.stock > 0 && (
                                        <div className="absolute flex top-0 left-0 bg-accent text-black px-3 py-1 text-xs font-bold uppercase z-10 border-b-3 border-r-3 border-black">Sale</div>
                                    )}
                                    <div className="relative w-full aspect-[4/5] overflow-hidden border-b-3 border-black">
                                        {p.images?.[0] ? (
                                            <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0" style={{ backgroundImage: `url(${p.images[0].startsWith('http') ? p.images[0] : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${p.images[0]}`})` }}></div>
                                        ) : (
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                <ImageIcon className="w-10 h-10 text-gray-300" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="font-bold uppercase text-lg leading-tight mb-2 line-clamp-2">{p.name}</h3>
                                            <p className="text-xs font-bold text-gray-500 uppercase mb-4">{p.category?.name || categoryTitle}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-black border-dashed">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black">₹{Number(p.price).toFixed(0)}</span>
                                                {((p as any).compare_price || p.compare_at_price) && (
                                                    <span className="text-sm font-bold text-gray-400 line-through">₹{Number((p as any).compare_price || p.compare_at_price).toFixed(0)}</span>
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
            </div>
        </main>
    );
}
