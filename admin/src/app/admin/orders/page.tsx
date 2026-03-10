'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        adminApi.get('/orders/admin/all')
            .then(r => setOrders(r.data.rows || r.data.orders || []))
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleExport = async () => {
        try {
            setExporting(true);
            const res = await adminApi.get('/orders/admin/export', { responseType: 'blob' });
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `orders-export-${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to export orders CSV', err);
            alert('Failed to export CSV. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-white text-xl font-bold uppercase tracking-widest">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white overflow-x-hidden">
            <main className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h2 className="text-4xl font-bold uppercase tracking-tight">Orders</h2>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="px-5 py-2 border border-gray-600 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black disabled:opacity-50"
                    >
                        {exporting ? 'Exporting…' : 'Export Excel'}
                    </button>
                </div>
                <div className="border border-gray-800 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#111] border-b border-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Order #</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Customer</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Amount</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Status</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Date</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-500">No orders yet.</td></tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o.id} className="border-b border-gray-800 hover:bg-[#111]">
                                        <td className="px-4 py-3 font-mono text-sm">{o.order_number}</td>
                                        <td className="px-4 py-3">{o.user?.name || o.user?.email || '-'}</td>
                                        <td className="px-4 py-3">₹{Number(o.total_amount).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs uppercase ${
                                                o.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                o.status === 'shipped' || o.status === 'delivered' ? 'bg-blue-500/20 text-blue-400' :
                                                o.status === 'cancelled' || o.status === 'refunded' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-sm">{new Date(o.created_at).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <Link href={`/admin/orders/${o.id}`} className="text-primary hover:underline text-sm">View</Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
