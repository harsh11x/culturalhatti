'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/store';
import api from '@/lib/api';
import { State, City } from 'country-state-city';
import { AlertCircle, AlertTriangle, CreditCard, Lock, MapPin } from 'lucide-react';

declare global { interface Window { Razorpay: any; } }

interface Address {
    id?: string;
    name: string; phone: string; line1: string; line2: string;
    city: string; state: string; pincode: string;
}

const INITIAL_ADDR: Address = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };

function AddressField({ label, value, onChange, type = 'text', placeholder = '', maxLength }: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; maxLength?: number;
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</label>
            <input
                className="bg-transparent border-2 border-slate-900 px-4 py-3 font-bold uppercase placeholder:text-slate-400 focus:ring-0 focus:border-primary transition-colors text-slate-900 rounded-none w-full"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                maxLength={maxLength}
            />
        </div>
    );
}

export default function CheckoutPage() {
    const [address, setAddress] = useState<Address>(INITIAL_ADDR);
    const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const items = useCartStore((s) => s.items);
    const subtotal = useCartStore((s) => s.total());
    const clearCart = useCartStore((s) => s.clearCart);
    const user = useAuthStore((s) => s.user);
    const router = useRouter();
    
    const FREE_SHIPPING_THRESHOLD = 999;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 50;
    const total = subtotal + shippingCost;

    useEffect(() => {
        if (!user) router.replace('/login?redirect=/checkout');
        if (user) {
            api.get('/users/addresses').then(r => setSavedAddresses(r.data.addresses || [])).catch(() => {});
        }
    }, [user, router]);

    const indianStates = useMemo(() => State.getStatesOfCountry('IN'), []);
    const availableCities = useMemo(() => {
        if (!address.state) return [];
        return City.getCitiesOfState('IN', address.state);
    }, [address.state]);

    const validate = () => {
        const required: (keyof Address)[] = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];
        for (const f of required) {
            if (!address[f]) { setError(`${(f as string).replace('_', ' ')} is required`); return false; }
        }
        if (!/^\d{10}$/.test(address.phone)) { setError('Phone must be 10 digits'); return false; }
        if (!/^\d{6}$/.test(address.pincode)) { setError('Pincode must be 6 digits'); return false; }
        return true;
    };

    const handlePay = async () => {
        if (!user) { router.replace('/login?redirect=/checkout'); return; }
        if (items.length === 0) { setError('Cart is empty'); return; }
        if (!validate()) return;

        setLoading(true);
        setError('');

        try {
            const orderRes = await api.post('/orders', {
                items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
                shipping_address: address,
            });

            const { razorpay } = orderRes.data;

            if (!window.Razorpay) {
                await new Promise<void>((resolve) => {
                    const script = document.createElement('script');
                    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                    script.onload = resolve as any;
                    document.body.appendChild(script);
                });
            }

            const rzp = new window.Razorpay({
                key: razorpay.key_id,
                amount: razorpay.amount,
                currency: razorpay.currency,
                order_id: razorpay.order_id,
                name: 'Cultural Hatti',
                description: `Order #${orderRes.data.order.order_number}`,
                theme: { color: '#e32116' },
                prefill: { name: user.name, email: user.email, contact: address.phone },
                handler: async (response: any) => {
                    await api.post('/payments/verify', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    clearCart();
                    router.push(`/order/success/${orderRes.data.order.id}`);
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                        setError('Payment was cancelled. Your order is saved — try again.');
                    },
                },
            });
            rzp.open();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow w-full p-6 md:p-10 flex flex-col lg:flex-row gap-10 bg-background-light">
            {/* Left Column: Form */}
            <div className="flex-1 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-slate-900">Secure<br /><span className="text-primary">Checkout</span></h2>
                    <div className="h-1 w-24 bg-primary mt-2"></div>
                </div>

                <div className="bg-orange-100 border-2 border-orange-500 text-orange-900 p-4 font-bold uppercase text-sm tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-orange-600" />
                    Only online payment via Razorpay is accepted. No Cash on Delivery.
                </div>

                {error && (
                    <div className="bg-red-100 border-2 border-red-500 text-red-900 p-4 font-bold uppercase text-sm tracking-wide flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                        {error}
                    </div>
                )}

                <div className="flex flex-col border-t-2 border-slate-900 pt-8 gap-6">
                    <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tight">Shipping Address</h3>

                    {savedAddresses.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {savedAddresses.map((a) => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => setAddress({ ...a })}
                                    className="flex items-center gap-2 px-4 py-3 border-2 border-slate-900 text-left hover:border-primary hover:bg-primary/5 transition-colors"
                                >
                                    <MapPin className="w-4 h-4 shrink-0" />
                                    <span className="text-sm font-bold">{a.name} · {a.line1}, {a.city}</span>
                                </button>
                            ))}
                            <Link href="/profile?tab=addresses" className="text-sm text-primary font-bold underline">Manage addresses</Link>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AddressField label="Full Name *" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
                        <AddressField label="Phone *" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v.replace(/\D/g, '').slice(0, 10) })} type="tel" placeholder="10-digit mobile number" maxLength={10} />
                    </div>

                    <AddressField label="Address Line 1 *" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} placeholder="House/Flat No., Street" />
                    <AddressField label="Address Line 2" value={address.line2} onChange={(v) => setAddress({ ...address, line2: v })} placeholder="Area, Landmark (optional)" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">State *</label>
                            <select
                                className="bg-transparent border-2 border-slate-900 px-4 py-3 font-bold uppercase text-slate-900 rounded-none w-full focus:ring-0 focus:border-primary transition-colors appearance-none"
                                value={address.state}
                                onChange={(e) => setAddress({ ...address, state: e.target.value, city: '' })}
                            >
                                <option value="">Select State</option>
                                {indianStates.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">City *</label>
                            <select
                                className="bg-transparent border-2 border-slate-900 px-4 py-3 font-bold uppercase text-slate-900 rounded-none w-full focus:ring-0 focus:border-primary transition-colors appearance-none"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                disabled={!address.state}
                            >
                                <option value="">{address.state ? "Select City" : "Select State First"}</option>
                                {availableCities.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AddressField label="Pincode *" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} placeholder="6-digit pincode" />
                    </div>
                </div>
            </div>

            {/* Right Column: Summary Sticky */}
            <div className="w-full lg:w-[420px] shrink-0">
                <div className="lg:sticky lg:top-28 flex flex-col">
                    {/* Order Summary Card */}
                    <div className="bg-white border-2 border-slate-900 p-6 md:p-8 flex flex-col gap-6 relative">
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-8 h-8 bg-primary"></div>

                        <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tight">Order Summary</h3>

                        <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wide text-slate-600 mb-2">
                            {items.map((i) => (
                                <div key={i.product_id} className="flex justify-between items-start gap-4">
                                    <span className="truncate">{i.name} × {i.quantity}</span>
                                    <span className="text-slate-900 shrink-0">₹ {(i.price * i.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-slate-900 w-full"></div>

                        <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-wide">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="text-slate-900">₹ {subtotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className={shippingCost === 0 ? "text-green-600" : "text-slate-900"}>
                                    {shippingCost === 0 ? 'FREE' : `₹ ${shippingCost}`}
                                </span>
                            </div>
                            {subtotal < FREE_SHIPPING_THRESHOLD && (
                                <div className="text-xs text-primary bg-primary/10 p-2 border border-primary">
                                    Add ₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)} more for FREE shipping!
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-slate-900 w-full"></div>

                        <div className="flex justify-between text-xl font-black uppercase text-slate-900">
                            <span>Total Pay</span>
                            <span>₹ {total.toFixed(0)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                        onClick={handlePay}
                        disabled={loading || items.length === 0}
                        className="w-full mt-4 bg-primary hover:bg-[#c2190f] text-white h-16 text-lg font-black uppercase tracking-widest flex items-center justify-between px-8 brutalist-shadow transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none rounded-none group disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_#e32116]"
                    >
                        <span>{loading ? 'Processing...' : 'Pay with Razorpay'}</span>
                        {!loading && <CreditCard className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
                    </button>

                    {/* Secure Checkout Notice */}
                    <div className="flex flex-col items-center justify-center gap-2 mt-6 text-slate-500">
                        <div className="flex gap-2">
                            <Lock className="w-4 h-4" />
                            <p className="text-xs font-bold uppercase tracking-widest leading-relaxed text-center">
                                256-bit encrypted · Razorpay secured
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
