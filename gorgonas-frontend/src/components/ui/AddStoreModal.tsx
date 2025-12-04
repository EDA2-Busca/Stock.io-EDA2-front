'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import Button from './Button'; 
import ImageUploadDropzone from './ImageUploadStore';

// Define os props do modal
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

// Componente principal do Modal de Adicionar Loja
export default function AddStoreModal({ isOpen, onClose }: Props) {
  // --- Estados do Formulário ---
  const [nomeLoja, setNomeLoja] = useState('');
  const [categoria, setCategoria] = useState('');

  // --- Lógica de Submissão ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação client-side (apenas campos de texto)
    if (!nomeLoja || !categoria) {
      toast.error('Por favor, preencha o nome da loja e a categoria.', { toastId: 'err-loja-texto' });
      return;
    }
    
    // Integração real deve usar `api.post('/lojas', { nome: nomeLoja, categoriaId })`
    // Removido console.debug de simulação
    toast.success('Loja adicionada com sucesso! (Simulação)');
    
    handleCloseModal(); // Limpa e fecha
  };
  
  // Limpa o formulário e fecha o modal
  const handleCloseModal = () => {
    setNomeLoja('');
    setCategoria('');
    onClose();
  }

  // Não renderiza nada se estiver fechado
  if (!isOpen) return null;

  // --- Renderização (JSX) ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      
      {/* Container do Modal (Largo e com padding horizontal) */}
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl px-10 py-8 shadow-lg">
        
        {/* Header do Modal (Título centralizado) */}
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Adicionar loja</h2>
          <button 
            onClick={handleCloseModal} 
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <IoClose size={28} />
          </button>
        </div>

        {/* Formulário */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Input: Nome da loja (arredondado) */}
          <input
            type="text"
            placeholder="Nome da loja"
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            className="w-full h-14 px-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900"
          />
          
          {/* Select: Categoria (arredondado e com padding na seta) */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full h-14 pl-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900"
          >
            <option value="" disabled>Categoria</option>
            <option value="mercado">Mercado</option>
            <option value="farmacia">Farmácia</option>
            <option value="moda">Moda</option>
            <option value="eletronicos">Eletrônicos</option>
            {/* (Adicionar outras categorias conforme necessário) */}
          </select>

          {/* Inputs de Ficheiro (Opcionais) */}
          <ImageUploadDropzone label="Anexe a foto de perfil da sua loja" />
          <ImageUploadDropzone label="Anexe a logo em SVG de sua loja" />
          <ImageUploadDropzone label="Anexe o banner de sua loja" />

          {/* Botão Adicionar (Centralizado e sem largura total) */}
          <div className="pt-4 flex justify-center"> 
            <Button type="submit" fullWidth={false}> 
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}