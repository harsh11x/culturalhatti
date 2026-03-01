'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { Search, ShoppingBag, User, Menu, Diamond } from 'lucide-react';

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const { openCart, openAuthModal } = useUIStore();

    return (
        <nav className="w-full border-b-3 border-black bg-background-light sticky top-0 z-50">
            <div className="px-4 md:px-8 py-4 flex items-center justify-between w-full gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-black text-white flex items-center justify-center">
                        <Diamond className="w-5 h-5 md:w-6 md:h-6 font-bold" />
                    </div>
                    <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter uppercase leading-none text-black hover:text-primary transition-colors whitespace-nowrap hidden sm:block">
                        CULTURAL HATTI
                    </Link>
                </div>
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 lg:gap-12 flex-1 justify-center">
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/sarees">Sarees</Link>
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/women-suits">Suits</Link>
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/women-bags">Bags</Link>
                    <Link className="text-sm font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/accessories">Accessories</Link>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <div className="hidden md:flex items-center gap-4 mr-4">
                        {user ? (
                            <>
                                <Link href="/profile" className="text-xs font-bold uppercase tracking-widest hover:text-primary">Profile</Link>
                                <button onClick={logout} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={openAuthModal} className="text-xs font-bold uppercase tracking-widest bg-black text-white px-5 py-2 hover:bg-primary transition-colors">
                                Login / Signup
                            </button>
                        )}
                    </div>

                    <button className="w-10 h-10 border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shrink-0">
                        <Search className="w-5 h-5" />
                    </button>
                    <button onClick={openCart} className="w-10 h-10 border-2 border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all relative shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                        {count > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-black">
                                {count}
                            </span>
                        )}
                    </button>

                    {/* Mobile Only Icons */}
                    {!user && (
                        <button onClick={openAuthModal} className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shrink-0">
                            <User className="w-5 h-5" />
                        </button>
                    )}
                    <button className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shrink-0">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </nav>
    );
}
