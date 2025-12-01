'use client';

import { FiX, FiChevronLeft, FiKey } from 'react-icons/fi';
import { useState, useEffect } from 'react';

interface ModalEditarSenhaProps {
  isOpen: boolean;
  onClose: () => void; // Fecha tudo
  onBack: () => void;  // Volta para o modal anterior
}

export function ModalEditarSenha({ isOpen, onClose, onBack }: ModalEditarSenhaProps) {
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Bloqueia rolagem do fundo
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      
      {/* Container do Modal */}
      <div className="relative bg-[#EEEEEE] w-full max-w-[500px] rounded-[30px] pt-8 pb-12 px-8 md:px-12 shadow-2xl">
        
        {/* Cabeçalho: Voltar e Fechar */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={onBack}
            className="text-black hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <FiChevronLeft size={32} strokeWidth={1.5} />
          </button>

          <button 
            onClick={onClose}
            className="text-black hover:bg-gray-200 p-2 rounded-full transition-colors"
          >
            <FiX size={32} strokeWidth={1.5} />
          </button>
        </div>

        {/* Ícone da Chave */}
        <div className="flex justify-center mb-8">
            <div className="bg-[#B095F8] p-6 rounded-full rotate-[-45deg] shadow-inner">
                <FiKey size={64} className="text-[#6A38F3] rotate-[45deg]" strokeWidth={2} />
            </div>
        </div>

        {/* Formulário */}
        <div className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="Senha Antiga" 
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
          <input 
            type="password" 
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
          <input 
            type="password" 
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
        </div>

        {/* Botão Salvar */}
        <div className="mt-10">
          <button 
            className="w-full py-3.5 rounded-full bg-[#6A38F3] text-white font-semibold text-lg shadow-lg shadow-purple-200 hover:bg-[#5829d6] transition-all active:scale-[0.98] font-lato"
          >
            Salvar Senha
          </button>
        </div>

      </div>
    </div>
  );
}