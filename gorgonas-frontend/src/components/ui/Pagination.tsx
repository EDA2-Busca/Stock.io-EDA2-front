'use client';
import React from 'react';

// Componente simples de paginação
export default function Pagination() {
  // (Valores simulados por agora)
  const pages = [1, 2, 3, 4, 5];
  const currentPage = 1;

  return (
    <nav className="flex justify-center items-center space-x-2 mt-12">
      {/* Botão Anterior */}
      <a href="#" className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
        &lt;
      </a>

      {/* Números da Página */}
      {pages.map((page) => (
        <a
          key={page}
          href="#"
          className={`
            px-4 py-2 rounded-md 
            ${currentPage === page 
              ? 'bg-[#6A38F3] text-white font-bold' 
              : 'text-gray-600 hover:bg-gray-100'}
          `}
        >
          {page}
        </a>
      ))}
    </nav>
  );
}