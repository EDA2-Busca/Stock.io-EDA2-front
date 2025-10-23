import type { Metadata } from "next";
// Importa o componente cliente
import ToastProvider from "@/components/ToastProvider"; 
import "@/app/globals.css"; 
import React from "react";

// Metadata padrão para o projeto
export const metadata: Metadata = {
  title: "Avaliação de Professores",
  description: "Avaliação de professores da Universidade de Brasília",
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