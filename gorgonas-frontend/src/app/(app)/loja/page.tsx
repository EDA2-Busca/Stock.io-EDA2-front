"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreCard } from "@/components/ui/StoreCard";
import api from "@/utilis/api";
import SearchBar from "@/components/ui/SearchBar";
import CategoryList from "@/components/CategoryList";
import StoresFilter from "@/components/ui/StoresFilter";

type Loja = {
  id: number;
  nome: string;
  categoria: string;
  logo: string | null;
  slug?: string;
};

export default function LojasPage() {
  const [categorias, setCategorias] = useState<{ slug: string; lojas: Loja[] }[]>([]);
  const [filteredLojas, setFilteredLojas] = useState<Loja[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Categorias usadas no backend
  const CATEGORY_SLUGS = [
    "mercado",
    "farmacia",
    "beleza",
    "moda",
    "eletronicos",
    "jogos",
    "brinquedos",
    "casa",
  ];


  const fetchAllCategories = async () => {
    setIsLoading(true);
    try {
      const responses = await Promise.all(
        CATEGORY_SLUGS.map((slug) => api.get(`/lojas/categoria/${slug}`))
      );

      const mapped = CATEGORY_SLUGS.map((slug, index) => ({
        slug,
        lojas: responses[index].data,
      }));

      setCategorias(mapped);
      setFilteredLojas(null); // limpa o filtro
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);


  const handleFilterChange = async (selected: string[]) => {
    // Sem filtros → volta ao modo original
    if (selected.length === 0) {
      setFilteredLojas(null);
      return;
    }

    setIsLoading(true);
    try {
      const responses = await Promise.all(
        selected.map((slug) => api.get(`/lojas/categoria/${slug}`))
      );

      // Junta todas as lojas das categorias marcadas
      const merged = responses.flatMap((resp) => resp.data);
      setFilteredLojas(merged);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

 
  const renderSecao = (titulo: string, lojas: Loja[]) => (
    <section className="pb-12">
      <h2 className="text-2xl font-bold text-[#171918] mb-4">{titulo}</h2>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-nowrap gap-6">
          {lojas.length > 0 ? (
            lojas.map((loja) => (
              <div key={loja.id} className="shrink-0 w-64">
                <StoreCard
                  name={loja.nome}
                  category={loja.categoria}
                  imageUrl={loja.logo || "/StockIo.png"}
                  slug={String(loja.id)}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">
              Nenhuma loja encontrada nesta categoria.
            </p>
          )}
        </div>
      </div>
    </section>
  );


  if (isLoading) {
    return (
      <main className="bg-[#FDF9F2] min-h-screen">
        <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
          <Navbar />
          <section className="w-full h-[30vh] flex items-center justify-center [&_h2]:text-white">
            <CategoryList />
          </section>
        </header>

        <div className="max-w-7xl mx-auto px-8">
          <p className="text-center text-gray-600 text-lg mt-12">
            Carregando lojas...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <Navbar />
        <section className="w-full h-[30vh] flex items-center justify-center [&_h2]:text-white">
          <CategoryList />
        </section>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        {/* Barra de busca + Filtro */}
        <section className="py-6 flex justify-between items-center">
          <StoresFilter onFilterChange={handleFilterChange} />
          <SearchBar className="max-w-md" onSearch={() => {}} />
        </section>

        {/* Se filtro aplicado → mostrar só UMA seção */}
        {filteredLojas ? (
          renderSecao("Lojas Filtradas", filteredLojas)
        ) : (
          <>
            {categorias.map((cat) =>
              renderSecao(`Lojas em ${cat.slug.charAt(0).toUpperCase() + cat.slug.slice(1)}`, cat.lojas)
            )}
          </>
        )}
      </div>
    </main>
  );
}
