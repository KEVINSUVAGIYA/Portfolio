import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instant Poll | Kevin Suvagiya',
  description: 'Create an instant poll and share the link. Anyone can vote live — powered by Firebase.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
