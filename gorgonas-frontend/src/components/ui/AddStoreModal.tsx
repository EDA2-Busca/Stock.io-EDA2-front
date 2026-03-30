'use client';

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import Button from './Button'; 
import ImageUploadDropzone from './ImageUploadStore';
import api from '@/utilis/api';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

// Define os props do modal
type Props = {
  isUsuario: boolean;
  isOpen: boolean;
  onClose: () => void;
};

interface Categoria {
  id: number;
  nome: string;
}

// Componente principal do Modal de Adicionar Loja
export default function AddStoreModal({ isOpen, onClose}: Props) {
  const [perfilFile, setPerfilFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  // --- Estados do Formulário ---
  const [nomeLoja, setNomeLoja] = useState('');
  const [categoriaId, setCategoriaId] = useState('');

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      if (isOpen) {
        // Função para buscar categorias
        const fetchCategorias = async () => {
          try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
          } catch (error) {
            console.error("Erro ao buscar categorias", error);
            toast.error("Não foi possível carregar as categorias.");
          }
        };

        fetchCategorias();
      }
    }, [isOpen]);


  // --- Lógica de Submissão ---
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!nomeLoja || !categoriaId) {
      toast.error('Por favor, preencha o nome da loja e selecione uma categoria.');
      return;
    }

    try {
      setIsLoading(true);

      // Payload conforme esperado pelo seu DTO (CreateLojaDto)
      const formData = new FormData();
      formData.append('nome', nomeLoja);

      formData.append('categoriaId', Math.floor(Number(categoriaId)).toString());
      if (perfilFile) formData.append('logo', perfilFile); 
      if (logoFile) formData.append('banner', logoFile);   
      if (bannerFile) formData.append('sticker', bannerFile);
      // Chamada para o Back-end
      await api.post('/lojas', formData);

      toast.success('Loja criada com sucesso!');
      
      // Limpa os campos
      setNomeLoja('');
      setCategoriaId('');
      
      // Fecha o modal
      onClose();

    } catch (error: any) {
      console.error(error);
      // Tratamento de erros específicos do seu Back (Conflict, NotFound)
      const mensagem = error.response?.data?.message || 'Erro ao criar loja.';
      toast.error(mensagem);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Limpa o formulário e fecha o modal
  const handleCloseModal = () => {
    setNomeLoja('');
    setCategoriaId('');
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
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            disabled={isLoading}
            className="w-full h-14 pl-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900 disabled:bg-gray-100 bg-white"
          >
            <option value="" disabled>Selecione uma Categoria</option>
            
            {/* Mapeia as categorias vindas do banco */}
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>

          {/* Inputs de Ficheiro (Opcionais) */}
          <ImageUploadDropzone label="Anexe a foto de perfil da sua loja" />
          <ImageUploadDropzone label="Anexe a logo em SVG de sua loja" />
          <ImageUploadDropzone label="Anexe o banner de sua loja" />

          {/* Botão Adicionar (Centralizado e sem largura total) */}
          <div className="pt-4 flex justify-center"> 
            <Button type="submit" fullWidth={false} disabled={isLoading}> 
              {isLoading ? 'Criando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}