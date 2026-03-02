'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { AdminNav } from '../../dashboard/page';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    payment_id?: string; razorpay_order_id?: string; tracking_id?: string;
    courier_name?: string; cancelled_reason?: string; refund_id?: string;
    shipping_address: any; created_at: string;
    user?: { name: string; email: string; phone: string };
    items?: { product_name: string; quantity: number; price_at_purchase: number }[];
    shipment?: { tracking_id: string; courier_name: string; tracking_url?: string };
}

const UPDATABLE_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];
const COURIERS = ['Delhivery', 'Blue Dart', 'DTDC', 'Ekart', 'Ecom Express', 'Shadowfax', 'Other'];

export default function AdminOrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [tracking, setTracking] = useState({ tracking_id: '', courier_name: '', tracking_url: '' });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');

    const refresh = () => {
        adminApi.get(`/orders/admin/${params.id}`).then(r => {
            setOrder(r.data.order);
            setNewStatus(r.data.order.status);
            if (r.data.order.tracking_id) {
                setTracking({ tracking_id: r.data.order.tracking_id, courier_name: r.data.order.courier_name || '', tracking_url: r.data.order.shipment?.tracking_url || '' });
            }
        }).finally(() => setLoading(false));
    };

    useEffect(() => { refresh(); }, [params.id]);

    const updateStatus = async () => {
        setMsg(''); setErr('');
        try {
            await adminApi.put(`/orders/admin/${params.id}/status`, { status: newStatus, cancelled_reason: cancelReason });
            setMsg('STATUS UPDATED SUCCESSFULLY');
            refresh();
        } catch (e: any) { setErr(e?.response?.data?.message || 'Error updating status'); }
    };

    const updateShipment = async () => {
        setMsg(''); setErr('');
        try {
            await adminApi.put(`/orders/admin/${params.id}/shipment`, tracking);
            setMsg('SHIPMENT UPDATED (CUSTOMER NOTIFIED VIA EMAIL)');
            refresh();
        } catch (e: any) { setErr(e?.response?.data?.message || 'Error updating shipment'); }
    };

    const triggerRefund = async () => {
        if (!confirm('TRIGGER FULL REFUND VIA RAZORPAY?')) return;
        try {
            await adminApi.post(`/orders/admin/${params.id}/refund`);
            setMsg('REFUND INITIATED SUCCESSFULLY');
            refresh();
        } catch (e: any) { setErr(e?.response?.data?.message || 'Refund failed'); }
    };

    if (loading) return <div className="min-h-screen bg-[#211211] text-white flex flex-col items-center justify-center font-display font-bold uppercase tracking-widest text-xl">Loading order...</div>;
    if (!order) return <div className="min-h-screen bg-[#211211] text-white flex flex-col items-center justify-center font-display font-bold uppercase tracking-widest text-xl">Order not found.</div>;

    const addr = typeof order.shipping_address === 'object' ? order.shipping_address : {};

    return (
        <div className="bg-[#211211] text-[#fffff0] font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#4a2b2b] pb-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
                            Order #{order.order_number}
                        </h2>
                        <p className="text-gray-400 font-mono text-sm uppercase">Placed on {new Date(order.created_at).toLocaleString('en-IN')}</p>
                    </div>
                    <span className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-widest ${order.status === 'paid' || order.status === 'delivered' ? 'bg-green-500 text-black' :
                            order.status === 'cancelled' || order.status === 'refunded' ? 'bg-red-600 text-white' :
                                'bg-yellow-500 text-black'
                        }`}>
                        {order.status.replace('_', ' ')}
                    </span>
                </div>

                {msg && (
                    <div className="bg-green-500/20 border-2 border-green-500 p-4 font-mono text-green-400 flex items-center gap-3">
                        <span className="material-symbols-outlined shrink-0 text-green-500">check_circle</span>
                        {msg}
                    </div>
                )}
                {err && (
                    <div className="bg-red-500/20 border-2 border-primary p-4 font-mono text-primary flex items-center gap-3">
                        <span className="material-symbols-outlined shrink-0 text-primary">error</span>
                        {err}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Customer Info */}
                    <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 border-b border-[#4a2b2b] pb-2">Customer Details</h3>
                        <p className="font-bold text-lg text-white mb-1">{order.user?.name || 'Guest'}</p>
                        <p className="text-gray-400 font-mono text-sm mb-1">{order.user?.email}</p>
                        <p className="text-gray-400 font-mono text-sm">{order.user?.phone}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 border-b border-[#4a2b2b] pb-2">Payment Highlights</h3>
                        <div className="flex flex-col gap-3 font-mono text-sm">
                            <div className="flex justify-between border-b border-[#4a2b2b]/50 pb-2">
                                <span className="text-gray-500 uppercase">Amount</span>
                                <strong className="text-white text-base">₹{Number(order.total_amount).toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between border-b border-[#4a2b2b]/50 pb-2">
                                <span className="text-gray-500 uppercase">Razorpay Order</span>
                                <code className="text-gray-300">{order.razorpay_order_id || '—'}</code>
                            </div>
                            <div className="flex justify-between border-b border-[#4a2b2b]/50 pb-2">
                                <span className="text-gray-500 uppercase">Payment Ref</span>
                                <code className="text-gray-300">{order.payment_id || '—'}</code>
                            </div>
                            {order.refund_id && (
                                <div className="flex justify-between text-primary font-bold">
                                    <span className="uppercase">Refund ID</span>
                                    <code>{order.refund_id}</code>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 border-b border-[#4a2b2b] pb-2">Shipping Address</h3>
                    <p className="text-gray-300 leading-relax font-mono text-sm uppercase">
                        <strong className="text-white text-base block mb-2">{addr.name}</strong>
                        {addr.line1}<br />
                        {addr.line2 && <>{addr.line2}<br /></>}
                        {addr.city}, {addr.state} - {addr.pincode}<br />
                        <span className="text-gray-500 mt-2 block">PHONE: {addr.phone}</span>
                    </p>
                </div>

                {/* Items */}
                <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8">
                    <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 border-b border-[#4a2b2b] pb-2">Order Items</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[#4a2b2b] bg-[#1a1111]/50 text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <th className="p-4 font-normal">Product</th>
                                    <th className="p-4 font-normal text-center">Qty</th>
                                    <th className="p-4 font-normal text-right">Unit Price</th>
                                    <th className="p-4 font-normal text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-[#4a2b2b] font-mono">
                                {order.items?.map((i, idx) => (
                                    <tr key={idx} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-bold">{i.product_name}</td>
                                        <td className="p-4 text-center">{i.quantity}</td>
                                        <td className="p-4 text-gray-400 text-right">₹{Number(i.price_at_purchase).toFixed(0)}</td>
                                        <td className="p-4 text-white font-bold text-right">₹{(Number(i.price_at_purchase) * i.quantity).toFixed(0)}</td>
                                    </tr>
                                ))}
                                <tr className="bg-[#1a1111]/80 border-t-2 border-[#fffff0]">
                                    <td colSpan={3} className="p-4 text-right font-bold uppercase tracking-widest text-gray-300">Total Charged</td>
                                    <td className="p-4 text-white font-black text-xl text-right">₹{Number(order.total_amount).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Update Status */}
                    <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 border-b border-[#4a2b2b] pb-2">Status Lifecycle</h3>
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Set New Status</label>
                                    <select
                                        className="w-full bg-surface-dark border border-[#4a2b2b] bg-[#1a1111] text-white px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold uppercase tracking-widest text-sm"
                                        value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        {UPDATABLE_STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                    </select>
                                </div>
                                {newStatus === 'cancelled' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Reason (Optional)</label>
                                        <input
                                            className="w-full bg-surface-dark border border-[#4a2b2b] bg-[#1a1111] text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
                                            placeholder="Why is it cancelled?"
                                            value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <button className="w-full px-5 py-4 border-2 border-[#fffff0] text-[#fffff0] hover:bg-[#fffff0] hover:text-[#211211] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 text-sm" onClick={updateStatus}>
                            <span className="material-symbols-outlined">sync</span> Update Status
                        </button>
                    </div>

                    {/* Shipment Tracking */}
                    <div className="border border-[#4a2b2b] bg-[#2a1a1a] p-6 lg:p-8 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2 pb-2 border-b border-[#4a2b2b]">Shipment Dispatch</h3>
                            <p className="text-gray-400 text-xs font-mono uppercase mb-6 leading-relaxed">Providing a tracking ID automatically sets status to "Shipped" and emails the customer.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tracking ID</label>
                                    <input
                                        className="w-full bg-surface-dark border border-[#4a2b2b] bg-[#1a1111] text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary outline-none font-mono text-sm uppercase"
                                        placeholder="AWB NUMBER"
                                        value={tracking.tracking_id} onChange={(e) => setTracking({ ...tracking, tracking_id: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Courier Partner</label>
                                    <select
                                        className="w-full bg-surface-dark border border-[#4a2b2b] bg-[#1a1111] text-white px-4 py-3 focus:ring-1 focus:ring-primary outline-none font-bold uppercase tracking-widest text-sm"
                                        value={tracking.courier_name} onChange={(e) => setTracking({ ...tracking, courier_name: e.target.value })}
                                    >
                                        <option value="">Choose Courier</option>
                                        {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tracking Link (Optional)</label>
                                <input
                                    className="w-full bg-surface-dark border border-[#4a2b2b] bg-[#1a1111] text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
                                    placeholder="https://"
                                    value={tracking.tracking_url} onChange={(e) => setTracking({ ...tracking, tracking_url: e.target.value })}
                                />
                            </div>
                        </div>
                        <button className="w-full px-5 py-4 bg-primary text-white hover:bg-red-700 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 text-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]" onClick={updateShipment}>
                            <span className="material-symbols-outlined">local_shipping</span> Save & Notify
                        </button>
                    </div>
                </div>

                {/* Danger Zone: Refund */}
                {order.payment_id && !['refunded', 'cancelled'].includes(order.status) && (
                    <div className="border-2 border-primary bg-primary/5 p-6 lg:p-8 mt-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter text-primary mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined">warning</span> Critical Action
                                </h3>
                                <p className="text-gray-300 font-mono text-sm lowercase max-w-xl">
                                    Initiating a refund will permanently reverse ₹{Number(order.total_amount).toFixed(2)} via Razorpay directly to the customer's original payment method and send them an automated email notification.
                                </p>
                            </div>
                            <button className="px-6 py-4 bg-primary text-white font-black uppercase tracking-widest hover:bg-red-700 transition-colors whitespace-nowrap shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] border border-black" onClick={triggerRefund}>
                                EXECUTE FULL REFUND
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
