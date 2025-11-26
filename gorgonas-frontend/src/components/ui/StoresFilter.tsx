"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Pill,
  Brush,
  Shirt,
  Laptop,
  Gamepad2,
  ToyBrick,
  Home,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const categorias = [
  { label: "Mercado", icon: <ShoppingCart size={18} strokeWidth={2} /> },
  { label: "Farmácia", icon: <Pill size={18} strokeWidth={2} /> },
  { label: "Beleza", icon: <Brush size={18} strokeWidth={2} /> },
  { label: "Moda", icon: <Shirt size={18} strokeWidth={2} /> },
  { label: "Eletrônicos", icon: <Laptop size={18} strokeWidth={2} /> },
  { label: "Jogos", icon: <Gamepad2 size={18} strokeWidth={2} /> },
  { label: "Brinquedos", icon: <ToyBrick size={18} strokeWidth={2} /> },
  { label: "Casa", icon: <Home size={18} strokeWidth={2} /> },
];

export default function StoresFilter() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-[240px] select-none">

      {/* BOTÃO DO FILTRO */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full bg-white text-[#6A38F3] border border-[#E6E6E6]
          rounded-full py-3 px-5 flex justify-between items-center
          shadow-sm hover:shadow transition-all duration-200
        "
      >
        <span className="text-[17px] font-medium">filtros</span>
        {open ? (
          <ChevronUp size={18} strokeWidth={2} />
        ) : (
          <ChevronDown size={18} strokeWidth={2} />
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute mt-3 w-[300px] bg-white rounded-3xl shadow-lg p-6 
            border border-[#E6E6E6] animate-in fade-in slide-in-from-top-2
          "
        >
          {/* TÍTULO */}
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[22px] font-medium text-[#6A38F3]">
              filtros
            </h3>
            <ChevronUp size={20} className="text-[#6A38F3]" />
          </div>

          {/* LISTA DE CATEGORIAS */}
          <div className="space-y-4">
            {categorias.map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-3 cursor-pointer"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  className="
                    h-[22px] w-[22px] rounded-md border-2 border-[#6A38F3]
                    accent-[#6A38F3] cursor-pointer
                  "
                />
                {/* Texto + ícone */}
                <span className="flex items-center gap-2 text-[18px] text-[#6A38F3]">
                  {item.label}
                  {item.icon}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
