'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';

export default function AdminLoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await adminApi.post('/auth/admin/login', form);
            localStorage.setItem('ch_admin_token', res.data.token);
            localStorage.setItem('ch_admin', JSON.stringify(res.data.admin));
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Invalid admin credentials');
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 52, color: 'var(--saffron)', letterSpacing: 3 }}>ADMIN</h1>
                    <p style={{ color: '#555', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase' }}>Cultural Hatti Control Panel</p>
                </div>
                <div style={{ border: '3px solid var(--saffron)', padding: 36, background: '#0d0d0d' }}>
                    {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#aaa' }}>Admin Email</label>
                            <input className="form-input" type="email" style={{ background: '#0d0d0d', color: 'var(--ivory)', borderColor: '#333' }} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ color: '#aaa' }}>Password</label>
                            <input className="form-input" type="password" style={{ background: '#0d0d0d', color: 'var(--ivory)', borderColor: '#333' }} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 12 }} disabled={loading}>
                            {loading ? 'Authenticating…' : 'Enter Admin Panel'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
