import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared Real-time Notes | Kevin Suvagiya',
  description: 'Rich text collaborative notes editor synced live. Anyone on the same URL edits it together.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
