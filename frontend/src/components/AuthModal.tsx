'use client';
import { useState } from 'react';
import { useUIStore, useAuthStore } from '@/store';
import api from '@/lib/api';
import { X } from 'lucide-react';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal } = useUIStore();
    const setUser = useAuthStore((s) => s.setUser);

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { data } = await api.post('/users/login', { email, password });
                localStorage.setItem('ch_token', data.token);
                setUser({ id: data._id, name: data.name, email: data.email });
                closeAuthModal();
            } else {
                const { data } = await api.post('/users', { name, email, password });
                localStorage.setItem('ch_token', data.token);
                setUser({ id: data._id, name: data.name, email: data.email });
                closeAuthModal();
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background-light border-3 border-black w-full max-w-md brutalist-shadow relative">
                {/* Close Button */}
                <button
                    onClick={closeAuthModal}
                    className="absolute top-4 right-4 text-black hover:text-primary transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                        {isLogin ? 'Welcome Back.' : 'Join The Cult.'}
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
                        {isLogin ? 'Sign in to access your account' : 'Register to begin your journey'}
                    </p>

                    {error && (
                        <div className="mb-6 bg-red-100 border-2 border-primary text-primary px-4 py-3 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-transparent border-2 border-black px-4 py-3 focus:ring-0 focus:border-primary placeholder-gray-400 font-bold"
                                    placeholder="YOUR NAME"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-2 border-black px-4 py-3 focus:ring-0 focus:border-primary placeholder-gray-400 font-bold uppercase"
                                placeholder="EMAIL@EXAMPLE.COM"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-2 border-black px-4 py-3 focus:ring-0 focus:border-primary font-bold"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white border-2 border-black py-4 font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all mt-6 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="h-0.5 bg-gray-200 flex-1"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                        <div className="h-0.5 bg-gray-200 flex-1"></div>
                    </div>

                    <button className="w-full bg-white border-2 border-black py-3 font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-3 mt-6 transition-colors">
                        <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                        Continue with Google
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest inline-flex gap-2">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-black hover:text-primary transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
