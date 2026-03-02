'use client';
import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { AdminNav } from '../dashboard/page';
import { CheckCircle2 } from 'lucide-react';

interface User {
    id: string; name: string; email: string; phone?: string;
    is_blocked: boolean; created_at: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [msg, setMsg] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        const res = await adminApi.get('/users/admin/all', { params: { search, limit: 50 } });
        setUsers(res.data.rows || []);
        setTotal(res.data.count || 0);
        setLoading(false);
    };

    useEffect(() => { fetchUsers(); }, []);

    const toggleBlock = async (id: string, currentlyBlocked: boolean) => {
        await adminApi.put(`/users/admin/${id}/block`);
        setUsers(users.map(u => u.id === id ? { ...u, is_blocked: !currentlyBlocked } : u));
        setMsg(`USER ${currentlyBlocked ? 'UNBLOCKED' : 'BLOCKED'} SUCCESSFULLY`);
        setTimeout(() => setMsg(''), 3000);
    };

    const resetPassword = async (id: string) => {
        const res = await adminApi.put(`/users/admin/${id}/reset-password`);
        setMsg(`PASSWORD RESET. TEMP PASSWORD: ${res.data.temp_password}`);
        setTimeout(() => setMsg(''), 10000);
    };

    return (
        <div className="bg-[#0a0a0a] text-gray-100 font-display antialiased min-h-screen flex flex-col overflow-x-hidden">
            <AdminNav />
            <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">Users</h2>
                        <p className="text-gray-400 font-mono text-sm">{total} REGISTERED USERS</p>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full md:w-auto">
                        <input
                            className="bg-[#111] border border-gray-800 text-white px-4 py-3 placeholder:text-gray-600 focus:ring-1 focus:ring-primary focus:outline-none w-full md:w-64 text-sm font-mono flex-1 rounded-none border-b sm:border-b-auto sm:border-r-0"
                            placeholder="SEARCH BY NAME OR EMAIL..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                        />
                        <button className="px-8 py-3 border border-gray-800 text-gray-900 bg-primary hover:bg-black hover:text-white uppercase text-xs font-bold tracking-widest transition-colors flex items-center justify-center whitespace-nowrap" onClick={fetchUsers}>
                            SEARCH
                        </button>
                    </div>
                </div>

                {msg && (
                    <div className="bg-green-500/10 border border-green-500 p-4 font-mono text-green-400 flex items-center gap-3">
                        <CheckCircle2 className="shrink-0 text-green-500 w-5 h-5" />
                        {msg}
                    </div>
                )}

                {/* Table */}
                <div className="border border-gray-800 bg-[#111] overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 bg-[#1a1a1a] text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="p-4 font-normal">Name</th>
                                <th className="p-4 font-normal">Email</th>
                                <th className="p-4 font-normal">Phone</th>
                                <th className="p-4 font-normal text-center">Status</th>
                                <th className="p-4 font-normal">Joined</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-800 font-mono">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500 uppercase tracking-widest font-bold">Loading users...</td></tr>
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500 uppercase tracking-widest font-bold">No users found.</td></tr>
                            ) : users.map((u) => (
                                <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-700 bg-cover bg-center rounded-none ring-1 ring-primary/50 flex items-center justify-center font-bold text-white text-xs">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-200">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-400 text-xs">{u.email}</td>
                                    <td className="p-4 text-gray-400 text-xs">{u.phone || '—'}</td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${u.is_blocked ? 'bg-red-600 text-white' : 'bg-green-500 text-black'}`}>
                                            {u.is_blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-xs">
                                        {new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-3 flex-wrap">
                                            <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider transition-colors inline-block whitespace-nowrap" onClick={() => resetPassword(u.id)}>
                                                RESET PWD
                                            </button>
                                            <button className={`text-xs font-bold uppercase tracking-wider transition-colors inline-block whitespace-nowrap border-l border-gray-800 pl-3 ${u.is_blocked ? 'text-green-500 hover:text-green-400' : 'text-red-500 hover:text-red-400'}`} onClick={() => toggleBlock(u.id, u.is_blocked)}>
                                                {u.is_blocked ? 'UNBLOCK' : 'BLOCK'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
