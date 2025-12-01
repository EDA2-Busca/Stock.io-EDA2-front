'use client';

import { FiChevronLeft, FiMail } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export interface ProfileHeaderProps {
    nome: string;
    userName: string;
    email: string;
    fotoPerfil: string;
  };

export function ProfileHeader({ perfil, onEditProfile }: { perfil: ProfileHeaderProps | null, onEditProfile: () => void }) {
  const router = useRouter();

  const nome = perfil?.nome || 'Nome do Usuário';
  const userName = perfil?.userName || 'username';
  const email = perfil?.email || 'email@example.com';


  return (
    <header className="w-full flex flex-col">
      
      {/* 1. Área Preta (Capa) */}
      <div className="h-48 bg-black w-full relative">
        <button 
            onClick={() => router.back()}
            className="absolute top-8 left-4 md:left-8 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
        >
            <FiChevronLeft size={40} strokeWidth={1.5} />
        </button>
      </div>

      {/* 2. Área Bege (Infos) */}
      <div className="bg-[#FDF9F2] px-4 md:px-12 pb-8 relative">
        
        {/* Container que alinha o conteúdo */}
        <div className="max-w-7xl mx-auto">
            
            {/* Foto de Perfil (Sobreposta) */}
            {/* O 'absolute -top-16' faz ela subir 64px (metade da altura) para cima da linha */}
            <div className="absolute -top-24 left-4 md:left-80">
                <div className="p-1 bg-[#FDF9F2] rounded-full inline-block"> {/* Borda falsa para simular o corte */}
                    <img 
                        src={perfil?.fotoPerfil || '/stores/cjr.png'} 
                        className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-[#FDF9F2]" 
                    />
                </div>
            </div>

            {/* Espaçamento para o conteúdo não ficar embaixo da foto */}
            <div className="pt-20 md:pt-28 flex flex-col md:flex-row justify-between items-start md:items-start gap-6">
                
                {/* Textos */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl md:text-4xl font-bold font-merriweather text-gray-900">
                        {perfil?.nome}
                    </h1>

                    <div className="text-lg text-gray-700 font-lato">
                        <span>{'@ '}{perfil?.userName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 font-lato mt-1">
                        <FiMail size={18} />
                        <span>{perfil?.email}</span>
                    </div>
                </div>

                {/* Botão de Ação */}
                <button 
                    onClick={onEditProfile}
                    className="w-full md:w-auto bg-[#6A38F3] text-white hover:bg-[#FFFFFF] hover:text-[#6A38F3] font-bold py-3 px-8 rounded-full shadow-lg transition-all active:scale-95 font-lato"
                >
                    Editar Perfil
                </button>
            </div>
        </div>
      </div>
    </header>
  );
}