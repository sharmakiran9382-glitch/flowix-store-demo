import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURA | Technical Apparel & Footwear',
  description:
    'Engineered apparel, structured outerwear, cushioned footwear, and everyday gear by AURA & Flowix Studio.',
  icons: {
    icon: '/aura-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
