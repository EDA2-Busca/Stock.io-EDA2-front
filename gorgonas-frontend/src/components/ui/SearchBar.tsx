'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IoSearchOutline } from 'react-icons/io5';

export type SuggestionItem = { id: number; nome: string; imagem?: string;tipo?: string; };

type SearchBarProps = {
  className?: string;
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
  fetchSuggestions?: (term: string) => SuggestionItem[] | Promise<SuggestionItem[]>;
};

export default function SearchBar({ className, placeholder, onSearch, fetchSuggestions }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Cria um temporizador de 300ms
    const timer = setTimeout(async () => {
      // Só busca se tiver mais de 2 letras e a função existir
      if (searchTerm.trim().length > 0 && fetchSuggestions) {
        try {
          const results = await fetchSuggestions(searchTerm);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Erro ao buscar sugestões", error);
        }
      } else {
        // Se apagou o texto, limpa as sugestões
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    // Limpa o timer anterior se o usuário digitar de novo rápido (Isso é o debounce)
    return () => clearTimeout(timer);
  }, [searchTerm, fetchSuggestions]);

  // 4. Efeito para fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Submit do Formulário (Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setShowSuggestions(false); 
    onSearch(searchTerm);     
  };

  const handleSelectSuggestion = (suggestion: SuggestionItem) => {
    setSearchTerm(suggestion.nome); 
    setShowSuggestions(false);      
    onSearch(suggestion.nome);      
  };

  return (
    <div ref={wrapperRef} className={`w-full my-6 relative ${className ?? 'max-w-md'}`}>
      <form onSubmit={handleSubmit} className="relative z-20">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IoSearchOutline className="text-gray-400" size={20} />
          </div>
          
          <input
            type="search"
            placeholder={placeholder ?? 'Procurar por...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Se clicar no input de novo e tiver histórico, abre a lista
            onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
            className={`w-full h-14 pl-12 pr-4 py-2 border-none shadow-sm focus:ring-2 bg-white/75 focus:ring-[#6A38F3]/50 focus:outline-none placeholder-gray-500 text-gray-900
              ${showSuggestions && suggestions.length > 0 ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'}
            `}
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-lg rounded-b-2xl border-t border-gray-100 z-10 overflow-hidden">
          <ul>
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button" // Importante para não submeter o form
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                     {item.imagem ? (
                        <img src={item.imagem} alt="" className="w-full h-full object-cover"/>
                     ) : (
                        <IoSearchOutline className="text-gray-400" size={14} />
                     )}
                  </div>
                  
                  <span className="text-sm font-medium text-gray-700">{item.nome}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}