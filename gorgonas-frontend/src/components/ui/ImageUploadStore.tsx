'use client';

import React, { useState, useRef } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

type Props = {
  label: string;
  onFileChange?: (file: File) => void;
  onFileClear?: () => void;
};

export default function ImageUploadDropzone({ label, onFileChange, onFileClear }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Usamos ref para limpar o valor do input quando o usuário clica em remover
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileChange?.(file);
    }
  };

  // Eventos de Drag & Drop para efeito visual
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileChange?.(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Essencial
    
    setFileName(null);
    if (inputRef.current) inputRef.current.value = ''; // Reseta o input nativo
    onFileClear?.();
  };

  return (
    <div 
      className={`
        relative w-full p-8 
        border-2 
        ${isDragging ? 'border-solid border-[#6A38F3] bg-purple-100' : 'border-dashed border-[#6A38F3] hover:bg-purple-50'}
        rounded-3xl 
        flex flex-col items-center justify-center 
        text-center cursor-pointer 
        transition-all duration-200 ease-in-out
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Input cobre tudo, exceto onde tivermos z-index maior */}
      <input
        ref={inputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        onChange={handleFileChange}
        accept="image/*" // Boa prática para upload de imagens
      />
      
      <div className="flex flex-col items-center z-10 pointer-events-none">
        <div className="text-[#6A38F3] mb-2">
          {fileName ? <FiFile size={36} /> : <FiUpload size={36} />}
        </div>
        
        <span className="mt-2 text-sm font-medium text-gray-700 break-all px-4">
          {fileName ?? label}
        </span>
      </div>

      {fileName && (
        <button
          onClick={handleClear}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 text-red-500 z-20 transition-colors"
          title="Remover arquivo"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
}