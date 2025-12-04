'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

type Props = {
  label: string;
  onFileChange?: (file: File | null) => void; 
  initialPreview?: string;
  className?: string;
};

export default function ImageUploadDropzone({ label, onFileChange, initialPreview, className }: Props) {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(initialPreview || null);
  }, [initialPreview]);

  const processFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    if (onFileChange) onFileChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!preview) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!preview) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!preview && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setPreview(null); 
    if (inputRef.current) inputRef.current.value = ''; 
    
    if (onFileChange) onFileChange(null); 
  };

  return (
    <div 
      className={`
        relative w-full h-40 rounded-3xl overflow-hidden
        transition-all duration-200 ease-in-out
        ${className || ''}
        
        /* ESTILOS CONDICIONAIS */
        ${preview 
          ? 'border-2 border-solid border-gray-300 bg-gray-50'
          : isDragging 
            ? 'border-2 border-solid border-[#6A38F3] bg-purple-100'
            : 'border-2 border-dashed border-[#6A38F3] hover:bg-purple-50 cursor-pointer'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        onChange={handleFileChange}
        accept="image/*"
        disabled={!!preview}
      />

      {preview ? (
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-full object-contain pointer-events-none"
            onError={() => setPreview(null)} 
          />
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg border border-gray-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:scale-105 transition-all z-20 cursor-pointer"
            title="Excluir imagem atual e anexar outra"
            type="button"
          >
            <FiX size={20} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full z-0 pointer-events-none px-4">
          <div className="text-[#6A38F3] mb-3 bg-purple-100 p-3 rounded-full">
            <FiUpload size={24} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            Clique ou arraste para enviar
          </span>
        </div>
      )}
    </div>
  );
}