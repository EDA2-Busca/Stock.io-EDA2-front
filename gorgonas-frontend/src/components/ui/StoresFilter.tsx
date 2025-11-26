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
  { label: "mercado", icon: <ShoppingCart size={18} strokeWidth={2} /> },
  { label: "farmácia", icon: <Pill size={18} strokeWidth={2} /> },
  { label: "beleza", icon: <Brush size={18} strokeWidth={2} /> },
  { label: "moda", icon: <Shirt size={18} strokeWidth={2} /> },
  { label: "eletrônicos", icon: <Laptop size={18} strokeWidth={2} /> },
  { label: "jogos", icon: <Gamepad2 size={18} strokeWidth={2} /> },
  { label: "brinquedos", icon: <ToyBrick size={18} strokeWidth={2} /> },
  { label: "casa", icon: <Home size={18} strokeWidth={2} /> },
];

interface StoresFilterProps {
  onFilterChange?: (selected: string[]) => void;
}

export default function StoresFilter({ onFilterChange }: StoresFilterProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    let updated: string[];

    if (selected.includes(cat)) {
      updated = selected.filter((c) => c !== cat);
    } else {
      updated = [...selected, cat];
    }

    setSelected(updated);

    // 🔥 Envia para o StoreList
    onFilterChange?.(updated);
  };

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
          className="
            absolute mt-3 w-[300px] bg-white rounded-3xl shadow-lg p-6 
            border border-[#E6E6E6] animate-in fade-in slide-in-from-top-2
          "
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[22px] font-medium text-[#6A38F3]">
              filtros
            </h3>
            <ChevronUp size={20} className="text-[#6A38F3]" />
          </div>

          <div className="space-y-4">
            {categorias.map((item) => (
              <label
                key={item.label}
                className="flex items-center gap-3 cursor-pointer"
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
        </div>
      )}
    </div>
  );
}
