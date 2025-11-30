'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utilis/api';

type Subcategoria = {
  id: number;
  nome: string;
  categoriaId: number;
};

interface FiltroSubcategoriaModal {
  categoriaLoja: string; 
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function SubcategoryFilterBar({
  categoriaLoja,
  selectedId,
  onSelect,
}: FiltroSubcategoriaModal) {
  
  const [listaSubcategorias, setListaSubcategorias] = useState<Subcategoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categoriaLoja) {
      const fetchSubcategorias = async () => {
        try {
          setIsLoading(true);
          // Busca as subcategorias da categoria atual
          const response = await api.get(`/categorias/${categoriaLoja}`);
          
          if (response.data && response.data.subcategorias) {
            setListaSubcategorias(response.data.subcategorias);
          }
        } catch (error) {
          console.error("Erro ao buscar subcategorias:", error);
          setListaSubcategorias([]); 
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSubcategorias();
    }
  }, [categoriaLoja]);

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    );
  }

  if (listaSubcategorias.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-10 overflow-x-auto px-2 py-2 no-scrollbar items-center">
      {/* Botão "Todos" (Limpar Filtro) */}
      <button
        onClick={() => onSelect(null)}
        className={`
          whitespace-nowrap px-10 py-3 rounded-full font-400 text-sm transition-all duration-200 shadow-sm
          ${selectedId === null
            ? 'bg-[#6A38F3] text-white shadow-md text-[20px] transform scale-105' // Ativo (Roxo)
            : 'bg-white text-purple-400 text-[20px] hover:bg-purple-50' // Inativo (Branco)
          }
        `}
      >
        Todos
      </button>
      {listaSubcategorias.map((sub) => (
        <button
          key={sub.id}
          onClick={() => onSelect(sub.id)}
          className={`
            whitespace-nowrap px-10 py-3 rounded-full font-400 text-sm transition-all duration-200 shadow-sm
            ${selectedId === sub.id
              ? 'bg-[#6A38F3] text-white shadow-md text-[20px] transform scale-105' // Ativo
              : 'bg-white text-purple-400 text-[20px] hover:bg-purple-50' // Inativo
            }
          `}
        >
          {sub.nome}
        </button>
      ))}
    </div>
  );
}