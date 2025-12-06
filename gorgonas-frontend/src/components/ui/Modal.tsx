'use client';
import React from 'react';

// Define os props que o Modal recebe, sem os children
type ModalOwnProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

// Combina os props com o tipo 'PropsWithChildren' do React para tipagem correta
type ModalProps = React.PropsWithChildren<ModalOwnProps>;

// Componente reutilizável para o modal de sucesso
export default function Modal({ isOpen, onClose, onConfirm, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Conteúdo do Modal (Estilizado) */}
      <div className="relative z-10 w-[90%] max-w-sm bg-foreground rounded-xl p-6 shadow-lg border border-gray-700">
        
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
        
        {/* Renderiza os children (ex: <p>Redirecionando...</p>) */}
        <div className="text-sm text-[#d1cfcf] mt-2">
          {children}
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-primary text-white font-semibold hover:opacity-90 transition cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}