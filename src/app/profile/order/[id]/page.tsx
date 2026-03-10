'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import api from '@/lib/api';

interface ReturnRequest { id: string; status: string; reason: string; created_at: string }
interface Order {
    id: string; order_number: string; status: string; total_amount: number; payment_id?: string;
    tracking_id?: string; courier_name?: string; created_at: string; shipping_address: any;
    items: { product_name: string; quantity: number; price_at_purchase: number }[];
    return_requests?: ReturnRequest[];
}

const CANCELLABLE_HOURS = 24;

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [returning, setReturning] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) { router.replace('/login?redirect=/profile'); return; }
        api.get(`/orders/${params.id}`)
            .then((r) => setOrder(r.data.order))
            .catch(() => setOrder(null))
            .finally(() => setLoading(false));
    }, [user, params.id, router]);

    const canCancel = () => {
        if (!order) return false;
        if (!['pending_payment', 'confirmed'].includes(order.status)) return false;
        const orderAgeHours = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
        return orderAgeHours <= CANCELLABLE_HOURS;
    };

    const handleCancel = async () => {
        if (!order || !canCancel()) return;
        if (!confirm('Cancel this order? This cannot be undone.')) return;
        setCancelling(true);
        setError('');
        try {
            await api.post(`/orders/${order.id}/cancel`, { reason: 'Cancelled by customer' });
            setOrder({ ...order, status: 'cancelled' });
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to cancel');
        } finally {
            setCancelling(false);
        }
    };

    const handlePrintInvoice = () => window.print();

    const canRequestReturn = order && ['shipped', 'delivered'].includes(order.status) && !(order.return_requests && order.return_requests.length > 0);
    const returnRequest = order?.return_requests?.[0];

    const handleReturnRequest = async () => {
        if (!order || !returnReason.trim()) return;
        setReturning(true);
        setError('');
        try {
            await api.post(`/orders/${order.id}/return`, { reason: returnReason.trim() });
            const r = await api.get(`/orders/${order.id}`);
            setOrder(r.data.order);
            setReturnReason('');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to submit return request');
        } finally {
            setReturning(false);
        }
    };

    if (!user) return null;
    if (loading) return <div className="container py-16 text-center font-bold uppercase">Loading order…</div>;
    if (!order) return <div className="container py-16 text-center"><p className="mb-4">Order not found.</p><Link href="/profile" className="text-primary underline">Back to Profile</Link></div>;

    const addr = order.shipping_address || {};
    const orderAgeHours = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);

    return (
        <div className="container py-8 md:py-12 max-w-3xl">
            <Link href="/profile" className="inline-block text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary mb-8">← Back to Orders</Link>

            {/* Invoice-style card (print-friendly) */}
            <div className="bg-white border-2 border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Cultural Hatti</h1>
                        <p className="text-sm text-gray-500 uppercase tracking-widest mt-1">Order Invoice</p>
                    </div>
                    <div className="text-right">
                        <p className="font-mono font-bold text-lg">#{order.order_number}</p>
                        <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold uppercase border-2 border-black ${order.status === 'cancelled' || order.status === 'refunded' ? 'bg-red-100' : order.status === 'delivered' ? 'bg-green-100' : 'bg-amber-100'}`}>
                            {order.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid gap-6 mb-8">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Order Date</p>
                        <p className="font-bold">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    {order.payment_id && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Payment ID</p>
                            <p className="font-mono text-sm">{order.payment_id}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Shipping Address</p>
                        <p className="font-medium">
                            {addr.name}{addr.phone ? ` · ${addr.phone}` : ''}<br />
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
                            {addr.city}, {addr.state} {addr.pincode}
                        </p>
                    </div>
                </div>

                {/* Items */}
                <div className="border-t-2 border-black pt-6 mb-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Items</p>
                    {order.items?.map((i, idx) => (
                        <div key={idx} className="flex justify-between py-2 border-b border-gray-200">
                            <span>{i.product_name} × {i.quantity}</span>
                            <span className="font-bold">₹{(Number(i.price_at_purchase) * i.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between text-xl font-black uppercase border-t-2 border-black pt-4">
                    <span>Total</span>
                    <span>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>

                {/* Tracking */}
                {order.tracking_id && (
                    <div className="mt-6 p-4 bg-gray-50 border-2 border-black">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Tracking</p>
                        <p className="font-bold">{order.courier_name || 'Courier'}: {order.tracking_id}</p>
                    </div>
                )}

                {returnRequest && (
                    <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-500">
                        <p className="text-xs font-bold uppercase tracking-widest text-amber-800 mb-1">Return Request</p>
                        <p className="font-medium">{returnRequest.reason}</p>
                        <p className="text-sm text-amber-700 mt-1">Status: {returnRequest.status}</p>
                    </div>
                )}

                {canRequestReturn && (
                    <div className="mt-6 p-4 border-2 border-black">
                        <p className="text-xs font-bold uppercase tracking-widest mb-2">Request Return / Refund</p>
                        <textarea value={returnReason} onChange={e => setReturnReason(e.target.value)} placeholder="Reason for return" className="w-full border-2 border-black px-3 py-2 mb-2 min-h-[80px]" />
                        <button onClick={handleReturnRequest} disabled={returning || !returnReason.trim()} className="px-4 py-2 bg-amber-500 text-black font-bold uppercase text-sm hover:bg-amber-600 disabled:opacity-50">
                            {returning ? 'Submitting…' : 'Submit Return Request'}
                        </button>
                    </div>
                )}

                {error && <p className="mt-4 text-red-600 text-sm font-bold">{error}</p>}

                {/* Actions */}
                <div className="flex flex-wrap gap-4 mt-8 print:hidden">
                    {canCancel() && (
                        <button onClick={handleCancel} disabled={cancelling} className="px-6 py-2 bg-red-500 text-white font-bold uppercase text-sm hover:bg-red-600 disabled:opacity-50">
                            {cancelling ? 'Cancelling…' : 'Cancel Order'}
                        </button>
                    )}
                    {!canCancel() && ['pending_payment', 'confirmed'].includes(order.status) && orderAgeHours > CANCELLABLE_HOURS && (
                        <p className="text-sm text-gray-500">24-hour cancellation window has passed.</p>
                    )}
                    <button onClick={handlePrintInvoice} className="px-6 py-2 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white print:hidden">
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
