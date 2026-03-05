'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import ServerStatus from '@/components/ServerStatus';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('ch_admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        adminApi.get('/users/admin/all')
            .then(r => setUsers(r.data.rows || r.data.users || []))
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

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-gray-800 bg-[#0a0a0a] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">ADMIN <span className="text-primary">PANEL</span></h1>
                    <div className="flex items-center gap-4">
                        <ServerStatus />
                        <Link href="/admin/dashboard" className="text-gray-400 hover:text-primary text-sm uppercase">Dashboard</Link>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-primary uppercase tracking-widest">Logout</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-4xl font-bold uppercase tracking-tight mb-8">Users</h2>
                <div className="border border-gray-800 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#111] border-b border-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Name</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Email</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Phone</th>
                                <th className="px-4 py-3 text-xs font-bold uppercase text-gray-400">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-500">No users yet.</td></tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="border-b border-gray-800 hover:bg-[#111]">
                                        <td className="px-4 py-3">{u.name || '-'}</td>
                                        <td className="px-4 py-3">{u.email || '-'}</td>
                                        <td className="px-4 py-3">{u.phone || '-'}</td>
                                        <td className="px-4 py-3 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
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
