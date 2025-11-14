'use client';

import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi'; // Ícone de Upload

type Props = {
  label: string;
  // Props para integração futura (opcionais)
  onFileChange?: (file: File) => void;
  onFileClear?: () => void;
};

// Componente para a caixa de upload tracejada
export default function ImageUploadDropzone({ label, onFileChange, onFileClear }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);

  // Handler para quando um ficheiro é selecionado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      onFileChange?.(e.target.files[0]);
    }
  };

  // Handler para o botão "Remover"
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault(); // Impede submissão
    e.stopPropagation(); // Impede que o clique ative o input de ficheiro por baixo
    
    setFileName(null);
    onFileClear?.();
  };

  return (
    // Wrapper clicável com estilo de tracejado disperso
    <div className="relative w-full p-8 
                    border-2 border-dashed border-[#6A38F3] 
                    rounded-3xl 
                    flex flex-col items-center justify-center 
                    text-center cursor-pointer 
                    hover:bg-purple-50 transition-colors"
    >
      {/* Input de ficheiro real (escondido) */}
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleFileChange}
        value="" 
      />
      
      {/* Ícone e Texto */}
      <div className="text-[#6A38F3] mb-2">
        <FiUpload size={36} />
      </div>
      
      <span className="mt-2 text-sm font-medium text-gray-700">
        {fileName ?? label}
      </span>

      {/* Botão para limpar (só aparece se houver ficheiro) */}
      {fileName && (
        <button
          onClick={handleClear}
          className="text-xs text-red-500 hover:underline mt-1 z-10"
        >
          Remover
        </button>
      )}
    </div>
  );
}