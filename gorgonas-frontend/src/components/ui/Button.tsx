'use client';
import React from 'react';

// Define os tipos das props
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  fullWidth?: boolean; // Prop para controlar a largura
};

// Componente de botão reutilizável. 'fullWidth = true' é o padrão.
export default function Button({ children, fullWidth = true, ...props }: ButtonProps) {
  
  // Define a classe de largura
  const widthClass = fullWidth ? 'w-full' : 'px-12'; 

  return (
    <button
      {...props}
      className={`
        py-3 rounded-full bg-linear-to-r from-[#6A38F3] to-[#6C3BFF] 
        text-white font-semibold shadow-lg hover:opacity-95 
        transition cursor-pointer
        ${widthClass}
      `}
    >
      {children}
    </button>
  );
}