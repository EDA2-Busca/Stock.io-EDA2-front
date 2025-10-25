// src/components/ui/Button.tsx
'use client';
import React from 'react';

// Aceita todas as propriedades de um <button> normal
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full py-3 rounded-full bg-linear-to-r from-[#6A38F3] to-[#6C3BFF] text-white font-semibold shadow-lg hover:opacity-95 transition cursor-pointer"
    >
      {children}
    </button>
  );
}