'use client';

import { FiX, FiCamera } from 'react-icons/fi';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ModalEdicaoUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPassword: () => void;
  initialData?: { 
    nome: string; 
    userName: string; 
    email: string; 
    fotoPerfil: string;
  }
}

export function ModalEdicaoUsuario({ isOpen, onClose, onEditPassword, initialData }: ModalEdicaoUsuarioProps) {

  const [nome, setNome] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');

  // CORREÇÃO: Este useEffect atualiza os campos quando os dados chegam ou o modal abre
  useEffect(() => {
    if (initialData) {
        setNome(initialData.nome || '');
        setUsername(initialData.userName || '');
        setEmail(initialData.email || '');
        setFotoPerfil(initialData.fotoPerfil || '');
    }
  }, [initialData, isOpen]); 

  // Efeito para travar o scroll do fundo
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
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose} 
    >
      <div 
        className="relative bg-[#EEEEEE] w-full max-w-[500px] rounded-[30px] pt-16 pb-8 px-8 md:px-12 shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-black hover:text-gray-700 transition-colors"
        >
          <FiX size={32} strokeWidth={1.5} />
        </button>

        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <div className="relative h-32 w-32">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-[#EEEEEE] shadow-lg relative z-10">
              <Image
                src={fotoPerfil || '/stores/cjr.png'} // Usa o estado local fotoPerfil
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
            </div>
            
            <button 
              className="absolute bottom-0 right-0 z-20 bg-white p-2 rounded-full shadow-md text-black hover:bg-gray-100 transition-colors"
              title="Alterar foto"
            >
              <FiCamera size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <input 
            type="text" 
            placeholder="Nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
          <input 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
          <input 
            type="email" 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white rounded-full px-6 py-4 text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6A38F3] shadow-sm"
          />
        </div>

        <div className="flex flex-col gap-3 mt-10">
          <button className="w-full py-3.5 rounded-full border-2 border-[#B20000] text-[#B20000] font-semibold hover:bg-red-50 transition-colors font-lato">
            Deletar conta
          </button>

          <button
            onClick={onEditPassword}
            className="w-full py-3.5 rounded-full border-2 border-[#6A38F3] text-[#6A38F3] font-semibold hover:bg-purple-50 transition-colors font-lato"
          >
            Alterar senha
          </button>

          <button className="w-full py-3.5 rounded-full bg-[#6A38F3] text-white font-semibold shadow-lg shadow-purple-200 hover:bg-[#5829d6] transition-all active:scale-[0.98] font-lato">
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
}