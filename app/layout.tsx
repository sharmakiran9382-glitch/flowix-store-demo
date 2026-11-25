import type { Metadata } from 'next';
import './globals.css';

const AURA_ICON_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='26' fill='%2309090b'/%3E%3Ccircle cx='60' cy='60' r='44' fill='none' stroke='%23d4a373' stroke-width='3'/%3E%3Cpath d='M60 28L34 86h13l5-12h28l5 12h13L60 28zm-3 34l3-8 3 8h-6z' fill='%23f7dfc2'/%3E%3C/svg%3E";

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
        <link rel="icon" href={AURA_ICON_SVG} />
        <link rel="apple-touch-icon" href={AURA_ICON_SVG} />
      </head>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  );
}
