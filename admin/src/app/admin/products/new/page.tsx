'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import ServerStatus from '@/components/ServerStatus';

export default function NewProductPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        compare_price: '',
        stock: '0',
        category_id: '',
        featured: false,
        sku: '',
    });
    const [images, setImages] = useState<File[]>([]);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        adminApi.get('/categories')
            .then(r => setCategories(r.data.categories || []))
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('description', form.description);
            fd.append('price', form.price);
            if (form.compare_price) fd.append('compare_price', form.compare_price);
            fd.append('stock', form.stock);
            fd.append('category_id', form.category_id);
            fd.append('featured', String(form.featured));
            if (form.sku) fd.append('sku', form.sku);
            images.forEach((file) => fd.append('images', file));

            const token = localStorage.getItem('ch_admin_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
            const res = await fetch(`${apiUrl}/products`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create product');
            router.push('/admin/products');
        } catch (err: any) {
            setError(err.message || 'Failed to create product');
        } finally {
            setSaving(false);
        }
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
                    <h1 className="text-2xl font-bold tracking-tight">ADMIN <span className="text-primary">PANEL</span></h1>
                    <div className="flex items-center gap-4">
                        <ServerStatus />
                        <Link href="/admin/products" className="text-gray-400 hover:text-primary text-sm uppercase">← Products</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold uppercase mb-6">Add Product</h2>
                {error && <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹) *</label>
                            <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Compare Price (₹)</label>
                            <input type="number" step="0.01" min="0" value={form.compare_price} onChange={e => setForm({ ...form, compare_price: e.target.value })} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Stock *</label>
                            <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                            <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" required>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Images</label>
                        <input type="file" accept="image/*" multiple onChange={e => setImages(Array.from(e.target.files || []))} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                        <label className="text-sm text-gray-400">Featured product</label>
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Create Product'}
                        </button>
                        <Link href="/admin/products" className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-white uppercase tracking-widest">Cancel</Link>
                    </div>
                </form>
            </main>
        </div>
    );
}
