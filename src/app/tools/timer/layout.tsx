import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared Real-time Timer | Kevin Suvagiya',
  description: 'Create a countdown timer with a specific ID. Perfectly synchronized across all devices and browsers instantly.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
