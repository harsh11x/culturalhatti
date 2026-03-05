'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import ServerStatus from '@/components/ServerStatus';

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await adminApi.post('/auth/admin/login', form);
            localStorage.setItem('ch_admin_token', res.data.token);
            localStorage.setItem('ch_admin', JSON.stringify(res.data.admin));
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid admin credentials');
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
