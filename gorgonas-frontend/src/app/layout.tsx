import ToastProvider from "@/components/ToastProvider";
import React from "react";
import { AuthProvider } from '../contexts/AuthContext';
import type { Metadata } from 'next';
import { League_Spartan } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className={leagueSpartan.className}> 
        <AuthProvider>
        <ThemeProvider>
        {/* Renderiza o conteúdo das páginas */}
        {children} 
        {/* Adiciona o container de notificações */}
        <ToastProvider />
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
