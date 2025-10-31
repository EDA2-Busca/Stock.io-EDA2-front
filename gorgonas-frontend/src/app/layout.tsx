// app/layout.tsx

import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';
import './globals.css';

// 2. Configure a fonte (REMOVA O CAMPO 'variable')
const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
});

export const metadata: Metadata = {
  title: 'Stock.io',
  description: '...',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      {/* 3. MUDE O className do <body> para isto: */}
      <body className={leagueSpartan.className}>
        {children}
      </body>
    </html>
  );
}