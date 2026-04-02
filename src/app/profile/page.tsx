'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import api from '@/lib/api';
import { State, City } from 'country-state-city';
import { LogOut, Package, MapPin, Plus, Pencil, Trash2, Truck, ChevronRight, X, Check } from 'lucide-react';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    tracking_id?: string; courier_name?: string; created_at: string;
    items: { product_name: string; quantity: number }[];
}

const CANCELLABLE_HOURS = 24;

interface SavedAddress {
    id: string; label?: string; name: string; phone: string;
    line1: string; line2?: string; city: string; state: string;
    pincode: string; is_default?: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    pending_payment: { label: 'Pending Payment', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-400' },
    confirmed:       { label: 'Confirmed',        color: 'text-blue-700',   bg: 'bg-blue-100 border-blue-400' },
    processing:      { label: 'Processing',       color: 'text-indigo-700', bg: 'bg-indigo-100 border-indigo-400' },
    shipped:         { label: 'Shipped',          color: 'text-purple-700', bg: 'bg-purple-100 border-purple-400' },
    delivered:       { label: 'Delivered',        color: 'text-green-700',  bg: 'bg-green-100 border-green-400' },
    cancelled:       { label: 'Cancelled',        color: 'text-red-700',    bg: 'bg-red-100 border-red-400' },
    refunded:        { label: 'Refunded',         color: 'text-slate-700',  bg: 'bg-slate-100 border-slate-400' },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] || { label: status, color: 'text-slate-700', bg: 'bg-slate-100 border-slate-400' };
    return (
        <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
        </span>
    );
}

function AddressForm({
    data, setData, onSave, onCancel, loading, indianStates, cities
}: {
    data: Partial<SavedAddress>;
    setData: (v: Partial<SavedAddress>) => void;
    onSave: () => void;
    onCancel: () => void;
    loading: boolean;
    indianStates: { isoCode: string; name: string }[];
    cities: { name: string }[];
}) {
    const f = (field: keyof SavedAddress) => ({
        value: (data[field] as string) ?? '',
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            setData({ ...data, [field]: e.target.value }),
    });
    return (
        <div className="border-2 border-slate-900 bg-white p-6 flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name *</label>
                    <input {...f('name')} type="text" className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone *</label>
                    <input {...f('phone')} type="tel" className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none" />
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address Line 1 *</label>
                <input {...f('line1')} type="text" placeholder="House/Flat No., Street" className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none" />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Address Line 2</label>
                <input {...f('line2')} type="text" placeholder="Area, Landmark (optional)" className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">State *</label>
                    <select {...f('state')} onChange={e => setData({ ...data, state: e.target.value, city: '' })} className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none bg-white appearance-none">
                        <option value="">Select</option>
                        {indianStates.map(s => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">City *</label>
                    <select {...f('city')} disabled={!data.state} className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none bg-white appearance-none disabled:opacity-50">
                        <option value="">Select</option>
                        {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pincode *</label>
                    <input {...f('pincode')} type="text" maxLength={6} className="border-2 border-slate-900 px-3 py-2.5 font-bold uppercase text-sm focus:border-primary outline-none" />
                </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={!!data.is_default} onChange={e => setData({ ...data, is_default: e.target.checked })} className="w-4 h-4 accent-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Set as default address</span>
            </label>
            <div className="flex gap-3 pt-2">
                <button onClick={onSave} disabled={loading} className="flex items-center gap-2 bg-primary text-white px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-[#c2190f] transition-colors disabled:opacity-50">
                    <Check className="w-4 h-4" />
                    {loading ? 'Saving…' : 'Save Address'}
                </button>
                <button onClick={onCancel} className="flex items-center gap-2 border-2 border-slate-900 px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-colors">
                    <X className="w-4 h-4" />
                    Cancel
                </button>
            </div>
        </div>
    );
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
    const [showNewForm, setShowNewForm] = useState(false);
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
        return (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60) <= CANCELLABLE_HOURS;
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
            setShowNewForm(false);
            setNewAddr({});
        } finally { setAddrLoading(false); }
    };

    const deleteAddress = async (id: string) => {
        if (!confirm('Delete this address?')) return;
        await api.delete(`/users/addresses/${id}`);
        fetchAddresses();
    };

    const indianStates = State.getStatesOfCountry('IN');
    const editCities = editingAddr?.state ? City.getCitiesOfState('IN', editingAddr.state) : [];
    const newCities = newAddr.state ? City.getCitiesOfState('IN', newAddr.state) : [];

    if (!user) return null;

    const initials = user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

    return (
        <main className="flex-grow bg-[#FDFBF7] w-full">
            {/* Profile Hero Header */}
            <div className="w-full bg-background-dark text-white px-6 md:px-16 py-12 md:py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }}
                />
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Avatar */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-primary flex items-center justify-center text-white text-3xl md:text-4xl font-black border-4 border-white/20 shrink-0">
                        {initials}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                        <p className="text-primary text-xs font-bold uppercase tracking-[0.3em] mb-1">My Account</p>
                        <h1 className="text-3xl md:text-5xl font-black uppercase leading-tight tracking-tight text-white">{user.name}</h1>
                        <p className="text-white/50 text-sm font-medium mt-1">{user.email}</p>
                    </div>
                    {/* Logout */}
                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className="flex items-center gap-2 px-5 py-3 border-2 border-white/20 text-white/70 hover:border-primary hover:text-primary transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="w-full border-b-2 border-slate-900 bg-white">
                <div className="max-w-5xl mx-auto px-6 md:px-16 flex gap-0">
                    <Link
                        href="/profile"
                        className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-colors ${tab !== 'addresses' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                    >
                        <Package className="w-4 h-4" />
                        Orders
                        {orders.length > 0 && (
                            <span className="ml-1 bg-primary text-white text-[10px] font-black px-1.5 py-0.5 min-w-[20px] text-center">
                                {orders.length}
                            </span>
                        )}
                    </Link>
                    <Link
                        href="/profile?tab=addresses"
                        className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest border-b-4 transition-colors ${tab === 'addresses' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
                    >
                        <MapPin className="w-4 h-4" />
                        Addresses
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 md:px-16 py-10">

                {/* ── ORDERS TAB ── */}
                {tab !== 'addresses' && (
                    <>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-slate-900">Order<br /><span className="text-primary">History</span></h2>
                                <div className="h-1 w-16 bg-primary mt-2" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                                <div className="w-20 h-20 border-4 border-slate-200 flex items-center justify-center">
                                    <Package className="w-10 h-10 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">No Orders Yet</p>
                                    <p className="text-sm text-slate-500">Start shopping to see your orders here.</p>
                                </div>
                                <Link href="/collections" className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm hover:bg-[#c2190f] transition-colors">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white border-2 border-slate-900 hover:border-primary transition-colors group">
                                        <Link href={`/profile/order/${order.id}`} className="block p-5 md:p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <p className="text-xs font-black uppercase tracking-widest text-slate-500">#{order.order_number}</p>
                                                        <StatusBadge status={order.status} />
                                                    </div>
                                                    <p className="text-slate-500 text-xs font-medium mb-3">
                                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-sm text-slate-600 line-clamp-1">
                                                        {order.items?.map((i, idx) => (
                                                            <span key={idx}>{i.product_name} × {i.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
                                                        ))}
                                                    </p>
                                                    {order.tracking_id && (
                                                        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-2 w-fit">
                                                            <Truck className="w-3.5 h-3.5" />
                                                            {order.courier_name} · {order.tracking_id}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 shrink-0">
                                                    <p className="text-2xl font-black tracking-tight text-slate-900">₹{Number(order.total_amount).toFixed(0)}</p>
                                                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                                                </div>
                                            </div>
                                        </Link>
                                        {canCancelOrder(order) && (
                                            <div className="px-5 md:px-6 pb-5 pt-0">
                                                <button
                                                    onClick={() => handleCancel(order.id)}
                                                    className="text-xs font-black uppercase tracking-widest text-red-600 border-2 border-red-200 px-4 py-2 hover:bg-red-50 transition-colors"
                                                >
                                                    Cancel Order (24h window)
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* ── ADDRESSES TAB ── */}
                {tab === 'addresses' && (
                    <>
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight tracking-tight text-slate-900">Saved<br /><span className="text-primary">Addresses</span></h2>
                                <div className="h-1 w-16 bg-primary mt-2" />
                            </div>
                            {!showNewForm && !editingAddr && (
                                <button
                                    onClick={() => { setShowNewForm(true); setNewAddr({}); }}
                                    className="flex items-center gap-2 bg-primary text-white px-5 py-3 font-black uppercase tracking-widest text-xs hover:bg-[#c2190f] transition-colors"
                                >
                                    <Plus className="w-4 h-4" /> Add Address
                                </button>
                            )}
                        </div>

                        {showNewForm && !editingAddr && (
                            <div className="mb-6">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">New Address</p>
                                <AddressForm
                                    data={newAddr} setData={setNewAddr}
                                    onSave={saveAddress} onCancel={() => { setShowNewForm(false); setNewAddr({}); }}
                                    loading={addrLoading} indianStates={indianStates} cities={newCities}
                                />
                            </div>
                        )}

                        {addresses.length === 0 && !showNewForm ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                                <div className="w-20 h-20 border-4 border-slate-200 flex items-center justify-center">
                                    <MapPin className="w-10 h-10 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">No Addresses Saved</p>
                                    <p className="text-sm text-slate-500">Add an address to speed up checkout.</p>
                                </div>
                                <button onClick={() => setShowNewForm(true)} className="px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm hover:bg-[#c2190f] transition-colors flex items-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Address
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {addresses.map((a) => (
                                    <div key={a.id}>
                                        {editingAddr?.id === a.id ? (
                                            <div className="mb-2">
                                                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Edit Address</p>
                                                <AddressForm
                                                    data={editingAddr} setData={(v) => setEditingAddr(v as SavedAddress)}
                                                    onSave={saveAddress} onCancel={() => setEditingAddr(null)}
                                                    loading={addrLoading} indianStates={indianStates} cities={editCities}
                                                />
                                            </div>
                                        ) : (
                                            <div className="bg-white border-2 border-slate-900 p-5 md:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 bg-primary/10 border-2 border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                                                        <MapPin className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <p className="font-black uppercase text-sm text-slate-900">{a.name}</p>
                                                            {a.is_default && (
                                                                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary text-white border border-primary">Default</span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                                                        <p className="text-sm text-slate-600">{a.city}, {a.state} – {a.pincode}</p>
                                                        <p className="text-xs text-slate-500 mt-1 font-medium">{a.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button onClick={() => { setEditingAddr(a); setShowNewForm(false); }}
                                                        className="flex items-center gap-1.5 border-2 border-slate-300 px-4 py-2 text-xs font-black uppercase tracking-widest hover:border-slate-900 transition-colors">
                                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button onClick={() => deleteAddress(a.id)}
                                                        className="flex items-center gap-1.5 border-2 border-red-200 text-red-600 px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-colors">
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="flex-grow flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
