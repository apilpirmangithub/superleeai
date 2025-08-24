import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/Providers';
import { Header } from '@/components/layout/Header';
import { Background } from '@/components/layout/Background';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SuperLeeAgent - AI dApp for Story Chain',
  description: 'Swap tokens and register IP on Story Chain via natural language',
  keywords: ['AI', 'dApp', 'Story Chain', 'DeFi', 'IP Registration'],
  authors: [{ name: 'SuperLeeAgent Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-background">
            <Background />
            <div className="relative z-10">
              <Header />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
```
