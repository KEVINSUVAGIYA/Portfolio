import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator | Kevin Suvagiya',
  description: 'A fast and beautiful JSON formatter and validator that runs entirely in your browser.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
