'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore, useUIStore } from '@/store';
import { Search, ShoppingBag, User, Menu, Diamond, X } from 'lucide-react';

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const { openCart, openAuthModal, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();

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
                    <button onClick={openMobileMenu} className="md:hidden w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shrink-0">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu}></div>
                    <div className="absolute right-0 top-0 h-full w-[280px] bg-background-light border-l-3 border-black shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black uppercase tracking-tight">Menu</h3>
                                <button onClick={closeMobileMenu} className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <Link onClick={closeMobileMenu} className="text-base font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-black pb-2" href="/category/sarees">Sarees</Link>
                                <Link onClick={closeMobileMenu} className="text-base font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-black pb-2" href="/category/women-suits">Suits</Link>
                                <Link onClick={closeMobileMenu} className="text-base font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-black pb-2" href="/category/women-bags">Bags</Link>
                                <Link onClick={closeMobileMenu} className="text-base font-bold tracking-widest text-black hover:text-primary transition-colors uppercase border-b-2 border-black pb-2" href="/category/accessories">Accessories</Link>
                                
                                {user && (
                                    <>
                                        <div className="h-px bg-gray-300 my-4"></div>
                                        <Link onClick={closeMobileMenu} href="/profile" className="text-base font-bold tracking-widest text-black hover:text-primary transition-colors uppercase">Profile</Link>
                                        <button onClick={() => { logout(); closeMobileMenu(); }} className="text-base font-bold tracking-widest text-gray-400 hover:text-black transition-colors uppercase text-left">
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
