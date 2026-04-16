import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive World Clock | Kevin Suvagiya',
  description: 'The ultimate interactive world clock timezone converter. Drag the scrubber bar locally to instantly change time globally.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
