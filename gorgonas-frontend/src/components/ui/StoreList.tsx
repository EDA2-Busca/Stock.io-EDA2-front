"use client";

import { useEffect, useState } from "react";
import api from "@/utilis/api";
import { StoreCard } from "./StoreCard";
import StoresFilter from "@/components/ui/StoresFilter";

type Loja = {
  id: number;
  nome: string;
  categoria: { nome: string } | null;
  logo: string | null;
};

interface StoreListProps {
  categoria?: string;
}

export default function StoreList({ categoria }: StoreListProps) {
  const [stores, setStores] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Carregar lojas da API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const url = categoria
          ? `/lojas?categoria=${categoria}`
          : "/lojas";

        const res = await api.get(url);
        setStores(res.data);
      } catch (e) {
        console.error("Erro ao carregar lojas", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [categoria]);

  // Aplicar filtro
  const filteredStores =
    selectedCategories.length === 0
      ? stores
      : stores.filter((s) =>
          selectedCategories.includes(s.categoria?.nome || "")
        );

  return (
    <section className="mt-10">
      {/* TÍTULO + FILTRO + VER MAIS */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-black">Lojas</h2>

        <div className="flex items-center gap-6 relative">
          <div className="w-auto">
            <StoresFilter onFilterChange={setSelectedCategories} />
          </div>

          <a
            href="/lojas"
            className="text-sm font-semibold text-[#6A38F3]"
          >
            ver mais
          </a>
        </div>
      </div>

      {/* LISTA DE LOJAS */}
      <div className="flex gap-[30px] overflow-x-auto pb-2">
        {loading && <p className="text-gray-500">Carregando...</p>}

        {!loading &&
          filteredStores.length > 0 &&
          filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.nome}
              category={store.categoria?.nome || "categoria"}
              imageUrl={store.logo || "/StockIo.png"}
            />
          ))}

        {!loading && filteredStores.length === 0 && (
          <p className="text-gray-500">Nenhuma loja encontrada.</p>
        )}
      </div>
    </section>
  );
}