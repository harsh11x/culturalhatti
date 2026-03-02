'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { AdminNav } from '../dashboard/page';
import { ArrowRight } from 'lucide-react';

interface Order {
    id: string; order_number: string; status: string; total_amount: number;
    payment_id?: string; created_at: string;
    user?: { name: string; email: string };
}

const STATUSES = ['', 'pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchOrders = async () => {
        setLoading(true);
        const params: Record<string, any> = { page, limit: 20 };
        if (status) params.status = status;
        if (search) params.search = search;
        const res = await adminApi.get('/orders/admin/all', { params });
        setOrders(res.data.rows || []);
        setTotal(res.data.count || 0);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [status, page]);

    return (
        <div className="bg-[#0a0a0a] text-gray-100 font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Orders</h2>
                        <p className="text-gray-400 font-mono text-sm">{total} TOTAL ORDERS FOUND</p>
                    </div>
                    <div className="relative w-full md:w-auto flex flex-col sm:flex-row gap-3">
                        <input
                            className="bg-[#111] border border-gray-800 text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary focus:outline-none w-full md:w-64 text-sm font-mono"
                            placeholder="SEARCH ORDER #..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
                        />
                        <select
                            className="bg-[#111] border border-gray-800 text-white px-4 py-3 focus:ring-1 focus:ring-primary outline-none min-w-[160px] cursor-pointer text-sm font-bold uppercase tracking-widest"
                            value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            {STATUSES.map((s) => <option key={s} value={s}>{s ? s.replace('_', ' ') : 'All Statuses'}</option>)}
                        </select>
                        <button className="px-5 py-3 bg-primary text-white hover:bg-black uppercase text-xs font-bold tracking-widest flex items-center justify-center border border-primary transition-all whitespace-nowrap" onClick={fetchOrders}>FILTER</button>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-gray-800 bg-[#111] overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#1a1a1a] text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="p-4 font-normal">Order ID</th>
                                <th className="p-4 font-normal">Customer</th>
                                <th className="p-4 font-normal text-right">Amount</th>
                                <th className="p-4 font-normal text-center">Status</th>
                                <th className="p-4 font-normal">Payment Ref</th>
                                <th className="p-4 font-normal">Date</th>
                                <th className="p-4 font-normal text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-800 font-mono">
                            {loading ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-500 uppercase tracking-widest font-bold">Loading records...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-500 uppercase tracking-widest font-bold">No orders matched criteria.</td></tr>
                            ) : orders.map((o) => (
                                <tr key={o.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">#{o.order_number}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-200">{o.user?.name || 'Guest'}</p>
                                        <p className="text-xs text-gray-500">{o.user?.email}</p>
                                    </td>
                                    <td className="p-4 text-white font-bold text-right">₹{Number(o.total_amount).toFixed(0)}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${o.status === 'paid' || o.status === 'delivered' ? 'bg-green-500 text-black' :
                                            o.status === 'cancelled' || o.status === 'refunded' ? 'bg-red-600 text-white' :
                                                'bg-yellow-500 text-black'
                                            }`}>
                                            {o.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">
                                        {o.payment_id ? o.payment_id.split('_').pop() : 'N/A'}
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">
                                        {new Date(o.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/orders/${o.id}`} className="text-xs font-bold text-primary hover:text-white uppercase tracking-wider inline-flex items-center gap-1">
                                            Manage <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {total > 20 && (
                    <div className="flex gap-2 mt-6">
                        <button className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white hover:bg-[#111] transition-colors disabled:opacity-50 uppercase text-xs font-bold" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
                        <span className="px-6 py-2 border border-gray-800 bg-[#111] text-white font-mono flex items-center justify-center">Page {page}</span>
                        <button className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white hover:bg-[#111] transition-colors disabled:opacity-50 uppercase text-xs font-bold" onClick={() => setPage(p => p + 1)} disabled={orders.length < 20}>Next →</button>
                    </div>
                )}
            </main>
        </div>
    );
}
