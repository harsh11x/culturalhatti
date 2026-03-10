'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import api from '@/lib/api';
import { State, City } from 'country-state-city';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    tracking_id?: string; courier_name?: string; created_at: string;
    items: { product_name: string; quantity: number }[];
}

const CANCELLABLE_HOURS = 24;

interface SavedAddress {
    id: string;
    label?: string;
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    is_default?: boolean;
}

function ProfileContent() {
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'orders';
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [addrLoading, setAddrLoading] = useState(false);
    const [editingAddr, setEditingAddr] = useState<SavedAddress | null>(null);
    const [newAddr, setNewAddr] = useState<Partial<SavedAddress>>({});

    const fetchOrders = () => api.get('/orders').then(r => setOrders(r.data.orders || []));
    const fetchAddresses = () => api.get('/users/addresses').then(r => setAddresses(r.data.addresses || []));

    useEffect(() => {
        if (!user) { router.replace('/login?redirect=/profile'); return; }
        fetchOrders().finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (user && tab === 'addresses') fetchAddresses();
    }, [user, tab]);

    const canCancelOrder = (order: Order) => {
        if (!['pending_payment', 'confirmed'].includes(order.status)) return false;
        const orderAgeHours = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60);
        return orderAgeHours <= CANCELLABLE_HOURS;
    };

    const handleCancel = async (orderId: string) => {
        if (!confirm('Cancel this order? This cannot be undone.')) return;
        await api.post(`/orders/${orderId}/cancel`, { reason: 'Cancelled by customer' });
        setOrders(orders.map((o) => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    };

    const saveAddress = async () => {
        const a = editingAddr || newAddr;
        if (!a.name || !a.phone || !a.line1 || !a.city || !a.state || !a.pincode) return;
        setAddrLoading(true);
        try {
            if (editingAddr?.id) {
                await api.put(`/users/addresses/${editingAddr.id}`, a);
            } else {
                await api.post('/users/addresses', a);
            }
            await fetchAddresses();
            setEditingAddr(null);
            setNewAddr({});
        } finally { setAddrLoading(false); }
    };

    const deleteAddress = async (id: string) => {
        if (!confirm('Delete this address?')) return;
        await api.delete(`/users/addresses/${id}`);
        fetchAddresses();
    };

    const indianStates = State.getStatesOfCountry('IN');
    const cities = (editingAddr?.state || newAddr.state) ? City.getCitiesOfState('IN', editingAddr?.state || newAddr.state || '') : [];

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

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, borderBottom: 'var(--border)' }}>
                <Link href="/profile" className={tab !== 'addresses' ? 'font-bold border-b-2 border-black -mb-[2px] pb-2' : 'text-gray-500 hover:text-black'}>
                    Orders
                </Link>
                <Link href="/profile?tab=addresses" className={tab === 'addresses' ? 'font-bold border-b-2 border-black -mb-[2px] pb-2' : 'text-gray-500 hover:text-black'}>
                    Addresses
                </Link>
            </div>

            {tab === 'addresses' ? (
                <div>
                    <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 36, marginBottom: 20 }}>Saved Addresses</h2>
                    {addresses.map((a) => (
                        <div key={a.id} className="card" style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <p style={{ fontWeight: 900, marginBottom: 4 }}>{a.name}{a.is_default && <span className="status-badge status-confirmed" style={{ marginLeft: 8 }}>Default</span>}</p>
                                    <p style={{ color: 'var(--grey)', fontSize: 14 }}>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.pincode}</p>
                                    <p style={{ fontSize: 13, marginTop: 4 }}>{a.phone}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="btn btn-sm" onClick={() => setEditingAddr(a)}>Edit</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteAddress(a.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(editingAddr || Object.keys(newAddr).length > 0) ? (
                        <div className="card" style={{ padding: 24 }}>
                            <h3 style={{ marginBottom: 16 }}>{editingAddr ? 'Edit Address' : 'Add Address'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div><label className="block text-xs font-bold uppercase mb-1">Name</label><input type="text" className="w-full border px-3 py-2" value={editingAddr?.name ?? newAddr.name ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, name: e.target.value }) : setNewAddr({ ...newAddr, name: e.target.value })} /></div>
                                <div><label className="block text-xs font-bold uppercase mb-1">Phone</label><input type="tel" className="w-full border px-3 py-2" value={editingAddr?.phone ?? newAddr.phone ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, phone: e.target.value }) : setNewAddr({ ...newAddr, phone: e.target.value })} /></div>
                            </div>
                            <div style={{ marginBottom: 16 }}><label className="block text-xs font-bold uppercase mb-1">Address Line 1</label><input type="text" className="w-full border px-3 py-2" value={editingAddr?.line1 ?? newAddr.line1 ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, line1: e.target.value }) : setNewAddr({ ...newAddr, line1: e.target.value })} /></div>
                            <div style={{ marginBottom: 16 }}><label className="block text-xs font-bold uppercase mb-1">Address Line 2</label><input type="text" className="w-full border px-3 py-2" value={editingAddr?.line2 ?? newAddr.line2 ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, line2: e.target.value }) : setNewAddr({ ...newAddr, line2: e.target.value })} /></div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <div><label className="block text-xs font-bold uppercase mb-1">State</label><select className="w-full border px-3 py-2" value={editingAddr?.state ?? newAddr.state ?? ''} onChange={e => { const v = e.target.value; editingAddr ? setEditingAddr({ ...editingAddr, state: v, city: '' }) : setNewAddr({ ...newAddr, state: v, city: '' }); }}><option value="">Select</option>{indianStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}</select></div>
                                <div><label className="block text-xs font-bold uppercase mb-1">City</label><select className="w-full border px-3 py-2" value={editingAddr?.city ?? newAddr.city ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, city: e.target.value }) : setNewAddr({ ...newAddr, city: e.target.value })} disabled={!editingAddr?.state && !newAddr.state}><option value="">Select</option>{cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
                            </div>
                            <div style={{ marginBottom: 16 }}><label className="block text-xs font-bold uppercase mb-1">Pincode</label><input type="text" className="w-full border px-3 py-2" value={editingAddr?.pincode ?? newAddr.pincode ?? ''} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, pincode: e.target.value }) : setNewAddr({ ...newAddr, pincode: e.target.value })} /></div>
                            <div style={{ marginBottom: 16 }}><label><input type="checkbox" checked={!!(editingAddr?.is_default ?? newAddr.is_default)} onChange={e => editingAddr ? setEditingAddr({ ...editingAddr, is_default: e.target.checked }) : setNewAddr({ ...newAddr, is_default: e.target.checked })} /> Set as default</label></div>
                            <div style={{ display: 'flex', gap: 8 }}><button className="btn btn-primary" onClick={saveAddress} disabled={addrLoading}>{addrLoading ? 'Saving…' : 'Save'}</button><button className="btn" onClick={() => { setEditingAddr(null); setNewAddr({}); }}>Cancel</button></div>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setNewAddr({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })}>Add New Address</button>
                    )}
                </div>
            ) : (
                <>
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
                            <Link href={`/profile/order/${order.id}`} className="block hover:opacity-90">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                                    <div>
                                        <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 4 }}>#{order.order_number} → View invoice</p>
                                        <p style={{ color: 'var(--grey)', fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`status-badge status-${order.status}`}>{order.status.replace('_', ' ')}</span>
                                        <p style={{ fontWeight: 900, fontSize: 22, marginTop: 8 }}>₹{Number(order.total_amount).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div style={{ fontSize: 13, color: 'var(--grey)', marginBottom: order.tracking_id ? 16 : 0 }}>
                                    {order.items?.map((i, idx) => <span key={idx}>{i.product_name} × {i.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>)}
                                </div>
                                {order.tracking_id && (
                                    <div style={{ background: 'var(--light-grey)', padding: '12px 16px', border: 'var(--border)', fontSize: 14 }}>
                                        🚚 <strong>{order.courier_name}</strong> · Tracking: <strong>{order.tracking_id}</strong>
                                    </div>
                                )}
                            </Link>
                            {canCancelOrder(order) && (
                                <button className="btn btn-danger btn-sm mt-4" onClick={() => handleCancel(order.id)}>
                                    Cancel Order (24h window)
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
                </>
            )}
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="container py-16 text-center font-bold uppercase">Loading…</div>}>
            <ProfileContent />
        </Suspense>
    );
}
