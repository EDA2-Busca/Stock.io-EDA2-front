'use client';

import { useEffect, useState } from "react";
import api from "@/utilis/api";
import { StoreCard } from "./StoreCard";

type Loja = {
  id: number;
  nome: string;
  categoria: { nome: string } | null;
  logo: string | null;
};

interface StoreListProps {
  categoria?: string; // Opcional: se não passar, busca todas
}

export default function StoreList({ categoria }: StoreListProps) {
  const [stores, setStores] = useState<Loja[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">Lojas</h2>

        <a
          href="/lojas"
          className="text-sm font-semibold text-[#6A38F3]"
        >
          ver mais
        </a>
      </div>

      <div className="flex gap-[30px] overflow-x-auto pb-2">
        {loading && <p className="text-gray-500">Carregando...</p>}

        {!loading && stores.length > 0 && stores.map((store) => (
          <StoreCard
            key={store.id}
            id={store.id}
            name={store.nome}
            category={store.categoria?.nome || "categoria"}
            imageUrl={store.logo || "/StockIo.png"}
          />
        ))}

        {!loading && stores.length === 0 && (
          <p className="text-gray-500">Nenhuma loja encontrada.</p>
        )}
      </div>
    </section>
  );
}