import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code Generator | Kevin Suvagiya',
  description: 'Instantly generate fully localized, high-resolution QR codes right in your browser.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
