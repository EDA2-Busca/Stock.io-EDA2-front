'use client';
import React from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi'; // Ícone de Lápis/Editar

type Props = {
  storeName: string;
  category: string;
  description: string;
  bannerImageUrl: string;
  isLoggedIn: boolean;
};

// Componente para o banner full-width
export default function StoreBanner({ storeName, category, description, bannerImageUrl, isLoggedIn }: Props) {
  // Simulação, no futuro viria do 'isOwner'
  const isOwner = true; 

  return (
    <section className="w-full h-[50vh] relative flex items-center justify-center text-white">
      {/* Imagem de Fundo */}
      <img
        src={bannerImageUrl}
        alt={`Banner da ${storeName}`}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.backgroundColor = '#555'; (e.target as HTMLImageElement).src = ''; }}
      />
      {/* Overlay Escuro para legibilidade */}
      <div className="absolute inset-0 w-full h-full bg-black/50" />

      {/* Conteúdo Centralizado (Nome, Categoria, Descrição) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-6xl font-bold">{storeName}</h1>
        <p className="text-2xl capitalize">{category}</p>
        <p className="text-lg mt-1">{description}</p>
      </div>

      {/* Botões de Ação (Flutuantes) */}
      {isLoggedIn && (
        <div className="absolute top-6 right-8 z-10 flex gap-4">
          
          {/* Botão Editar Loja (só para o dono) */}
          {isOwner && (
            <button 
              className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
              title="Editar Loja"
            >
              <FiEdit2 size={22} />
            </button>
          )}
          
          {/* Botão Adicionar Produto (só para o dono) */}
          {isOwner && (
            <button 
              className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
              title="Adicionar Produto" 
            >
              <FaPlus size={22} />
            </button>
          )}
        </div>
      )}
    </section>
  );
}