// src/components/ui/Modal.tsx
'use client';
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay (sem alteração) */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Conteúdo do Modal (Estilizado) */}
      <div className="relative z-10 w-[90%] max-w-sm bg-[#171918] rounded-xl p-6 shadow-lg border border-gray-700">
        
        {/* Título (Cor alterada) */}
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        
        {/* Descrição (Cor alterada) */}
        <div className="text-sm text-[#d1cfcf] mt-2">
          {children}
        </div>
        
        {/* Botão (Estilo alterado para combinar com o tema) */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-[#6A38F3] text-white font-semibold hover:opacity-90 transition cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}