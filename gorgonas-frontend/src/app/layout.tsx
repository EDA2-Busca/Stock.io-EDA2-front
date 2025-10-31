import type { Metadata } from "next";
// Importa o componente cliente
import ToastProvider from "@/components/ToastProvider"; 
import "@/app/globals.css"; 
import React from "react";
import { AuthProvider } from './contexts/AuthContext';

// Metadata padrão para o projeto
export const metadata: Metadata = {
  title: "Stock.io",
  description: "Do CAOS à organização em alguns cliques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
        {/* Renderiza o conteúdo das páginas */}
        {children} 
        {/* Adiciona o container de notificações */}
        <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}