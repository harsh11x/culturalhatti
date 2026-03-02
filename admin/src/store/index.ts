import { create } from 'zustand';

interface AdminState {
    admin: any | null;
    setAdmin: (admin: any) => void;
    clearAdmin: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    admin: null,
    setAdmin: (admin) => set({ admin }),
    clearAdmin: () => set({ admin: null }),
}));
