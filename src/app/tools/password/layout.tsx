import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Password Generator | Kevin Suvagiya',
  description: 'Generate hyper-secure, customizable passwords instantly. Everything happens locally in your browser.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
