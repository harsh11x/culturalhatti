'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    tracking_id?: string; courier_name?: string; shipping_address: any;
    items: { product_name: string; quantity: number; price_at_purchase: number }[];
    created_at: string;
}

export default function OrderSuccessPage() {
    const params = useParams();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        api.get(`/orders/${params.id}`).then(r => setOrder(r.data.order)).catch(() => { });
    }, [params.id]);

    if (!order) return <div className="loading-overlay">Loading order…</div>;

    return (
        <div className="container" style={{ paddingTop: 64, paddingBottom: 64, maxWidth: 600 }}>
            {/* Success header */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
                <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 64, color: 'var(--black)', letterSpacing: 2 }}>
                    Order Confirmed!
                </h1>
                <p style={{ color: 'var(--grey)', fontSize: 16, marginTop: 8 }}>
                    Order <strong>#{order.order_number}</strong> has been placed and payment verified.
                </p>
            </div>

            {/* Order details card */}
            <div className="card" style={{ marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 28, marginBottom: 20, borderBottom: 'var(--border)', paddingBottom: 10 }}>Order Details</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--light-grey)', fontSize: 14 }}>
                    <span style={{ color: 'var(--grey)', fontWeight: 700 }}>Order #</span>
                    <span style={{ fontWeight: 700 }}>{order.order_number}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--light-grey)', fontSize: 14 }}>
                    <span style={{ color: 'var(--grey)', fontWeight: 700 }}>Status</span>
                    <span className={`status-badge status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--light-grey)', fontSize: 14 }}>
                    <span style={{ color: 'var(--grey)', fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: 18 }}>₹{Number(order.total_amount).toFixed(2)}</span>
                </div>
                {order.items?.map((i, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--light-grey)', fontSize: 13 }}>
                        <span>{i.product_name} × {i.quantity}</span>
                        <span>₹{(Number(i.price_at_purchase) * i.quantity).toFixed(0)}</span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                <Link href="/profile" className="btn btn-secondary btn-lg" style={{ textAlign: 'center' }}>
                    View All Orders
                </Link>
                <Link href="/collections" className="btn btn-ghost btn-lg" style={{ textAlign: 'center', border: 'var(--border)' }}>
                    Continue Shopping
                </Link>
            </div>

            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--grey)' }}>
                A confirmation email has been sent to your registered email address.
            </p>
        </div>
    );
}
