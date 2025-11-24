"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreCard } from "@/components/ui/StoreCard";
import api from "@/utilis/api"; 
import SearchBar from "@/components/ui/SearchBar";
import CategoryList from "@/components/CategoryList";

// Tipo dos dados vindos da API
type Loja = {
  id: number;
  nome: string;
  categoria: string; 
  logo: string | null;
  slug?: string; // Se não tiver slug no backend, vou gerar abaixo
};

export default function LojasPage() {
  // Estados por categoria (mesmo padrão do seu amigo na página de produtos)
  const [mercadoLojas, setMercadoLojas] = useState<Loja[]>([]);
  const [farmaciaLojas, setFarmaciaLojas] = useState<Loja[]>([]);
  const [belezaLojas, setBelezaLojas] = useState<Loja[]>([]);
  const [modaLojas, setModaLojas] = useState<Loja[]>([]);
  const [eletronicosLojas, setEletronicosLojas] = useState<Loja[]>([]);
  const [jogosLojas, setJogosLojas] = useState<Loja[]>([]);
  const [brinquedosLojas, setBrinquedosLojas] = useState<Loja[]>([]);
  const [casaLojas, setCasaLojas] = useState<Loja[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  //  Buscar da API
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);

        // ⚠️ Ajuste os endpoints se forem diferentes
        const promiseMercado = api.get("/lojas/ver-mais/mercado");
        const promiseFarmacia = api.get("/lojas/ver-mais/farmacia");
        const promiseBeleza = api.get("/lojas/ver-mais/beleza");
        const promiseModa = api.get("/lojas/ver-mais/moda");
        const promiseEletronicos = api.get("/lojas/ver-mais/eletronicos");
        const promiseJogos = api.get("/lojas/ver-mais/jogos");
        const promiseBrinquedos = api.get("/lojas/ver-mais/brinquedos");
        const promiseCasa = api.get("/lojas/ver-mais/casa");

        const [
          respMercado,
          respFarmacia,
          respBeleza,
          respModa,
          respEletronicos,
          respJogos,
          respBrinquedos,
          respCasa,
        ] = await Promise.all([
          promiseMercado,
          promiseFarmacia,
          promiseBeleza,
          promiseModa,
          promiseEletronicos,
          promiseJogos,
          promiseBrinquedos,
          promiseCasa,
        ]);

        console.log("lojas Mercado:", respMercado.data);
        console.log("Lojas Farmácia:", respFarmacia.data);

        // Salvando estados
        setMercadoLojas(respMercado.data);
        setFarmaciaLojas(respFarmacia.data);
        setBelezaLojas(respBeleza.data);
        setModaLojas(respModa.data);
        setEletronicosLojas(respEletronicos.data);
        setJogosLojas(respJogos.data);
        setBrinquedosLojas(respBrinquedos.data);
        setCasaLojas(respCasa.data);
      } catch (err) {
        console.error("Erro ao carregar lojas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Função para renderizar cada seção (evita repetição)
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
                  slug={loja.slug ?? String(loja.id)} // fallback caso API não mande slug
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
            <SearchBar
              className="max-w-md ml-auto"
              onSearch={() => {}}
            />
          </section>

          <p className="text-center text-gray-600 text-lg">
            Carregando lojas...
          </p>
        </div>
      </main>
    );
  }

  // QUANDO NÃO ESTÁ CARREGANDO, RENDER NORMAL
  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      {/* HEADER IGUAL AO DE PRODUTOS */}
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
        {/* SearchBar */}
        <section className="py-6">
          <SearchBar
            className="max-w-md ml-auto"
            onSearch={() => {}}
          />
        </section>

        {/* SEÇÕES DE LOJAS */}
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
