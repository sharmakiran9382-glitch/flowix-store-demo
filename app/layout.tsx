import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AURA',
  applicationName: 'AURA',
  description:
    'Engineered apparel, structured outerwear, cushioned footwear, and everyday gear by AURA & Flowix Studio.',
  keywords: [
    'AURA Cloth Store',
    'technical apparel',
    'streetwear India',
    'hoodies',
    'sneakers',
    'Flowix Studio',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'AURA',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/aura-logo.svg',
    apple: '/aura-logo.svg',
  },
  openGraph: {
    title: 'AURA | Technical Apparel & Footwear',
    description:
      'Engineered apparel, structured outerwear, cushioned footwear, and everyday gear.',
    type: 'website',
    siteName: 'AURA Cloth Store',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AURA | Technical Apparel & Footwear',
    description:
      'Engineered apparel, structured outerwear, cushioned footwear, and everyday gear.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
