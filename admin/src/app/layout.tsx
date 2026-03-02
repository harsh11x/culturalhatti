import type { Metadata } from 'next';
import '@/styles/globals.css';
import InactivityTracker from '@/components/InactivityTracker';

export const metadata: Metadata = {
  title: 'Merchant Admin - Cultural Hatti',
  description: 'Admin dashboard for Cultural Hatti.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white font-display overflow-x-hidden min-h-screen flex flex-col antialiased">
        <InactivityTracker>
          <div className="flex-grow flex flex-col">
            {children}
          </div>
        </InactivityTracker>
      </body>
    </html>
  );
}
