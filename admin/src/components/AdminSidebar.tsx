'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X } from 'lucide-react';
import ServerStatus from './ServerStatus';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const isActive = (path: string) => pathname?.startsWith(path);

    const handleLogout = () => {
        localStorage.removeItem('ch_admin_token');
        localStorage.removeItem('ch_admin');
        window.location.href = '/admin/login';
    };

    const navContent = (
        <>
            <div className="p-6 border-b border-gray-700/50">
                <h1 className="text-xl font-bold tracking-tight text-white">ADMIN</h1>
                <p className="text-xs text-primary uppercase tracking-widest mt-1">Cultural Hatti</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                <Link href="/admin/dashboard" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/admin/dashboard') ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/admin/products" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/admin/products') ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    <Package className="w-5 h-5" /> Products
                </Link>
                <Link href="/admin/orders" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/admin/orders') ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    <ShoppingBag className="w-5 h-5" /> Orders
                </Link>
                <Link href="/admin/users" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${isActive('/admin/users') ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                    <Users className="w-5 h-5" /> Users
                </Link>
            </nav>
            <div className="p-4 border-t border-gray-700/50 space-y-3">
                <ServerStatus />
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5" /> Logout
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#111] border border-gray-700 text-white">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            {/* Overlay on mobile */}
            {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />}
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 min-h-screen border-r border-gray-700/50 bg-[#0d0d0d] flex flex-col shrink-0 transform transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {navContent}
            </aside>
        </>
    );
}
