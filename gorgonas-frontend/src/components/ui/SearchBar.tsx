'use client';
import React from 'react';
import { IoSearchOutline } from 'react-icons/io5'; 

type SearchBarProps = {
  className?: string; // permite controlar largura/posicionamento externamente
  placeholder?: string;
};

export default function SearchBar({ className, placeholder }: SearchBarProps) {
  return (
    // wrapper sem mx-auto para permitir alinhamento à esquerda por padrão
    <div className={`w-full my-6 ${className ?? 'max-w-md'}`}> 
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IoSearchOutline className="text-gray-400" size={20} />
        </div>
        
        <input
          type="text"
          placeholder={placeholder ?? 'Procurar por...'}
          className="w-full h-14 pl-12 pr-4 py-2 rounded-2xl border-none shadow-sm focus:ring-2 bg-white/75 focus:ring-[#6A38F3]/50 focus:outline-none placeholder-gray-500 text-gray-900"
        />
      </div>
    </div>
  );
}