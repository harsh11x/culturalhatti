import { create } from 'zustand';

interface CartItem {
    product_id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (product_id: string) => void;
    updateQty: (product_id: string, qty: number) => void;
    clearCart: () => void;
    total: () => number;
    count: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
    items: typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('ch_cart') || '[]')
        : [],

    addItem: (item) => {
        const existing = get().items.find((i) => i.product_id === item.product_id);
        let items;
        if (existing) {
            items = get().items.map((i) =>
                i.product_id === item.product_id
                    ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
                    : i
            );
        } else {
            items = [...get().items, item];
        }
        set({ items });
        if (typeof window !== 'undefined') localStorage.setItem('ch_cart', JSON.stringify(items));
    },

    removeItem: (product_id) => {
        const items = get().items.filter((i) => i.product_id !== product_id);
        set({ items });
        if (typeof window !== 'undefined') localStorage.setItem('ch_cart', JSON.stringify(items));
    },

    updateQty: (product_id, qty) => {
        const items = get().items.map((i) =>
            i.product_id === product_id ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } : i
        );
        set({ items });
        if (typeof window !== 'undefined') localStorage.setItem('ch_cart', JSON.stringify(items));
    },

    clearCart: () => {
        set({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('ch_cart');
    },

    total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));

interface AuthStore {
    user: { id: string; name: string; email: string } | null;
    setUser: (user: AuthStore['user']) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('ch_user') || 'null')
        : null,

    setUser: (user) => {
        set({ user });
        if (typeof window !== 'undefined') localStorage.setItem('ch_user', JSON.stringify(user));
    },

    logout: () => {
        set({ user: null });
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ch_user');
            localStorage.removeItem('ch_token');
        }
    },
}));

interface UIStore {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    isAuthModalOpen: boolean;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    isMobileMenuOpen: boolean;
    openMobileMenu: () => void;
    closeMobileMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isCartOpen: false,
    openCart: () => set({ isCartOpen: true }),
    closeCart: () => set({ isCartOpen: false }),
    isAuthModalOpen: false,
    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    isMobileMenuOpen: false,
    openMobileMenu: () => set({ isMobileMenuOpen: true }),
    closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
