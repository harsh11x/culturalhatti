'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import api from '@/lib/api';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    tracking_id?: string; courier_name?: string; created_at: string;
    items: { product_name: string; quantity: number }[];
}

export default function ProfilePage() {
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { router.push('/login'); return; }
        api.get('/orders').then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false));
    }, [user]);

    const handleCancel = async (orderId: string) => {
        if (!confirm('Cancel this order?')) return;
        await api.post(`/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
        setOrders(orders.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    };

    if (!user) return null;

    return (
        <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
            <h1 className="section-title">My Account</h1>

            {/* Profile Info */}
            <div className="card" style={{ marginBottom: 40 }}>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ width: 72, height: 72, background: 'var(--saffron)', border: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900 }}>
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, marginBottom: 4 }}>{user.name}</h2>
                        <p style={{ color: 'var(--grey)', fontSize: 14 }}>{user.email}</p>
                    </div>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => { logout(); router.push('/'); }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Order History */}
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, marginBottom: 20, borderBottom: 'var(--border)', paddingBottom: 10 }}>Order History</h2>
            {loading ? (
                <div className="loading-overlay">Loading orders…</div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--grey)' }}>
                    <p style={{ fontSize: 20, marginBottom: 16 }}>No orders yet.</p>
                    <a href="/collections" className="btn btn-primary">Start Shopping</a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                                <div>
                                    <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>#{order.order_number}</p>
                                    <p style={{ color: 'var(--grey)', fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`status-badge status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                                    <p style={{ fontWeight: 900, fontSize: 22, marginTop: 8 }}>₹{Number(order.total_amount).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div style={{ fontSize: 13, color: 'var(--grey)', marginBottom: 16 }}>
                                {order.items?.map((i, idx) => <span key={idx}>{i.product_name} × {i.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>)}
                            </div>

                            {/* Tracking */}
                            {order.tracking_id && (
                                <div style={{ background: 'var(--light-grey)', padding: '12px 16px', border: 'var(--border)', marginBottom: 16, fontSize: 14 }}>
                                    🚚 <strong>{order.courier_name}</strong> · Tracking: <strong>{order.tracking_id}</strong>
                                </div>
                            )}

                            {/* Actions */}
                            {['pending_payment', 'confirmed'].includes(order.status) && (
                                <button className="btn btn-danger btn-sm" onClick={() => handleCancel(order.id)}>
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
