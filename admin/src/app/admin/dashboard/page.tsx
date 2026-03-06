'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        Promise.all([
            adminApi.get('/users/admin/analytics').then(r => r.data.analytics).catch(() => ({ total_revenue: '0', total_paid_orders: 0, pending_payments: 0, total_users: 0 })),
            adminApi.get('/orders/admin/all', { params: { since: '24h', limit: 20 } }).then(r => r.data.rows || []).catch(() => []),
        ]).then(([a, o]) => {
            setAnalytics(a);
            setRecentOrders(o);
        }).finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-xl font-bold uppercase tracking-widest">Loading...</div>
            </div>
        );
    }

    const revenue = analytics?.total_revenue || '0';
    const revenueLakhs = (Number(revenue) / 100000).toFixed(1);

    return (
        <div className="min-h-screen text-white overflow-x-hidden">
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold uppercase tracking-tight mb-2">Dashboard</h2>
                    <p className="text-gray-400 text-sm">Overview of your store</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="border border-gray-800 bg-[#111] p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-primary">₹{revenueLakhs}L</h3>
                    </div>
                    
                    <div className="border border-gray-800 bg-[#111] p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Paid Orders</p>
                        <h3 className="text-3xl font-bold">{analytics?.total_paid_orders || 0}</h3>
                    </div>
                    
                    <div className="border border-gray-800 bg-[#111] p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Pending Payments</p>
                        <h3 className="text-3xl font-bold">{analytics?.pending_payments || 0}</h3>
                    </div>
                    
                    <div className="border border-gray-800 bg-primary p-6">
                        <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-2">Total Users</p>
                        <h3 className="text-3xl font-bold text-white">{analytics?.total_users || 0}</h3>
                    </div>
                </div>

                {/* Last 24h Orders */}
                <div className="border border-gray-800 bg-[#111] p-6 mb-8">
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-4">Orders (Last 24 Hours)</h3>
                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500 text-sm">No orders in the last 24 hours.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead><tr className="border-b border-gray-700"><th className="py-2 pr-4">Order</th><th className="py-2 pr-4">Customer</th><th className="py-2 pr-4">Amount</th><th className="py-2">Status</th></tr></thead>
                                <tbody>
                                    {recentOrders.map((o) => (
                                        <tr key={o.id} className="border-b border-gray-800">
                                            <td className="py-3 pr-4"><Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline font-mono">{o.order_number}</Link></td>
                                            <td className="py-3 pr-4">{o.user?.name || o.user?.email || '-'}</td>
                                            <td className="py-3 pr-4">₹{Number(o.total_amount).toLocaleString()}</td>
                                            <td className="py-3"><span className={`px-2 py-0.5 text-xs uppercase ${o.status === 'confirmed' ? 'bg-green-500/20' : o.status === 'pending_payment' ? 'bg-yellow-500/20' : 'bg-gray-500/20'}`}>{o.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <Link href="/admin/orders" className="inline-block mt-4 text-primary hover:underline text-sm uppercase">View all orders →</Link>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/admin/products" className="border-2 border-gray-800 bg-[#111] p-6 hover:border-primary transition-colors">
                        <h3 className="text-xl font-bold mb-2">Products</h3>
                        <p className="text-gray-400 text-sm">Manage inventory</p>
                    </Link>
                    
                    <Link href="/admin/orders" className="border-2 border-gray-800 bg-[#111] p-6 hover:border-primary transition-colors">
                        <h3 className="text-xl font-bold mb-2">Orders</h3>
                        <p className="text-gray-400 text-sm">View all orders</p>
                    </Link>
                    
                    <Link href="/admin/users" className="border-2 border-gray-800 bg-[#111] p-6 hover:border-primary transition-colors">
                        <h3 className="text-xl font-bold mb-2">Users</h3>
                        <p className="text-gray-400 text-sm">Manage customers</p>
                    </Link>
                </div>
            </main>
        </div>
    );
}
