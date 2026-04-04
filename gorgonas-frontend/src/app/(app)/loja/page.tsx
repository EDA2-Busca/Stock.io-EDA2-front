"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreCard } from "@/components/ui/StoreCard";
import api from "@/utilis/api";
import SearchBar, { SuggestionItem } from "@/components/ui/SearchBar";
import CategoryList from "@/components/CategoryList";
import StoresFilter from "@/components/ui/StoresFilter";
import { ArvoreBuscaLoja } from "@/utilis/TrieLojas";
import { useMemo } from "react";

type Loja = {
  id: number;
  nome: string;
  categoria: { nome: string };
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
  const [searchResults, setSearchResults] = useState<Loja[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const arvoreDeLojas = useMemo(() => {
    const novaArvore = new ArvoreBuscaLoja();
    if (typeof window !== "undefined") {
      (window as any).arvoreLojas = novaArvore;
    }
    return novaArvore;
  }, []);

  const handleFilterChange = (selectedCategories: string[]) => {
    console.log("Categorias selecionadas:", selectedCategories);
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setIsLoading(true);

        const fetchCategory = (categoria: string) =>
          api.get(`/lojas?categoria=${categoria}`)
            .then(res => res.data)
            .catch(err => {
              console.warn(`Categoria '${categoria}' não encontrada ou vazia.`);
              return [];
            });
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
          fetchCategory("MERCADO"),
          fetchCategory("FARMACIA"),
          fetchCategory("BELEZA"),
          fetchCategory("MODA"),
          fetchCategory("ELETRONICOS"),
          fetchCategory("JOGOS"),
          fetchCategory("BRINQUEDOS"),
          fetchCategory("CASA"),
        ]);

        setMercadoLojas(respMercado);
        setFarmaciaLojas(respFarmacia);
        setBelezaLojas(respBeleza);
        setModaLojas(respModa);
        setEletronicosLojas(respEletronicos);
        setJogosLojas(respJogos);
        setBrinquedosLojas(respBrinquedos);
        setCasaLojas(respCasa);

        const todasAsLojas = [
          ...respMercado, ...respFarmacia, ...respBeleza, ...respModa,
          ...respEletronicos, ...respJogos, ...respBrinquedos, ...respCasa
        ];

        const lojasUnicas = Array.from(new Map(todasAsLojas.map(loja => [loja.id, loja])).values());
        //Insere lojas na arvore de busca
        lojasUnicas.forEach(loja => {
          arvoreDeLojas.inserir(loja);
        });
      } catch (err) {
        console.error("Erro ao carregar lojas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setSearchResults(null);
      return;
    }
    const resultados = arvoreDeLojas.buscar(term);
    setSearchResults(resultados);
  };
  
  const handleFetchSuggestions = (term: string): SuggestionItem[] => {
    if (!term.trim()) return [];
    try {
      const resultados = arvoreDeLojas.buscar(term).slice(0, 5);
      return resultados.map((loja: Loja) => ({
        id: loja.id,
        nome: loja.nome,
        imagem: loja.logo || undefined,
        tipo: 'loja'
      }));
    } catch (error) {
      return [];
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  const renderSecao = (titulo: string, link: string, lojas: Loja[]) => {
    const listaSegura = lojas || [];
    return (
      <section className="pb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#171918]">{titulo}</h2>

          <a href={link} className="text-sm text-[#6A38F3] hover:underline">
            ver mais
          </a>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-6">
            {listaSegura.length > 0 ? (
              lojas.map((loja) => (
                <div key={loja.id} className="shrink-0 w-64">
                  <StoreCard
                    id={loja.id}
                    name={loja.nome}
                    category={loja.categoria?.nome || "Sem Categoria"}
                    imageUrl={loja.logo || "/StockIo.png"}
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
    )
  };

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
              onSearch={() => { }}
            />
          </section>

          <p className="text-center text-gray-600 text-lg">
            Carregando lojas...
          </p>
        </div>
      </main>
    );
  }


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


        <section className="py-6 flex items-center justify-between gap-6">
          <div className="w-[150px]">
            <StoresFilter onFilterChange={handleFilterChange} />
          </div>

          <SearchBar
            className="max-w-md"
            placeholder="Buscar lojas..."
            onSearch={handleSearch}
            fetchSuggestions={handleFetchSuggestions}
          />
        </section>

        {searchResults ? (
          <section className="pb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#171918]">
                Resultados para: "{searchTerm}"
              </h2>
              <button onClick={clearSearch} className="text-sm text-[#6A38F3] hover:underline">
                Limpar busca
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.length > 0 ? (
                searchResults.map(loja => (
                  <StoreCard
                    key={loja.id}
                    id={loja.id}
                    name={loja.nome}
                    category={loja.categoria?.nome || "Sem Categoria"}
                    imageUrl={loja.logo || "/StockIo.png"}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  Nenhuma loja encontrada para "{searchTerm}".
                </p>
              )}
            </div>
          </section>
        ) : (
          <>
            {renderSecao("Lojas em Mercado", "/lojas/ver-mais/mercado", mercadoLojas)}
            {renderSecao("Lojas em Farmácia", "/lojas/ver-mais/farmacia", farmaciaLojas)}
            {renderSecao("Lojas em Beleza", "/lojas/ver-mais/beleza", belezaLojas)}
            {renderSecao("Lojas em Moda", "/lojas/ver-mais/moda", modaLojas)}
            {renderSecao("Lojas em Eletrônicos", "/lojas/ver-mais/eletronicos", eletronicosLojas)}
            {renderSecao("Lojas em Jogos", "/lojas/ver-mais/jogos", jogosLojas)}
            {renderSecao("Lojas em Brinquedos", "/lojas/ver-mais/brinquedos", brinquedosLojas)}
            {renderSecao("Lojas em Casa", "/lojas/ver-mais/casa", casaLojas)}
          </>
        )}
      </div>
    </main>
  );
}
