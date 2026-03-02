'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <nav className="w-full border-b-3 border-black bg-background-light sticky top-0 z-50">
            <div className="px-6 py-4 flex items-center justify-between max-w-[1440px] mx-auto w-full">
                {/* Logo Area */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl font-bold">diamond</span>
                    </div>
                    <Link href="/" className="text-2xl font-black tracking-tighter uppercase leading-none text-black hover:text-primary transition-colors">
                        THE NEW VEDA
                    </Link>
                </div>
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-12">
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/sarees">Sarees</Link>
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/women-suits">Suits</Link>
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/women-bags">Bags</Link>
                </div>
                {/* Icons */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href="/profile" className="hidden md:flex text-xs font-bold uppercase tracking-widest hover:text-primary">Profile</Link>
                            <button onClick={handleLogout} className="hidden md:flex text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="hidden md:flex text-xs font-bold uppercase tracking-widest hover:text-primary">Login</Link>
                    )}
                    <button className="w-10 h-10 border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <Link href="/cart" className="w-10 h-10 border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all relative">
                        <span className="material-symbols-outlined">shopping_bag</span>
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-black">
                                {count}
                            </span>
                        )}
                    </Link>
                    <button className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
