'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import ServerStatus from '@/components/ServerStatus';

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }

        adminApi.get('/users/admin/analytics')
            .then(r => setAnalytics(r.data.analytics))
            .catch(() => router.push('/admin/login'))
            .finally(() => setLoading(false));
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('ch_admin_token');
        localStorage.removeItem('ch_admin');
        router.push('/admin/login');
    };

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
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        ADMIN <span className="text-primary">PANEL</span>
                    </h1>
                    <div className="flex items-center gap-4">
                        <ServerStatus />
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-primary uppercase tracking-widest"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
