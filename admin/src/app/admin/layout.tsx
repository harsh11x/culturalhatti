'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    if (isLoginPage) return <>{children}</>;

    return (
        <div className="flex min-h-screen bg-[#0d0d0d]">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0 pl-14 lg:pl-0">
                {children}
            </div>
        </div>
    );
}
