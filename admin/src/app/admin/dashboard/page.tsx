'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Diamond, LayoutDashboard, Package, ShoppingBag, Users, LogOut, CheckCircle2, XCircle, RefreshCcw, Zap } from 'lucide-react';

interface Analytics {
    total_revenue: string; total_paid_orders: number;
    pending_payments: number; cancelled_orders: number;
    refunded_orders: number; total_users: number;
}

const AdminNav = () => {
    const pathname = usePathname();
    const isActive = (path: string) => pathname?.startsWith(path);

    const navLinkClass = (path: string) =>
        `px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${isActive(path)
            ? 'text-primary border border-primary bg-primary/10 hover:bg-primary hover:text-white'
            : 'text-gray-400 hover:text-primary'
        }`;

    return (
        <header className="w-full border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Logo & Brand */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-white">
                        <Diamond className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold tracking-tighter uppercase text-white">Merchant<span className="text-primary">.Studio</span></h1>
                    </div>
                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center ml-8 gap-1">
                        <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>Dashboard</Link>
                        <Link href="/admin/orders" className={navLinkClass('/admin/orders')}>Orders</Link>
                        <Link href="/admin/products" className={navLinkClass('/admin/products')}>Inventory</Link>
                        <Link href="/admin/users" className={navLinkClass('/admin/users')}>Users</Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { localStorage.removeItem('ch_admin_token'); window.location.href = '/admin/login'; }}
                        className="text-gray-400 hover:text-primary font-bold text-xs uppercase tracking-widest pl-4 border-l border-gray-800 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" /> LOGOUT
                    </button>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                        <div className="h-9 w-9 bg-gray-700 bg-cover bg-center rounded-none ring-2 ring-primary/50 flex items-center justify-center text-white font-bold">A</div>
                        <div className="hidden lg:block text-left">
                            <p className="text-xs font-bold uppercase text-white tracking-wider">Admin</p>
                            <p className="text-[10px] text-gray-400 font-mono">STAFF</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Nav */}
            <nav className="md:hidden flex overflow-x-auto border-t border-gray-800 bg-[#111]">
                <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>Dashboard</Link>
                <Link href="/admin/orders" className={navLinkClass('/admin/orders')}>Orders</Link>
                <Link href="/admin/products" className={navLinkClass('/admin/products')}>Inventory</Link>
                <Link href="/admin/users" className={navLinkClass('/admin/users')}>Users</Link>
            </nav>
        </header>
    );
};

export { AdminNav };

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.get('/users/admin/analytics').then(r => setAnalytics(r.data.analytics)).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen bg-[#211211] text-white flex flex-col items-center justify-center font-display font-bold uppercase tracking-widest text-xl">Loading data...</div>;

    const rev = analytics?.total_revenue || '0';
    const revLakhs = (Number(rev) / 100000).toFixed(1);

    return (
        <div className="bg-[#0a0a0a] text-gray-100 font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Overview</h2>
                        <p className="text-gray-400 font-mono text-sm">REAL-TIME DATA</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/products/new" className="px-5 py-3 bg-primary text-white hover:bg-black hover:text-white uppercase text-xs font-bold tracking-widest flex items-center gap-2 border border-primary transition-all rounded-none">
                            <span className="text-xl leading-none">+</span> New Product
                        </Link>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-800 bg-[#111]">
                    {/* KPI 1 */}
                    <div className="p-6 border-b md:border-b-0 lg:border-r border-gray-800 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap className="w-16 h-16 text-primary" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Total Revenue</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">₹{revLakhs}L</h3>
                        </div>
                        <div className="w-full bg-gray-800 h-1 mt-4">
                            <div className="bg-primary h-1" style={{ width: '75%' }}></div>
                        </div>
                    </div>

                    {/* KPI 2 */}
                    <div className="p-6 border-b md:border-b-0 lg:border-r border-gray-800 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShoppingBag className="w-16 h-16 text-white" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Paid Orders</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{analytics?.total_paid_orders || 0}</h3>
                        </div>
                        <div className="w-full bg-gray-800 h-1 mt-4">
                            <div className="bg-white h-1" style={{ width: '45%' }}></div>
                        </div>
                    </div>

                    {/* KPI 3 */}
                    <div className="p-6 border-b md:border-b-0 md:border-r lg:border-r border-gray-800 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <RefreshCcw className="w-16 h-16 text-blue-500" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Pending Pay</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{analytics?.pending_payments || 0}</h3>
                        </div>
                        <div className="w-full bg-gray-800 h-1 mt-4">
                            <div className="bg-blue-500 h-1" style={{ width: '20%' }}></div>
                        </div>
                    </div>

                    {/* KPI 4 */}
                    <div className="p-6 relative group overflow-hidden bg-primary text-white">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                            <Users className="w-16 h-16 text-black" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">Total Users</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{analytics?.total_users || 0}</h3>
                        </div>
                        <div className="w-full bg-black/20 h-1 mt-4">
                            <div className="bg-black h-1" style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Live Feed */}
                    <div className="border border-gray-800 bg-[#111] p-6 flex-1">
                        <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-6 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            Live Updates
                        </h3>
                        <div className="relative pl-6 border-l border-gray-800 space-y-8">
                            <div className="relative">
                                <XCircle className="absolute -left-[37.5px] top-0 w-6 h-6 text-gray-500 bg-[#111] rounded-full" />
                                <p className="text-sm text-gray-300">You have <span className="text-primary font-bold">{analytics?.cancelled_orders}</span> cancelled orders to review.</p>
                            </div>
                            <div className="relative">
                                <CheckCircle2 className="absolute -left-[37.5px] top-0 w-6 h-6 text-primary bg-[#111] rounded-full" />
                                <p className="text-sm text-gray-300">Processed <span className="text-white font-bold">{analytics?.refunded_orders}</span> refunds recently.</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border border-gray-800 bg-white text-black p-6">
                        <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center justify-between">
                            Quick Links <Zap className="w-5 h-5" />
                        </h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/admin/orders" className="w-full py-4 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-none">
                                <Package className="w-4 h-4" /> View All Orders
                            </Link>
                            <Link href="/admin/users" className="w-full py-4 border-2 border-black font-bold uppercase text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 rounded-none">
                                <Users className="w-4 h-4" /> Manage Users
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
