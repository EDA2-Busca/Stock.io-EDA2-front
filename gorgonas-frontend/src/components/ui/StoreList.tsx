"use client";

import { useState } from "react";
import { StoreCard } from "./StoreCard";
import StoresFilter from "@/components/ui/StoresFilter";

const stores = [
  {
    id: 1,
    slug: "cjr",
    name: "CJR",
    category: "mercado",
    imageUrl: "/stores/cjr.png",
  },
  {
    id: 2,
    slug: "rare-beauty",
    name: "Rare Beauty",
    category: "beleza",
    imageUrl: "/stores/rare-beauty.png",
  },
  {
    id: 3,
    slug: "the-croc-brew",
    name: "The Croc Brew",
    category: "mercado",
    imageUrl: "/stores/croc-brew.png",
  },
  {
    id: 4,
    slug: "mini-reno",
    name: "Mini Reno",
    category: "casa",
    imageUrl: "/stores/mini-reno.png",
  },
  {
    id: 5,
    slug: "amoca",
    name: "amoca",
    category: "moda",
    imageUrl: "/stores/amoca.png",
  },
  {
    id: 6,
    slug: "repiit",
    name: "Repiit",
    category: "eletrônicos",
    imageUrl: "/stores/repiit.png",
  },
  {
    id: 7,
    slug: "creamy-skincare",
    name: "Creamy Skincare",
    category: "beleza",
    imageUrl: "/stores/creamy.png",
  },
  {
    id: 8,
    slug: "maumar",
    name: "Maumar",
    category: "mercado",
    imageUrl: "/stores/maumar.png",
  },
  {
    id: 9,
    slug: "dcarts-baskets",
    name: "d’carts & baskets",
    category: "mercado",
    imageUrl: "/stores/dcarts-baskets.png",
  },
  {
    id: 10,
    slug: "fluffy house",
    name: "Fluffy House",
    category: "casa",
    imageUrl: "/stores/fluffy-house.png",
  },
  {
    id: 11,
    slug: "electree",
    name: "electree",
    category: "eletrônicos",
    imageUrl: "/stores/electree.png",
  },
  {
    id: 12,
    slug: "roots",
    name: "Roots",
    category: "beleza",
    imageUrl: "/stores/roots.png",
  },
  {
    id: 13,
    slug: "melina couture",
    name: "Melina Couture",
    category: "moda",
    imageUrl: "/stores/melina-couture.png",
  },
  {
    id: 14,
    slug: "sneakerstore",
    name: "SneakerStore",
    category: "moda",
    imageUrl: "/stores/sneakerstore.png",
  },
];

export default function StoreList() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleFilterChange = (selected: string[]) => {
    setSelectedCategories(selected);
  };

  const filteredStores =
    selectedCategories.length === 0
      ? stores
      : stores.filter((s) => selectedCategories.includes(s.category));

  return (
    <section className="mt-10">
      {/* TÍTULO + FILTRO + VER MAIS */}
      <div className="mb-4 flex items-center justify-between gap-4">

        <h2 className="text-2xl font-bold text-black">Lojas</h2>

        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <StoresFilter onFilterChange={handleFilterChange} />
          </div>

          <a
            href="/lojas"
            className="text-sm font-semibold text-[#6A38F3]"
          >
            ver mais
          </a>
        </div>
      </div>

      {/* LISTA DE LOJAS (FILTRADA) */}
      <div className="flex gap-[30px] overflow-x-auto pb-2">
        {filteredStores.map((store) => (
          <StoreCard
            key={store.id}
            name={store.name}
            category={store.category}
            imageUrl={store.imageUrl}
            slug={store.slug}
          />
        ))}
      </div>
    </section>
  );
}
