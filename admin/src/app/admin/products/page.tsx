'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { AdminNav } from '../dashboard/page';
import { Search, Plus, ImageIcon } from 'lucide-react';

interface Product {
    id: string; slug: string; name: string; price: number; compare_price?: number; stock: number; is_active: boolean; images: string[];
    category?: { name: string };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetch = async () => {
        setLoading(true);
        const res = await adminApi.get('/products/admin/all', { params: { limit: 100, search } });
        setProducts(res.data.rows || []);
        setLoading(false);
    };

    useEffect(() => { fetch(); }, []);

    const deactivate = async (id: string) => {
        if (!confirm('Deactivate this product?')) return;
        await adminApi.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-100 font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Inventory</h2>
                        <p className="text-gray-400 font-mono text-sm">{products.length} PRODUCTS IN CATALOG</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="flex w-full md:w-auto">
                            <input
                                className="bg-[#111] border border-gray-800 text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary focus:outline-none w-full md:w-64 text-sm font-mono flex-1"
                                placeholder="SEARCH PRODUCTS..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetch()}
                            />
                            <button className="px-5 py-3 border border-gray-800 border-l-0 text-gray-500 hover:text-white hover:bg-[#222] uppercase text-xs font-bold transition-colors" onClick={fetch}>
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                        <Link href="/admin/products/new" className="px-5 py-3 bg-primary text-white hover:bg-black hover:text-white uppercase text-xs font-bold tracking-widest flex items-center justify-center gap-2 border border-primary transition-all rounded-none whitespace-nowrap">
                            <Plus className="w-5 h-5" /> Add Product
                        </Link>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-800 bg-[#111] overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#1a1a1a] text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="p-4 font-normal w-16">Image</th>
                                <th className="p-4 font-normal">Product</th>
                                <th className="p-4 font-normal">Category</th>
                                <th className="p-4 font-normal text-right">Stock</th>
                                <th className="p-4 font-normal text-center">Status</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-800 font-mono">
                            {loading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-600 uppercase tracking-widest font-bold">Loading inventory...</td></tr>
                            ) : products.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-600 uppercase tracking-widest font-bold">No products found.</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="w-12 h-12 border border-gray-800 bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
                                            {p.images?.[0] ? <img src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')}${p.images[0]}`} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-gray-700" />}
                                        </div>
                                    </td>
                                    <td className="p-4 text-white font-bold">{p.name}</td>
                                    <td className="p-4 text-gray-400 text-xs uppercase tracking-wider">{p.category?.name || '—'}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-white font-bold text-sm">₹{Number(p.price).toFixed(0)}</span>
                                            {p.compare_price && p.compare_price > p.price && (
                                                <div className="flex items-center gap-1 mt-1 font-mono text-xs">
                                                    <span className="text-gray-500 line-through">₹{Number(p.compare_price).toFixed(0)}</span>
                                                    <span className="text-green-500 px-1 bg-green-500/10">
                                                        -{Math.round((1 - p.price / p.compare_price) * 100)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <span className={`font-bold ${p.stock < 5 ? 'text-primary' : 'text-gray-300'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${p.is_active ? 'bg-green-500 text-black' : 'bg-red-600 text-white'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <Link href={`/admin/products/${p.slug}/edit`} className="text-xs font-bold text-white hover:text-primary uppercase tracking-wider transition-colors">Edit</Link>
                                            <button className="text-xs font-bold text-gray-500 hover:text-red-500 uppercase tracking-wider transition-colors" onClick={() => deactivate(p.id)}>Deactivate</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
