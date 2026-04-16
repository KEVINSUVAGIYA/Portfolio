import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instant Chat Room | Kevin Suvagiya',
  description: 'A completely free, instant, anonymous chat room powered by Firebase Realtime Database with live cross-browser syncing.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
