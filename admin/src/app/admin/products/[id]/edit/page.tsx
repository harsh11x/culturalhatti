'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    const [categories, setCategories] = useState<any[]>([]);
    const [product, setProduct] = useState<any>(null);
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
    const [variations, setVariations] = useState<{name: string, options: {value: string, image?: string, imageIndex?: number}[]}[]>([]);
    const router = useRouter();

    const addVariation = () => setVariations([...variations, { name: '', options: [] }]);
    const removeVariation = (index: number) => setVariations(variations.filter((_, i) => i !== index));
    const updateVariationName = (index: number, name: string) => {
        const newV = [...variations];
        newV[index].name = name;
        setVariations(newV);
    };
    const addOption = (vIndex: number) => {
        const newV = [...variations];
        newV[vIndex].options.push({ value: '' });
        setVariations(newV);
    };
    const updateOption = (vIndex: number, oIndex: number, value: string) => {
        const newV = [...variations];
        newV[vIndex].options[oIndex].value = value;
        setVariations(newV);
    };
    const updateOptionImage = (vIndex: number, oIndex: number, imgIndex: string) => {
        const newV = [...variations];
        newV[vIndex].options[oIndex].imageIndex = imgIndex === '' ? undefined : parseInt(imgIndex);
        setVariations(newV);
    };
    const removeOption = (vIndex: number, oIndex: number) => {
        const newV = [...variations];
        newV[vIndex].options = newV[vIndex].options.filter((_, i) => i !== oIndex);
        setVariations(newV);
    };

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        Promise.all([
            adminApi.get(`/products/admin/${id}`),
            adminApi.get('/categories'),
        ])
            .then(([pr, cat]) => {
                setProduct(pr.data.product);
                setCategories(cat.data.categories || []);
                const p = pr.data.product;
                if (p.variations && Array.isArray(p.variations)) {
                    setVariations(p.variations.map((v: any) => ({
                        name: v.name || '',
                        options: Array.isArray(v.options) ? v.options.map((o: any) => {
                            if (typeof o === 'string') return { value: o };
                            return { value: o.value, image: o.image };
                        }) : []
                    })));
                } else {
                    setVariations([]);
                }
                setForm({
                    name: p.name || '',
                    description: p.description || '',
                    price: String(p.price || ''),
                    compare_price: String(p.compare_price || ''),
                    stock: String(p.stock ?? '0'),
                    category_id: p.category_id || '',
                    featured: p.featured || false,
                    sku: p.sku || '',
                });
            })
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [id, router]);

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
            
            if (variations.length > 0) {
                const cleanVariations = variations
                    .map(v => ({
                        name: v.name.trim(),
                        options: v.options.map(o => ({
                            value: o.value.trim(),
                            image: o.image,
                            imageIndex: o.imageIndex
                        })).filter(o => o.value)
                    }))
                    .filter(v => v.name && v.options.length > 0);
                fd.append('variations', JSON.stringify(cleanVariations));
            } else {
                fd.append('variations', '[]');
            }
            images.forEach((file) => fd.append('images', file));

            await adminApi.put(`/products/${id}`, fd);
            window.location.href = '/admin/products';
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to update product');
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
        <div className="min-h-screen text-white overflow-x-hidden">
            <main className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
                <Link href="/admin/products" className="inline-block text-gray-400 hover:text-primary text-sm uppercase mb-6">← Back to Products</Link>
                <h2 className="text-3xl font-bold uppercase mb-6">Edit Product</h2>
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
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Variations Section */}
                    <div className="border border-gray-700 p-4 bg-[#111]">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-400">Variations (Optional)</label>
                            <button type="button" onClick={addVariation} className="text-xs bg-gray-800 text-white px-3 py-1 hover:bg-gray-700">
                                + Add Variation
                            </button>
                        </div>
                        {variations.length === 0 && <p className="text-xs text-gray-500 italic">No variations added. (e.g. Size, Color)</p>}
                        {variations.map((v, i) => (
                            <div key={i} className="mb-6 pb-6 border-b border-gray-800 last:border-0 last:pb-0">
                                <div className="flex gap-4 mb-4 items-center">
                                    <input 
                                        type="text" 
                                        placeholder="Variation Name (e.g. Color)" 
                                        value={v.name} 
                                        onChange={e => updateVariationName(i, e.target.value)} 
                                        className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm" 
                                    />
                                    <button type="button" onClick={() => removeVariation(i)} className="text-red-400 text-sm hover:text-red-300">✕</button>
                                </div>
                                <div className="ml-4 space-y-3">
                                    {v.options.map((opt, oi) => (
                                        <div key={oi} className="flex gap-4 items-center">
                                            <div className="flex-1 flex flex-col gap-1">
                                                <input 
                                                    type="text" 
                                                    placeholder="Option (e.g. Red)" 
                                                    value={opt.value} 
                                                    onChange={e => updateOption(i, oi, e.target.value)} 
                                                    className="w-full px-3 py-2 bg-black border border-gray-700 text-white text-sm" 
                                                />
                                                {opt.image && <p className="text-[10px] text-gray-500 truncate">Current: {opt.image}</p>}
                                            </div>
                                            <select 
                                                value={opt.imageIndex ?? ''} 
                                                onChange={e => updateOptionImage(i, oi, e.target.value)}
                                                className="flex-1 px-3 py-2 bg-black border border-gray-700 text-white text-sm"
                                            >
                                                <option value="">{opt.image ? 'Keep Existing Image' : 'No Image'}</option>
                                                {images.map((img, imgI) => (
                                                    <option key={imgI} value={imgI}>New Image {imgI + 1} ({img.name})</option>
                                                ))}
                                            </select>
                                            <button type="button" onClick={() => removeOption(i, oi)} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addOption(i)} className="text-[10px] uppercase tracking-wider text-primary hover:underline">+ Add Option</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">New Images (optional, replaces existing)</label>
                        <input type="file" accept="image/*,video/*,.heic,.heif,.mp4,.mov,.webm,.avi,.mkv,.m4v,.jpg,.jpeg,.png,.gif,.webp" multiple onChange={e => setImages(Array.from(e.target.files || []))} className="w-full px-4 py-3 bg-[#111] border border-gray-700 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                        <label className="text-sm text-gray-400">Featured product</label>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Update Product'}
                        </button>
                        <Link href="/admin/products" className="px-6 py-3 border border-gray-600 text-gray-400 hover:text-white uppercase tracking-widest">Cancel</Link>
                        <button
                            type="button"
                            onClick={async () => {
                                if (!confirm('Permanently delete this product?')) return;
                                try {
                                    await adminApi.delete(`/products/${id}`);
                                    window.location.href = '/admin/products';
                                } catch (err: any) { 
                                    setError(err.response?.data?.message || err.message || 'Could not delete product'); 
                                }
                            }}
                            className="px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white uppercase tracking-widest"
                        >
                            Delete Product
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
