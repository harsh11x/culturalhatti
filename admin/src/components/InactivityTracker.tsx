'use client';
import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

export default function InactivityTracker({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ch_admin_token');
            localStorage.removeItem('ch_admin');
            router.push('/admin/login');
        }
    };

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
    };

    useEffect(() => {
        const isAdminPage = pathname?.startsWith('/admin');
        const isLoginPage = pathname === '/admin/login';

        if (isAdminPage && !isLoginPage) {
            const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
            resetTimer();
            events.forEach(event => window.addEventListener(event, resetTimer));
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
                events.forEach(event => window.removeEventListener(event, resetTimer));
            };
        }
    }, [pathname]);

    return <>{children}</>;
}
