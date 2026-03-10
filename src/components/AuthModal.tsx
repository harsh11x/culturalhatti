'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore, useAuthStore } from '@/store';
import api from '@/lib/api';
import { X, Phone } from 'lucide-react';
import { auth, isFirebaseEnabled } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function AuthModal() {
    const router = useRouter();
    const { isAuthModalOpen, closeAuthModal, authRedirect } = useUIStore();
    const setUser = useAuthStore((s) => s.setUser);

    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>(isFirebaseEnabled ? 'phone' : 'email');
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthModalOpen && authMethod === 'phone' && !showOtpInput && isFirebaseEnabled && auth) {
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer && !window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        size: 'normal',
                        callback: () => {},
                        'expired-callback': () => {
                            setError('reCAPTCHA expired. Please try again.');
                        }
                    });
                } catch (err) {
                    console.error('reCAPTCHA error:', err);
                }
            }
        }
    }, [isAuthModalOpen, authMethod, showOtpInput]);

    if (!isAuthModalOpen) return null;

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!showOtpInput) {
                if (!isFirebaseEnabled || !auth) {
                    throw new Error('Phone authentication is not configured. Please contact support.');
                }
                const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
                const appVerifier = window.recaptchaVerifier;
                if (!appVerifier) {
                    throw new Error('reCAPTCHA not initialized. Please refresh and try again.');
                }
                const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
                setConfirmationResult(result);
                setShowOtpInput(true);
                setError('');
            } else {
                if (!confirmationResult) throw new Error('No confirmation result');
                const result = await confirmationResult.confirm(otp);
                const firebaseUser = result.user;
                
                const { data } = await api.post('/auth/phone-auth', {
                    firebase_uid: firebaseUser.uid,
                    phone: firebaseUser.phoneNumber,
                    name: name || 'User',
                });
                localStorage.setItem('ch_token', data.token);
                setUser({ id: data._id, name: data.name, email: data.email });
                const redirect = authRedirect;
                closeAuthModal();
                resetForm();
                if (redirect) router.push(redirect);
            }
        } catch (err: any) {
            setError(err.message || 'Phone authentication failed');
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                const { data } = await api.post('/auth/login', { email, password });
                localStorage.setItem('ch_token', data.token);
                setUser({ id: data._id, name: data.name, email: data.email });
                const redirect = authRedirect;
                closeAuthModal();
                if (redirect) router.push(redirect);
            } else {
                const { data } = await api.post('/auth/register', { name, email, password });
                localStorage.setItem('ch_token', data.token);
                setUser({ id: data._id, name: data.name, email: data.email });
                const redirect = authRedirect;
                closeAuthModal();
                if (redirect) router.push(redirect);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            if (!isFirebaseEnabled || !auth) {
                throw new Error('Google sign-in is not configured. Please contact support.');
            }
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const firebaseUser = result.user;
            
            const { data } = await api.post('/auth/google-auth', {
                firebase_uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName,
            });
            localStorage.setItem('ch_token', data.token);
            setUser({ id: data._id, name: data.name, email: data.email });
            closeAuthModal();
            resetForm();
            if (authRedirect) router.push(authRedirect);
        } catch (err: any) {
            setError(err.message || 'Google sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setPhone('');
        setOtp('');
        setShowOtpInput(false);
        setConfirmationResult(null);
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-background-light border-3 border-black w-full max-w-md brutalist-shadow relative max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                    onClick={() => { closeAuthModal(); resetForm(); }}
                    className="absolute top-4 right-4 text-black hover:text-primary transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
                        {isLogin ? 'Welcome Back.' : 'Join The Cult.'}
                    </h2>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">
                        {isLogin ? 'Sign in to access your account' : 'Register to begin your journey'}
                    </p>

                    {/* Auth Method Toggle - Only show if Firebase is enabled */}
                    {isFirebaseEnabled && (
                        <div className="flex gap-2 mb-6">
                            <button
                                type="button"
                                onClick={() => { setAuthMethod('phone'); resetForm(); }}
                                className={`flex-1 py-2 px-4 border-2 border-black font-bold uppercase text-xs tracking-widest transition-all ${authMethod === 'phone' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMethod('email'); resetForm(); }}
                                className={`flex-1 py-2 px-4 border-2 border-black font-bold uppercase text-xs tracking-widest transition-all ${authMethod === 'email' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                Email
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-100 border-2 border-primary text-primary px-4 py-3 text-sm font-bold">
                            {error}
                        </div>
                    )}

                    {authMethod === 'phone' && isFirebaseEnabled ? (
                        <form onSubmit={handlePhoneSubmit} className="space-y-4">
                            {!isLogin && !showOtpInput && (
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
                            
                            {!showOtpInput ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Phone Number</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value="+91"
                                                disabled
                                                className="w-16 bg-gray-100 border-2 border-black px-2 py-3 font-bold text-center"
                                            />
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="flex-1 bg-transparent border-2 border-black px-4 py-3 focus:ring-0 focus:border-primary placeholder-gray-400 font-bold"
                                                placeholder="9876543210"
                                                maxLength={10}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div id="recaptcha-container"></div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading || phone.length !== 10}
                                        className="w-full bg-black text-white border-2 border-black py-4 font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all mt-6 disabled:opacity-50"
                                    >
                                        {loading ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-2">Enter OTP</label>
                                        <input
                                            type="text"
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            className="w-full bg-transparent border-2 border-black px-4 py-3 focus:ring-0 focus:border-primary placeholder-gray-400 font-bold text-center text-2xl tracking-widest"
                                            placeholder="000000"
                                            maxLength={6}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">OTP sent to +91{phone}</p>
                                    </div>
                                    
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full bg-black text-white border-2 border-black py-4 font-black uppercase tracking-widest hover:bg-primary hover:border-primary transition-all mt-6 disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying...' : 'Verify OTP'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => { setShowOtpInput(false); setOtp(''); }}
                                        className="w-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black mt-3"
                                    >
                                        Change Number
                                    </button>
                                </>
                            )}
                        </form>
                    ) : (
                        <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                    )}

                    {isFirebaseEnabled && (
                        <>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-0.5 bg-gray-200 flex-1"></div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                                <div className="h-0.5 bg-gray-200 flex-1"></div>
                            </div>

                            <button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-white border-2 border-black py-3 font-bold uppercase tracking-widest hover:bg-gray-50 flex items-center justify-center gap-3 mt-6 transition-colors disabled:opacity-50">
                                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                Continue with Google
                            </button>
                        </>
                    )}

                    <div className="mt-8 text-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest inline-flex gap-2">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => { setIsLogin(!isLogin); resetForm(); }}
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
