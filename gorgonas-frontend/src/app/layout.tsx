import type { Metadata } from "next";
// Importa o componente cliente
import ToastProvider from "@/components/ToastProvider"; 
import "@/app/globals.css"; 
import React from "react";

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
        {/* Renderiza o conteúdo das páginas */}
        {children} 
        
        {/* Adiciona o container de notificações */}
        <ToastProvider /> 
      </body>
    </html>
  );
}