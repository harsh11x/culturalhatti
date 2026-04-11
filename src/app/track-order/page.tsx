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
      setError('Please enter your order ID or order number.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.get('/orders/track', { params: { order_id: q } });
      if (data?.success) {
        setResult({
          status_label: data.status_label,
          items: data.items || [],
        });
      } else {
        setError('Could not load order status.');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full bg-background-light min-h-screen">
      <div className="max-w-xl mx-auto px-6 py-16 md:py-24">
        <p className="font-body text-xs uppercase tracking-[0.3em] text-secondary mb-3 font-medium">खोज • Track</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-background-dark mb-4">Track your order</h1>
        <p className="font-body text-sm text-gray-600 mb-10 leading-relaxed">
          Enter the <strong>order number</strong> (for example CH…) or the <strong>order ID</strong> from your confirmation
          email. You will see the current status set by our team and the products on this order only.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 font-body mb-10">
          <label htmlFor="track-order-id" className="sr-only">
            Order ID or order number
          </label>
          <input
            id="track-order-id"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-white border border-background-dark/20 px-4 py-3 text-sm focus:ring-0 focus:border-primary transition-colors"
            placeholder="Order number or order ID"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-10 py-4 bg-primary text-background-dark font-semibold uppercase tracking-[0.2em] text-sm hover:bg-accent transition-colors disabled:opacity-60 luxury-shadow"
          >
            {loading ? 'Checking…' : 'Track order'}
          </button>
        </form>

        {error && <div className="mb-8 p-4 border border-red-300 bg-red-50 font-body text-sm text-red-900">{error}</div>}

        {result && (
          <div className="border border-background-dark/15 bg-white p-6 md:p-8 luxury-shadow font-body">
            <h2 className="font-display text-xl font-bold text-background-dark mb-2">Order status</h2>
            <p className="text-2xl font-semibold text-primary mb-8">{result.status_label}</p>

            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-4">Products on this order</h3>
            {result.items.length === 0 ? (
              <p className="text-sm text-gray-600">No line items found for this order.</p>
            ) : (
              <ul className="space-y-3">
                {result.items.map((item, i) => (
                  <li
                    key={`${item.product_name}-${i}`}
                    className="flex justify-between gap-4 py-3 border-b border-background-dark/10 text-sm"
                  >
                    <span className="text-background-dark font-medium">{item.product_name}</span>
                    <span className="text-gray-600 shrink-0">× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="mt-12 font-body text-sm text-gray-500">
          <Link href="/contact" className="text-primary hover:underline mr-4">
            Contact us
          </Link>
          <Link href="/" className="text-primary hover:underline">
            ← Home
          </Link>
        </p>
      </div>
    </main>
  );
}
