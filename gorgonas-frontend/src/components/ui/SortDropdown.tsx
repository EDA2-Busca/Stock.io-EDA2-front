'use client';

import { useState, useEffect, useRef } from 'react';

export type SortOption = 'id' | 'preco' | 'rating' | 'createdAt';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  // Ícones SVG simples
  const ArrowDown = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1.5L6 6.5L11 1.5" stroke="#A891F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const ArrowUp = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 6.5L6 1.5L1 6.5" stroke="#A891F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div className="relative w-100" ref={dropdownRef}>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white rounded-full px-6 py-3 flex items-center justify-between shadow-sm border border-transparent hover:border-[#A891F3] transition-all"
      >
        <span className="text-[#A891F3] font-medium text-lg">ordenar por</span>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </button>

      {/* LISTA DROPDOWN (ABERTO) */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-[20px] shadow-lg p-4 z-20 border border-gray-100">
          
          {/* Cabeçalho do Dropdown */}
          <div className="flex justify-between items-center mb-4 px-2" onClick={() => setIsOpen(false)}>
            <span className="text-primary font-bold text-lg">ordenar</span>
            <ArrowUp />
          </div>

          <ul className="space-y-3">
            
            <li 
              onClick={() => handleSelect('id')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                ${currentSort === 'id' ? 'border-[#6A38F3] bg-primary' : 'border-[#A891F3]'}`}
              >
                
                {currentSort === 'id' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-[#A891F3] font-light text-lg group-hover:text-primary">
                Padrão <span className="text-sm">⇅</span>
              </span>
            </li>

            <li 
              onClick={() => handleSelect('preco')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                ${currentSort === 'preco' ? 'border-[#6A38F3] bg-primary' : 'border-[#A891F3]'}`}
              >
                {currentSort === 'preco' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-[#A891F3] font-light text-lg group-hover:text-primary">
                Preço <span className="text-sm">$</span>
              </span>
            </li>

            <li 
              onClick={() => handleSelect('rating')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                ${currentSort === 'rating' ? 'border-[#6A38F3] bg-primary' : 'border-[#A891F3]'}`}
              >
                {currentSort === 'rating' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-[#A891F3] font-light text-lg group-hover:text-primary">
                Avaliação <span className="text-sm">☆</span>
              </span>
            </li>

            <li 
              onClick={() => handleSelect('createdAt')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                ${currentSort === 'createdAt' ? 'border-[#6A38F3] bg-primary' : 'border-[#A891F3]'}`}
              >
                {currentSort === 'createdAt' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-[#A891F3] font-light text-lg group-hover:text-primary">
                Mais Recente <span className="text-sm">🕒</span>
              </span>
            </li>

          </ul>
        </div>
      )}
    </div>
  );
}