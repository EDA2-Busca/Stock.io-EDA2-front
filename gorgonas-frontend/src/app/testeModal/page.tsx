'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button'; 
import AddStoreModal from '@/components/ui/AddStoreModal'; 

// Página para testar o 'AddStoreModal' isoladamente
export default function TesteModalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-gray-600 mb-4">Página de Teste - Modal Adicionar Loja</h1>
      <p className="mb-8 text-gray-600">Clique no botão abaixo para abrir o modal.</p>
      
      {/* Botão para abrir o modal */}
      <div className="w-full max-w-xs">
        <Button onClick={() => setIsModalOpen(true)}>
          Abrir Modal
        </Button>
      </div>

      {/* O Modal (controlado pelo estado) */}
      <AddStoreModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}