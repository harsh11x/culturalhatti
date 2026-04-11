'use client';
import Link from 'next/link';
import { useCartStore, useAuthStore, useUIStore, useWishlistStore } from '@/store';
import { Search, ShoppingBag, User, Menu, Diamond, X, Heart } from 'lucide-react';

export default function Navbar() {
    const count = useCartStore((s) => s.count());
    const wishlistCount = useWishlistStore((s) => s.productIds.length);
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const { openCart, openAuthModal, isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();

    return (
        <nav className="w-full border-b border-background-dark/10 bg-background-light/95 backdrop-blur-md sticky top-0 z-50 luxury-shadow transition-all duration-300">
            <div className="px-4 md:px-8 py-3 flex items-center justify-between w-full gap-4 transition-all duration-300">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 shrink-0 group py-1">
                    <img style={{ mixBlendMode: 'multiply' }} src="/logo.png" alt="Cultural Hatti Logo" className="h-10 md:h-12 w-auto object-contain origin-left transition-transform duration-300 group-hover:scale-105" />
                </Link>
                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 lg:gap-12 flex-1 justify-center">
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/sarees">Sarees</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/suits">Suits</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/bags">Bags</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase" href="/category/accessories">Accessories</Link>
                    <Link className="font-body text-sm font-medium tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b-2 border-transparent hover:border-primary pb-0.5" href="/category/kids">Kids</Link>
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
                            <button onClick={() => openAuthModal()} className="font-body text-xs font-semibold uppercase tracking-[0.15em] bg-primary text-background-dark px-6 py-2.5 hover:bg-accent transition-colors">
                                Login / Signup
                            </button>
                        )}
                    </div>

                    <button className="w-10 h-10 flex items-center justify-center text-background-dark hover:text-primary transition-all shrink-0">
                        <Search className="w-5 h-5" />
                    </button>
                    {user && (
                        <Link href="/wishlist" className="w-10 h-10 flex items-center justify-center text-background-dark hover:text-primary transition-all relative shrink-0">
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] font-body font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                    )}
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
                        <button onClick={() => openAuthModal()} className="md:hidden w-10 h-10 flex items-center justify-center hover:text-primary transition-all shrink-0">
                            <User className="w-5 h-5" />
                        </button>
                    )}
                    <button onClick={openMobileMenu} className="md:hidden w-10 h-10 flex items-center justify-center hover:text-primary transition-all shrink-0">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Mobile menu: opaque panel + solid scrim (avoids see-through over hero) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-[200] isolate md:hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Navigation menu"
                >
                    <button
                        type="button"
                        className="absolute inset-0 z-0 bg-black/75 cursor-default"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    />
                    <div className="absolute right-0 top-0 z-10 flex h-dvh min-h-0 w-[min(100%,20rem)] max-w-[min(100vw,20rem)] flex-col border-l border-background-dark/15 bg-[#FAF8F5] shadow-[0_0_40px_rgba(0,0,0,0.35)]">
                        <div className="flex shrink-0 items-center justify-between border-b border-background-dark/10 bg-[#FAF8F5] px-6 py-5">
                            <h3 className="font-display text-2xl font-bold tracking-tight text-background-dark">Menu</h3>
                            <button type="button" onClick={closeMobileMenu} className="flex h-10 w-10 items-center justify-center text-background-dark hover:text-primary transition-colors" aria-label="Close menu">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain bg-[#FAF8F5] px-6 py-6">
                            <nav className="flex flex-col gap-1" aria-label="Main">
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/category/sarees">Sarees</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/category/suits">Suits</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/category/bags">Bags</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/category/accessories">Accessories</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/category/kids">Kids</Link>
                                <Link onClick={closeMobileMenu} className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4" href="/collections">All collections</Link>

                                {user && (
                                    <>
                                        <div className="my-4 h-px bg-background-dark/15" />
                                        <Link onClick={closeMobileMenu} href="/wishlist" className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase border-b border-background-dark/10 py-4">
                                            Wishlist
                                        </Link>
                                        <Link onClick={closeMobileMenu} href="/profile" className="font-body text-base font-semibold tracking-[0.15em] text-background-dark hover:text-primary transition-colors uppercase py-4">Profile</Link>
                                        <button type="button" onClick={() => { logout(); closeMobileMenu(); }} className="font-body text-base font-semibold tracking-[0.15em] text-gray-500 hover:text-background-dark transition-colors uppercase text-left py-3">
                                            Logout
                                        </button>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
