import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DocForge — Web-based Document Generator & PDF Engine',
  description: 'Pick a beautifully designed template, fill in guided forms with automated Kenyan tax & currency calculations, see a live preview, and export pixel-perfect PDFs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
