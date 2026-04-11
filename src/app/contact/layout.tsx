import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Reach Cultural Hatti for orders, sarees, suits, bags, and support. Send us a message — we reply from our team inbox.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
