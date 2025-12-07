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

// Lista de categorias
const categorias = [
  { label: "mercado", icon: <ShoppingCart size={18} strokeWidth={2} /> },
  { label: "farmácia", icon: <Pill size={18} strokeWidth={2} /> },
  { label: "beleza", icon: <Brush size={18} strokeWidth={2} /> },
  { label: "moda", icon: <Shirt size={18} strokeWidth={2} /> },
  { label: "eletrônicos", icon: <Laptop size={18} strokeWidth={2} /> },
  { label: "jogos", icon: <Gamepad2 size={18} strokeWidth={2} /> },
  { label: "brinquedos", icon: <ToyBrick size={18} strokeWidth={2} /> },
  { label: "casa", icon: <Home size={18} strokeWidth={2} /> },
];

// Agora o componente aceita a prop direction
interface StoresFilterProps {
  onFilterChange?: (selected: string[]) => void;
  direction?: "up" | "down"; // NOVO
}

export default function StoresFilter({ onFilterChange, direction = "down" }: StoresFilterProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    const updated = selected.includes(cat)
      ? selected.filter((c) => c !== cat)
      : [...selected, cat];

    setSelected(updated);
    onFilterChange?.(updated);
  };

  // Controle se abre para cima ou para baixo
  const dropdownPosition =
    direction === "down"
      ? "absolute right-0 top-full mt-3"
      : "absolute right-0 bottom-[100%] mb-3";

  return (
    <div className="relative w-[240px] select-none">

      {/* BOTÃO */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full bg-white text-[#6A38F3] border border-[#E6E6E6]
          rounded-full py-3 px-5 flex justify-between items-center
          shadow-sm hover:shadow transition-all duration-200
        "
      >
        <span className="text-[17px] font-medium">filtros</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`
            ${dropdownPosition}
            w-[280px] md:w-[300px]
            bg-white rounded-3xl shadow-lg p-6 border border-[#E6E6E6]
            z-50 max-h-[350px] overflow-y-auto
          `}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[22px] font-medium text-[#6A38F3]">filtros</h3>
            <ChevronUp size={20} className="text-[#6A38F3]" />
          </div>

          {categorias.map((item) => (
            <label
              key={item.label}
              className="flex items-center gap-3 cursor-pointer mb-3"
            >
              <input
                type="checkbox"
                checked={selected.includes(item.label)}
                onChange={() => toggleCategory(item.label)}
                className="
                  h-[22px] w-[22px] rounded-md border-2 border-[#6A38F3]
                  accent-[#6A38F3] cursor-pointer
                "
              />

              <span className="flex items-center gap-2 text-[18px] text-[#6A38F3] capitalize">
                {item.label}
                {item.icon}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
