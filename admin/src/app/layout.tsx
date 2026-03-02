import type { Metadata } from 'next';
import '@/styles/globals.css';
import InactivityTracker from '@/components/InactivityTracker';

export const metadata: Metadata = {
  title: 'Admin Panel - Cultural Hatti',
  description: 'Admin dashboard for Cultural Hatti',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white font-display antialiased min-h-screen">
        <InactivityTracker>
          {children}
        </InactivityTracker>
      </body>
    </html>
  );
}
