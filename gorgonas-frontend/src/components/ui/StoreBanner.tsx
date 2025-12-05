'use client';
import React from 'react';
import Image from 'next/image';
import { FaPlus } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { useState } from 'react';
import AdicionarProdutoModal from "../../components/ModalAddProduto";
import EditStoreModal from "./EditStoreModal";
import { toast } from 'react-toastify';

type Props = {
  id: number;
  storeName: string;
  category: string;
  description: string;
  bannerImageUrl: string;
  isLoggedIn: boolean;
  isOwner: boolean;
  onProductCreated?: (p: { id: number; nome: string; preco: number; estoque: number; imagens?: any[] }) => void;
  onStoreUpdated?: () => void;
  onStoreDeleted?: () => void;
};

// Componente para o banner full-width
export default function StoreBanner({ id, storeName, category, description, bannerImageUrl, isLoggedIn, isOwner, onProductCreated, onStoreUpdated, onStoreDeleted }: Props) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <section className="w-full h-[50vh] relative flex items-center justify-center text-white">
      {/* Imagem de Fundo com prioridade para carregamento mais rápido */}
      <Image
        src={bannerImageUrl || '/banner-rare-beauty.jpg'}
        alt={`Banner da ${storeName}`}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAyNCcgaGVpZ2h0PSc0MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzEwMjQnIGhlaWdodD0nNDAwJyBmaWxsPScjMTExMTExJy8+PC9zdmc+"
        onError={() => { /* Next/Image não expõe target, fallback via src padrão acima */ }}
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
              onClick={() => setIsEditOpen(true)}
              className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
              title="Editar Loja"
            >
              <FiEdit2 size={22} />
            </button>
          )}
          
          {/* Botão Adicionar Produto (só para o dono) */}
          {isOwner && (
            <button onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
              title="Adicionar Produto"
              
            >
              <FaPlus size={22} />
            </button>
          )}
        </div>
      )}

      <AdicionarProdutoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lojaId={id}
        categoriaLoja={category}
        onCreated={(p) => {
          onProductCreated?.(p);
        }}
      />

      {isOwner && (
        <EditStoreModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          lojaId={String(id)}
          initialName={storeName}
          initialCategory={category}
          initialImages={{ bannerUrl: bannerImageUrl }}
          onUpdated={() => {
            setIsEditOpen(false);
            toast?.success?.("Loja atualizada");
            onStoreUpdated?.();
          }}
          onDeleted={() => {
            setIsEditOpen(false);
            onStoreDeleted?.();
          }}
        />
      )}

    </section>
  );
}