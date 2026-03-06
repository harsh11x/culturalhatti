'use client';
import { useState } from 'react';
import ServerStatus from '@/components/ServerStatus';

const ADMIN_EMAIL = 'admin@culturalhatti.in';
const ADMIN_PASSWORD = 'Admin@1234';

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const email = form.email.trim();
            const password = form.password;

            if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
                setError('Invalid admin credentials');
                return;
            }

            // Hardcoded login: just drop ROOT_ADMIN token so all admin APIs work
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('ch_admin_token', 'ROOT_ADMIN');
                window.localStorage.setItem(
                    'ch_admin',
                    JSON.stringify({ id: 'admin', name: 'Admin', email: ADMIN_EMAIL, role: 'superadmin' })
                );
                // Use full page navigation to avoid any routing weirdness
                window.location.href = '/admin/dashboard';
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 right-4">
                <ServerStatus />
            </div>
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-primary mb-2 tracking-tight">ADMIN</h1>
                    <p className="text-gray-400 text-sm uppercase tracking-widest">Cultural Hatti Control Panel</p>
                </div>
                
                <div className="border-2 border-primary/30 bg-[#111] p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 text-red-500 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 text-white focus:border-primary focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 text-white focus:border-primary focus:outline-none"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-bold uppercase tracking-widest hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? 'Authenticating...' : 'Enter Admin Panel'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
