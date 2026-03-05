'use client';
import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ServerStatus() {
    const [connected, setConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${API_URL.replace('/api', '')}/api/health`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                setConnected(res.ok);
            } catch {
                setConnected(false);
            }
        };
        check();
        const interval = setInterval(check, 30000);
        return () => clearInterval(interval);
    }, []);

    if (connected === null) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-[#111]">
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-gray-400 uppercase tracking-wider">Checking server...</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 px-4 py-2 border ${connected ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-xs font-medium uppercase tracking-wider ${connected ? 'text-green-400' : 'text-red-400'}`}>
                {connected ? 'Connected to server' : 'Disconnected from server'}
            </span>
        </div>
    );
}
