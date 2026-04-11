import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Order',
  description:
    'Track your Cultural Hatti order status with your order number or order ID. See which products are on your order.',
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
