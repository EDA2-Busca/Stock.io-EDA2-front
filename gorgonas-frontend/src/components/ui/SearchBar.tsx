'use client';
import React, { useState } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
type SearchBarProps = {
  className?: string; 
  placeholder?: string;
  onSearch: (searchTerm: string) => void;
};

export default function SearchBar({ className, placeholder, onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearch(searchTerm);
  };

  return (
    <form 
      className={`w-full my-6 ${className ?? 'max-w-md'}`} 
      onSubmit={handleSubmit} 
    > 
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <IoSearchOutline className="text-gray-400" size={20} />
        </div>
        
        <input
          type="search" 
          placeholder={placeholder ?? 'Procurar por...'}
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-14 pl-12 pr-4 py-2 rounded-2xl border-none shadow-sm focus:ring-2 bg-white/75 focus:ring-[#6A38F3]/50 focus:outline-none placeholder-gray-500 text-gray-900"
        />
      </div>
    </form>
  );
}