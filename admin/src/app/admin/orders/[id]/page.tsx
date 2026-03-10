'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function OrderDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState('');
    const [trackingId, setTrackingId] = useState('');
    const [courierName, setCourierName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        adminApi.get(`/orders/admin/${id}`)
            .then(r => {
                setOrder(r.data.order);
                setStatus(r.data.order?.status || '');
                setTrackingId(r.data.order?.tracking_id || '');
                setCourierName(r.data.order?.courier_name || '');
            })
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleStatusUpdate = async (overrideStatus?: string) => {
        const s = overrideStatus ?? status;
        if (!s) return;
        setUpdating(true);
        try {
            await adminApi.put(`/orders/admin/${id}/status`, { status: s });
            setOrder((o: any) => o ? { ...o, status: s } : null);
            setStatus(s);
        } finally {
            setUpdating(false);
        }
    };

    const handleShipmentUpdate = async () => {
        setUpdating(true);
        try {
            const r = await adminApi.put(`/orders/admin/${id}/shipment`, {
                tracking_id: trackingId,
                courier_name: courierName,
            });
            setOrder((o: any) => o ? { ...o, ...r.data.order } : null);
        } finally {
            setUpdating(false);
        }
    };

    if (loading || !order) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-xl font-bold uppercase tracking-widest">{loading ? 'Loading...' : 'Order not found'}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white overflow-x-hidden">
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                <Link href="/admin/orders" className="inline-block text-gray-400 hover:text-primary text-sm uppercase">← Back to Orders</Link>
                <div>
                    <h2 className="text-3xl font-bold uppercase">Order {order.order_number}</h2>
                    <p className="text-gray-400 mt-1">Status: <span className="text-primary font-bold">{order.status}</span></p>
                </div>

                <div className="border border-gray-800 bg-[#111] p-6 space-y-4">
                    <h3 className="text-lg font-bold">Customer</h3>
                    <p>{order.user?.name}</p>
                    <p className="text-gray-400">{order.user?.email}</p>
                    {order.user?.phone && <p className="text-gray-400">{order.user.phone}</p>}
                    {order.shipping_address && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                            <p className="text-sm text-gray-400">Shipping Address</p>
                            <p>{typeof order.shipping_address === 'string' ? order.shipping_address : JSON.stringify(order.shipping_address)}</p>
                        </div>
                    )}
                </div>

                <div className="border border-gray-800 bg-[#111] p-6">
                    <h3 className="text-lg font-bold mb-4">Items</h3>
                    <ul className="space-y-3">
                        {order.items?.map((item: any) => (
                            <li key={item.id} className="flex justify-between">
                                <span>{item.product_name} x {item.quantity}</span>
                                <span>₹{(Number(item.price_at_purchase) * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 pt-4 border-t border-gray-800 font-bold">Total: ₹{Number(order.total_amount).toLocaleString()}</p>
                </div>

                <div className="border border-gray-800 bg-[#111] p-6 space-y-4">
                    <h3 className="text-lg font-bold">Update Status</h3>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 text-white">
                        <option value="pending_payment">Pending Payment</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <button onClick={handleStatusUpdate} disabled={updating} className="ml-4 px-4 py-2 bg-primary text-white uppercase text-sm font-bold">Update</button>
                </div>

                {(order.status === 'confirmed' || order.status === 'processing') && (
                    <div className="border border-gray-800 bg-[#111] p-6 space-y-4">
                        <h3 className="text-lg font-bold">Add Shipment</h3>
                        <input type="text" placeholder="Tracking ID" value={trackingId} onChange={e => setTrackingId(e.target.value)} className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 text-white w-full" />
                        <input type="text" placeholder="Courier Name" value={courierName} onChange={e => setCourierName(e.target.value)} className="px-4 py-2 bg-[#0a0a0a] border border-gray-700 text-white w-full" />
                        <button onClick={handleShipmentUpdate} disabled={updating} className="px-4 py-2 bg-primary text-white uppercase text-sm font-bold">Mark Shipped</button>
                    </div>
                )}

                {order.status === 'shipped' && (
                    <div className="border border-gray-800 bg-[#111] p-6">
                        <h3 className="text-lg font-bold mb-2">Delivery</h3>
                        <button
                            onClick={() => handleStatusUpdate('delivered')}
                            disabled={updating}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white uppercase text-sm font-bold"
                        >
                            Mark as Delivered
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
