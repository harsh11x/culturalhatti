'use client';
import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { AdminNav } from '../../../dashboard/page';
import { AlertCircle } from 'lucide-react';

interface Category { id: string; name: string; }

export default function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [form, setForm] = useState({ id: '', name: '', description: '', price: '', compare_price: '', stock: '', category_id: '', featured: 'false', weight_grams: '', sku: '' });
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<FileList | null>(null);
    const [currentImages, setCurrentImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        adminApi.get('/categories').then(r => setCategories(r.data.categories || []));

        adminApi.get(`/products/${slug}`).then(r => {
            if (r.data.product) {
                const p = r.data.product;
                setForm({
                    id: p.id,
                    name: p.name || '',
                    description: p.description || '',
                    price: p.price ? String(p.price) : '',
                    compare_price: p.compare_price ? String(p.compare_price) : '',
                    stock: p.stock ? String(p.stock) : '0',
                    category_id: p.category_id || '',
                    featured: p.featured ? 'true' : 'false',
                    weight_grams: p.weight_grams ? String(p.weight_grams) : '',
                    sku: p.sku || ''
                });
                setCurrentImages(p.images || []);
            }
        }).catch(err => {
            setError('Failed to load product');
        }).finally(() => {
            setLoading(false);
        });
    }, [slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.category_id) { setError('Name, price, and category are required'); return; }
        setSaving(true); setError('');
        try {
            const data = new FormData();
            Object.entries(form).forEach(([k, v]) => {
                if (k !== 'id') data.append(k, v)
            });
            if (images) Array.from(images).forEach(f => data.append('images', f));
            await adminApi.put(`/products/${form.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
            router.push('/admin/products');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to update product');
        } finally { setSaving(false); }
    };

    const F = ({ label, field, type = 'text', placeholder = '' }: { label: string; field: string; type?: string; placeholder?: string }) => (
        <div className="mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
            <input
                className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
                type={type} placeholder={placeholder}
                value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
        </div>
    );

    if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center font-bold uppercase tracking-widest">Loading...</div>;

    return (
        <div className="bg-[#0a0a0a] text-gray-100 font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1000px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Edit Product</h2>
                        <p className="text-gray-400 font-mono text-sm uppercase">Update inventory details</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-primary p-4 font-mono text-primary flex items-center gap-3">
                        <AlertCircle className="shrink-0 text-primary w-5 h-5" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="border border-gray-800 bg-[#111] p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <F label="Product Name *" field="name" placeholder="e.g. Red Silk Saree" />
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category *</label>
                            <select
                                className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold uppercase tracking-widest text-sm"
                                value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary outline-none font-mono text-sm min-h-[120px]"
                            rows={4} placeholder="Describe the product details, fabric, and care instructions..."
                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                        <div>
                            <F label="Real / Original Price (₹) *" field="compare_price" type="number" placeholder="e.g. 5000" />
                        </div>
                        <div>
                            <F label="Discount Selling Price (₹) *" field="price" type="number" placeholder="e.g. 3999" />
                            {form.price && form.compare_price && Number(form.compare_price) > Number(form.price) && (
                                <p className="text-green-500 text-xs font-bold uppercase tracking-widest mt-[-16px] mb-6">
                                    {Math.round((1 - Number(form.price) / Number(form.compare_price)) * 100)}% Discount Applied
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 mt-2">
                        <F label="Stock *" field="stock" type="number" placeholder="0" />
                        <F label="SKU" field="sku" placeholder="ITEM-001" />
                        <F label="Weight (grams)" field="weight_grams" type="number" placeholder="500" />
                    </div>

                    <div className="grid grid-cols-1 gap-x-8">
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Featured</label>
                            <select
                                className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold uppercase tracking-widest text-sm"
                                value={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.value })}
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-8 p-6 border border-dashed border-gray-800 bg-[#0a0a0a]">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Replace Product Images (Leaves existing ones intact if empty)</label>
                        {currentImages.length > 0 && (
                            <div className="flex gap-2 mb-4 overflow-x-auto">
                                {currentImages.map((img, i) => (
                                    <img key={i} src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')}${img}`} alt="prod-img" className="w-16 h-16 object-cover border border-gray-800" />
                                ))}
                            </div>
                        )}
                        <input
                            type="file" multiple accept="image/*"
                            onChange={(e) => setImages(e.target.files)}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-widest file:bg-[#222] file:text-white hover:file:bg-primary transition-colors cursor-pointer"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
                        <button type="submit" className="px-8 py-4 bg-primary text-white hover:bg-black font-bold uppercase tracking-widest transition-colors border border-primary hover:text-white" disabled={saving}>
                            {saving ? 'UPDATING...' : 'UPDATE PRODUCT'}
                        </button>
                        <button type="button" className="px-8 py-4 border border-gray-800 text-gray-400 hover:text-white hover:bg-[#0a0a0a] transition-colors font-bold uppercase tracking-widest text-sm" onClick={() => router.push('/admin/products')}>
                            CANCEL
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
