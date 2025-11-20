'use client';

import React, { useState, useEffect } from 'react';
import { IoClose, IoCameraOutline, IoAdd, IoRemove } from 'react-icons/io5';
import api from '@/utilis/api';

interface AdicionarProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lojaId: number;      
  categoriaLoja: string;
  onCreated?: (produto: { id: number; nome: string; preco: number; estoque: number; imagens?: any[] }) => void;
}

// Tipo para a Subcategoria
type Subcategoria = {
  id: number;
  nome: string;
  categoriaId: number;
};

export default function AdicionarProdutoModal({
  isOpen,
  onClose,
  lojaId,
  categoriaLoja,
  onCreated,
}: AdicionarProdutoModalProps) {
  
  // --- Estados do Formulário ---
  const [nome, setNome] = useState('');
  const [subcategoriaId, setSubcategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Estado para a lista que vem do backend
  const [listaSubcategorias, setListaSubcategorias] = useState<Subcategoria[]>([]);
  const [isLoadingSub, setIsLoadingSub] = useState(false);

  // --- EFEITO: Buscar Subcategorias Reais ---
  useEffect(() => {
    if (isOpen && categoriaLoja) {
      const fetchSubcategorias = async () => {
        try {
          setIsLoadingSub(true);
          const response = await api.get(`/categorias/${categoriaLoja}`);
          
          if (response.data && response.data.subcategorias) {
            setListaSubcategorias(response.data.subcategorias);
          }
        } catch (error) {
          console.error("Erro ao buscar subcategorias:", error);
          // Se falhar, lista vazia (ou poderia mostrar um erro no modal)
          setListaSubcategorias([]); 
        } finally {
          setIsLoadingSub(false);
        }
      };
      
      fetchSubcategorias();
    }
  }, [isOpen, categoriaLoja]);


  // --- Handlers ---
  const handleQuantityChange = (amount: number) => {
    setQuantidade((prev) => Math.max(1, prev + amount));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  interface ProdutoResponse {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagens?: any[];
}

// ...existing code...

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dadosProduto = {
      nome,
      descricao,
      preco: parseFloat(preco.replace(',', '.')),
      estoque: quantidade,
      lojaId: lojaId,
      subcategoriaId: Number(subcategoriaId),
    };

    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await api.post<ProdutoResponse>('/produtos', dadosProduto);
      const created = response.data;
      
      if (created && onCreated) {
        onCreated(created);
      }
      
      setNome('');
      setSubcategoriaId('');
      setDescricao('');
      setPreco('');
      setQuantidade(1);
      onClose();
    } catch (error: any) {
      console.error('Erro ao adicionar produto:', error);
      const status = error?.response?.status;
      if (status === 409) {
        setErrorMessage('Já existe um produto com este nome.');
      } else if (status === 400) {
        setErrorMessage('Dados inválidos. Verifique os campos.');
      } else {
        setErrorMessage('Falha ao salvar. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Estilos
  const inputStyle = 'w-full p-3 bg-white rounded-xl shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 placeholder-gray-500 text-gray-900';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <IoClose size={28} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Adicionar Produto
        </h2>
        {/* Mostra contexto para o usuário (Opcional) 
        <p className="text-center text-sm text-gray-500 mb-6 uppercase tracking-wide">
          {categoriaLoja}
        </p>*/}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Área de Fotos (Apenas Visual por enquanto) */}
          <div className="space-y-3">
            <div className="w-full h-32 border-2 border-dashed border-purple-400 rounded-lg p-4 flex flex-col items-center justify-center text-center text-purple-600 bg-purple-50/50">
              <IoCameraOutline size={40} />
              <p className="text-sm font-medium">Anexe as fotos do seu produto</p>
            </div>
             <div className="grid grid-cols-3 gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full h-24 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-white/50">
                  <IoCameraOutline className="text-purple-300" size={24} />
                </div>
              ))}
            </div>
          </div>

          {/* Nome */}
          <input
            type="text"
            placeholder="Nome do produto"
            className={inputStyle}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          {/* Dropdown de Subcategorias (Integrado) */}
          <div className="relative">
            <select
              className={`${inputStyle} ${!subcategoriaId ? 'text-gray-500' : 'text-gray-900'} appearance-none bg-white border border-gray-300 focus:ring-2 focus:ring-[#6A38F3]`}
              value={subcategoriaId}
              onChange={(e) => setSubcategoriaId(e.target.value)}
              required
              disabled={isLoadingSub} // Desabilita enquanto carrega
            >
              <option value="" disabled>
                {isLoadingSub ? 'Carregando categorias...' : 'Selecione uma subcategoria'}
              </option>
              
              {/* Renderiza a lista real do banco */}
              {listaSubcategorias.map((sub) => (
                <option key={sub.id} value={sub.id} className="text-gray-900">
                  {sub.nome}
                </option>
              ))}
            </select>
            {/* Ícone de seta para indicar dropdown*/}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
          </div>

          {/* Descrição */}
          <textarea
            placeholder="Descrição do produto"
            className={`${inputStyle} h-28 resize-none`}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          {/* Preço */}
          <input
            type="text"
            placeholder="Preço do produto (R$)"
            className={inputStyle}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />

          {/* Quantidade */}
          <div className="flex items-center justify-center space-x-8 pt-2">
            <button type="button" onClick={() => handleQuantityChange(-1)} className="w-12 h-12 rounded-full border-2 border-[#6A38F3] text-[#6A38F3] text-3xl flex items-center justify-center transition-transform active:scale-90 hover:bg-purple-50"><IoRemove /></button>
            <span className="text-6xl font-bold text-gray-800 w-20 text-center select-none">{quantidade}</span>
            <button type="button" onClick={() => handleQuantityChange(1)} className="w-12 h-12 rounded-full bg-[#6A38F3] text-white text-3xl flex items-center justify-center transition-transform active:scale-90 hover:bg-[#5a2ee0]"><IoAdd /></button>
          </div>

          {/* Botão Salvar */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6A38F3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg hover:bg-[#5a2ee0] transition-colors shadow-md hover:shadow-lg transform active:scale-[0.99]"
            >
              {isSubmitting ? 'Salvando...' : 'Adicionar'}
            </button>
            {errorMessage && (
              <p className="mt-3 text-sm text-red-600 font-medium">{errorMessage}</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}