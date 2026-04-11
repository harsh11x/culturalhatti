'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

type TrackItem = { product_name: string; quantity: number };

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ status_label: string; items: TrackItem[] } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const q = orderId.trim();
    if (!q) {
      setError('Enter your order ID or order number.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.get('/orders/track', { params: { order_id: q } });
      if (data?.success) {
        setResult({ status_label: data.status_label, items: data.items || [] });
      } else setError('Could not load order.');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow w-full bg-background-light min-h-screen">
      <div className="max-w-xl mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-black uppercase mb-4 border-b-3 border-black pb-4">Track Order</h1>
        <p className="text-sm font-bold text-gray-700 mb-8">
          Use the order number (e.g. CH…) or order ID from your email. Status matches what our team sets in the admin
          panel.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 mb-8">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-white border-2 border-black px-4 py-3 font-bold focus:ring-0 focus:border-primary"
            placeholder="Order number or order ID"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-black text-background-light px-8 py-4 font-black uppercase tracking-widest border-3 border-black hover:bg-primary hover:text-black transition-colors disabled:opacity-50 brutalist-shadow"
          >
            {loading ? 'Checking…' : 'Track'}
          </button>
        </form>

        {error && <div className="mb-6 p-4 border-3 border-black bg-red-100 text-sm font-bold">{error}</div>}

        {result && (
          <div className="border-3 border-black p-6 bg-white brutalist-shadow">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Status</h2>
            <p className="text-2xl font-black text-primary mb-8">{result.status_label}</p>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Products</h3>
            <ul className="space-y-2">
              {result.items.map((item, i) => (
                <li key={`${item.product_name}-${i}`} className="flex justify-between gap-4 py-2 border-b-2 border-black border-dashed font-bold text-sm">
                  <span>{item.product_name}</span>
                  <span>× {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-10 flex gap-6 text-sm font-black uppercase tracking-widest">
          <Link href="/contact" className="border-b-2 border-black hover:text-primary">
            Contact
          </Link>
          <Link href="/" className="border-b-2 border-black hover:text-primary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
