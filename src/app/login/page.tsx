'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/store';

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAuthStore((s) => s.user);
    const openAuthModal = useUIStore((s) => s.openAuthModal);

    useEffect(() => {
        if (user) {
            const redirect = searchParams.get('redirect') || '/profile';
            router.replace(redirect);
            return;
        }
        const redirect = searchParams.get('redirect') || '/profile';
        openAuthModal(redirect);
    }, [user, searchParams, router, openAuthModal]);

    if (user) return null;

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light">
            <p className="text-background-dark font-bold uppercase tracking-widest text-sm">Opening login...</p>
            <p className="mt-4 text-gray-500 text-sm">If the form doesn&apos;t appear, <button onClick={() => openAuthModal(searchParams.get('redirect') || '/profile')} className="text-primary underline">click here</button>.</p>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-background-light"><p className="text-background-dark font-bold uppercase">Loading...</p></main>}>
            <LoginContent />
        </Suspense>
    );
}
