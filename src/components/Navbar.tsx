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
        <nav className="w-full border-b border-background-dark/10 bg-background-light/95 backdrop-blur-md sticky top-0 z-50 luxury-shadow">
            <div className="px-4 md:px-8 py-5 flex items-center justify-between w-full gap-4">
                {/* Logo Area */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary text-background-dark flex items-center justify-center">
                        <Diamond className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <Link href="/" className="font-body text-xl md:text-2xl font-bold tracking-tight leading-none text-background-dark hover:text-primary transition-colors whitespace-nowrap hidden sm:block uppercase">
                        Cultural Hatti
                    </Link>
                </div>
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 lg:gap-12 flex-1 justify-center">
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/sarees">Sarees</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/women-suits">Suits</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/women-bags">Bags</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/accessories">Accessories</Link>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                    <div className="hidden md:flex items-center gap-3 mr-2">
                        {user ? (
                            <>
                                <Link href="/profile" className="font-body text-xs font-medium uppercase tracking-[0.15em] hover:text-primary transition-colors">Profile</Link>
                                <button onClick={logout} className="font-body text-xs font-medium uppercase tracking-[0.15em] text-gray-400 hover:text-background-dark transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={openAuthModal} className="font-body text-xs font-semibold uppercase tracking-[0.15em] bg-primary text-background-dark px-6 py-2.5 hover:bg-accent transition-colors">
                                Login / Signup
                            </button>
                        )}
                    </div>

                    <button className="w-10 h-10 flex items-center justify-center text-background-dark hover:text-primary transition-all shrink-0">
                        <Search className="w-5 h-5" />
                    </button>
                    <button onClick={openCart} className="w-10 h-10 flex items-center justify-center text-background-dark hover:text-primary transition-all relative shrink-0">
                        <ShoppingBag className="w-5 h-5" />
                        {count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] font-body font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {count}
                            </span>
                        )}
                    </button>

                    {/* Mobile Only Icons */}
                    {!user && (
                        <button onClick={openAuthModal} className="md:hidden w-10 h-10 flex items-center justify-center hover:text-primary transition-all shrink-0">
                            <User className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={openMobileMenu} className="md:hidden w-10 h-10 flex items-center justify-center hover:text-primary transition-all shrink-0">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] md:hidden">
                    <div className="absolute inset-0 bg-background-dark/60 backdrop-blur-md" onClick={closeMobileMenu}></div>
                    <div className="absolute right-0 top-0 h-full w-[300px] bg-background-light luxury-shadow">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-display text-2xl font-bold tracking-tight">Menu</h3>
                                <button onClick={closeMobileMenu} className="w-10 h-10 flex items-center justify-center hover:text-primary transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                <Link onClick={closeMobileMenu} className="font-body text-base font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 pb-3" href="/category/sarees">Sarees</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 pb-3" href="/category/women-suits">Suits</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 pb-3" href="/category/women-bags">Bags</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 pb-3" href="/category/accessories">Accessories</Link>
                                
                                {user && (
                                    <>
                                        <div className="h-px bg-background-dark/10 my-4"></div>
                                        <Link onClick={closeMobileMenu} href="/profile" className="font-body text-base font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase">Profile</Link>
                                        <button onClick={() => { logout(); closeMobileMenu(); }} className="font-body text-base font-medium tracking-[0.15em] text-gray-400 hover:text-background-dark transition-colors uppercase text-left">
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
