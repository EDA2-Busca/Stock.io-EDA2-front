'use client';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Usa ícones

// Componente reutilizável para input de senha com toggle de visibilidade
type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordInput({ ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div>
      <div className="relative">
        <input
          {...props}
          type={isVisible ? 'text' : 'password'}
          className="w-full h-12 px-4 pr-12 rounded-full bg-[#F6F3E4] text-foreground placeholder-[#BDB6A8] focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] opacity-90"
        >
          {isVisible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}