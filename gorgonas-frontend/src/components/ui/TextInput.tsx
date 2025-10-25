// src/components/ui/TextInput.tsx
'use client';
import React from 'react';

// Removemos a prop 'error'
type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ ...props }: TextInputProps) {
  return (
    <div>
      <input
        {...props}
        className="w-full h-12 px-4 rounded-full bg-[#F6F3E4] text-[#171918] placeholder-[#BDB6A8] focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/40"
      />
      {/* O 'p' de erro foi removido daqui */}
    </div>
  );
}