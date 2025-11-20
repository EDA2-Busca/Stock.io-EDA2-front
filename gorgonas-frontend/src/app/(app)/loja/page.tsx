"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreCard } from "@/components/ui/StoreCard";
import api from "@/utilis/api";
import SearchBar from "@/components/ui/SearchBar";
import CategoryList from "@/components/CategoryList";

type Loja = {
  id: number;
  nome: string;
  categoria: string;
  logo: string | null;
  slug?: string;
};

export default function LojasPage() {
  const [mercadoLojas, setMercadoLojas] = useState<Loja[]>([]);
  const [farmaciaLojas, setFarmaciaLojas] = useState<Loja[]>([]);
  const [belezaLojas, setBelezaLojas] = useState<Loja[]>([]);
  const [modaLojas, setModaLojas] = useState<Loja[]>([]);
  const [eletronicosLojas, setEletronicosLojas] = useState<Loja[]>([]);
  const [jogosLojas, setJogosLojas] = useState<Loja[]>([]);
  const [brinquedosLojas, setBrinquedosLojas] = useState<Loja[]>([]);
  const [casaLojas, setCasaLojas] = useState<Loja[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/lojas");

        console.log("Resposta de /lojas:", response.data);

        const lojasApi = response.data as any[];

        const lojas: Loja[] = lojasApi.map((loja) => ({
          id: loja.id,
          nome: loja.nome,
          categoria: loja.categoria?.nome ?? "",
          logo: loja.logo_url ?? loja.banner_url ?? null,
          slug: loja.slug ?? String(loja.id),
        }));

        // separando por categoria
        setMercadoLojas(lojas.filter((l) => l.categoria.toLowerCase() === "mercado"));
        setFarmaciaLojas(lojas.filter((l) => l.categoria.toLowerCase() === "farmácia" || l.categoria.toLowerCase() === "farmacia"));
        setBelezaLojas(lojas.filter((l) => l.categoria.toLowerCase() === "beleza"));
        setModaLojas(lojas.filter((l) => l.categoria.toLowerCase() === "moda"));
        setEletronicosLojas(lojas.filter((l) => l.categoria.toLowerCase() === "eletrônicos" || l.categoria.toLowerCase() === "eletronicos"));
        setJogosLojas(lojas.filter((l) => l.categoria.toLowerCase() === "jogos"));
        setBrinquedosLojas(lojas.filter((l) => l.categoria.toLowerCase() === "brinquedos"));
        setCasaLojas(lojas.filter((l) => l.categoria.toLowerCase() === "casa"));

      } catch (err) {
        console.error("Erro ao carregar lojas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // componente para renderizar seção
  const renderSecao = (titulo: string, link: string, lojas: Loja[]) => (
    <section className="pb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#171918]">{titulo}</h2>
        <a href={link} className="text-sm text-[#6A38F3] hover:underline">
          ver mais
        </a>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-nowrap gap-6">
          {lojas.length > 0 ? (
            lojas.map((loja) => (
              <div key={loja.id} className="shrink-0 w-64">
                <StoreCard
                  name={loja.nome}
                  category={loja.categoria}
                  imageUrl={loja.logo || "/StockIo.png"}
                  slug={loja.slug}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-lg">
              Nenhuma loja foi encontrada nesta categoria.
            </p>
          )}
        </div>
      </div>
    </section>
  );

  // tela de loading
  if (isLoading) {
    return (
      <main className="bg-[#FDF9F2] min-h-screen">
        <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
          <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
          <Navbar />

          <section className="w-full h-[30vh] flex items-center justify-center [&_h2]:text-white">
            <div>
              <CategoryList />
            </div>
          </section>
        </header>

        <div className="max-w-7xl mx-auto px-8">
          <section className="py-6">
            <SearchBar className="max-w-md ml-auto" onSearch={() => {}} />
          </section>

          <p className="text-center text-gray-600 text-lg">
            Carregando lojas...
          </p>
        </div>
      </main>
    );
  }

  // página carregada
  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        <section className="w-full h-[30vh] flex items-center justify-center [&_h2]:text-white">
          <div>
            <CategoryList />
          </div>
        </section>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        <section className="py-6">
          <SearchBar className="max-w-md ml-auto" onSearch={() => {}} />
        </section>

        {renderSecao("Lojas em Mercado", "/lojas/ver-mais/mercado", mercadoLojas)}
        {renderSecao("Lojas em Farmácia", "/lojas/ver-mais/farmacia", farmaciaLojas)}
        {renderSecao("Lojas em Beleza", "/lojas/ver-mais/beleza", belezaLojas)}
        {renderSecao("Lojas em Moda", "/lojas/ver-mais/moda", modaLojas)}
        {renderSecao("Lojas em Eletrônicos", "/lojas/ver-mais/eletronicos", eletronicosLojas)}
        {renderSecao("Lojas em Jogos", "/lojas/ver-mais/jogos", jogosLojas)}
        {renderSecao("Lojas em Brinquedos", "/lojas/ver-mais/brinquedos", brinquedosLojas)}
        {renderSecao("Lojas em Casa", "/lojas/ver-mais/casa", casaLojas)}
      </div>
    </main>
  );
}
