'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import ServerStatus from '@/components/ServerStatus';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '');

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        Promise.all([
            adminApi.get('/products/admin/all'),
            adminApi.get('/categories'),
        ])
            .then(([pr, cat]) => {
                setProducts(pr.data.rows || pr.data.products || []);
                setCategories(cat.data.categories || []);
            })
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('ch_admin_token');
        localStorage.removeItem('ch_admin');
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-xl font-bold uppercase tracking-widest">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        ADMIN <span className="text-primary">PANEL</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <ServerStatus />
                        <Link href="/admin/dashboard" className="text-gray-400 hover:text-primary text-sm uppercase">Dashboard</Link>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-primary uppercase tracking-widest">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold uppercase tracking-tight">Products</h2>
                    <Link href="/admin/products/new" className="px-6 py-3 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90">
                        + Add Product
                    </Link>
                </div>

                <div className="border border-gray-800 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#111] border-b border-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Image</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Name</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Category</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Price</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Stock</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No products yet. Add your first product.</td></tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.id} className="border-b border-gray-800 hover:bg-[#111]">
                                        <td className="px-4 py-3">
                                            {(p.images && p.images[0]) ? (
                                                <img src={`${API_BASE}${p.images[0]}`} alt="" className="w-16 h-16 object-cover" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No img</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium">{p.name}</td>
                                        <td className="px-4 py-3 text-gray-400">{p.category?.name || '-'}</td>
                                        <td className="px-4 py-3">₹{Number(p.price).toLocaleString()}</td>
                                        <td className="px-4 py-3">{p.stock}</td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/products/${p.id}/edit`} className="text-primary hover:underline text-sm mr-4">Edit</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
