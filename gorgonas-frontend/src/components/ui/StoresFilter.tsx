"use client";

import { useState } from "react";

const CATEGORIES = [
  { label: "Mercado", slug: "mercado" },
  { label: "Farmácia", slug: "farmacia" },
  { label: "Beleza", slug: "beleza" },
  { label: "Moda", slug: "moda" },
  { label: "Eletrônicos", slug: "eletronicos" },
  { label: "Jogos", slug: "jogos" },
  { label: "Brinquedos", slug: "brinquedos" },
  { label: "Casa", slug: "casa" },
];

export default function StoresFilter({ onFilterChange }: { onFilterChange: (categories: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  const handleSelection = (slug: string) => {
    let updated = [...selected];

    if (updated.includes(slug)) {
      updated = updated.filter((c) => c !== slug);
    } else {
      updated.push(slug);
    }

    setSelected(updated);
    onFilterChange(updated);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggle}
        className="px-4 py-2 bg-white border rounded-lg shadow hover:bg-gray-50 transition"
      >
        Filtros
      </button>

      {open && (
        <div className="absolute mt-2 w-56 bg-white shadow-lg border rounded-lg p-4 z-50">
          {CATEGORIES.map((cat) => (
            <label key={cat.slug} className="flex items-center space-x-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(cat.slug)}
                onChange={() => handleSelection(cat.slug)}
              />
              <span className="text-sm">{cat.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
