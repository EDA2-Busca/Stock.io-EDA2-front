'use client';

import { useState, useEffect } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import api from "@/utilis/api";
import SearchBar, { SuggestionItem } from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';
import StoreList from "@/components/ui/StoreList";
import { ProductRow } from '../components/ProductRow';

type ProdutoParaCard = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  loja: { logo: string | null } | null;
  imagens: { urlImagem: string }[];
};
const API_URL = "http://localhost:3001";

export default function HomePage() {
  const [mercadoProdutos, setMercadoProdutos] = useState<ProdutoParaCard[]>([]);
  const [farmaciaProdutos, setFarmaciaProdutos] = useState<ProdutoParaCard[]>([]);
  const [belezaProdutos, setBelezaProdutos] = useState<ProdutoParaCard[]>([]);
  const [modaProdutos, setModaProdutos] = useState<ProdutoParaCard[]>([]);
  const [eletronicosProdutos, setEletronicosProdutos] = useState<ProdutoParaCard[]>([]);
  const [jogosProdutos, setJogosProdutos] = useState<ProdutoParaCard[]>([]);
  const [brinquedosProdutos, setBrinquedosProdutos] = useState<ProdutoParaCard[]>([]);
  const [CasaProdutos, setCasaProdutos] = useState<ProdutoParaCard[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<ProdutoParaCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    // Se estivermos em "modo busca", não carregue a home
    if (searchResults) {
      setIsLoading(false);
      return;
    }

    const buscarDadosDaPagina = async () => {
      try {
        setIsLoading(true);

        const promiseMercado = api.get('/produtos/ver-mais/mercado');
        const promiseFarmacia = api.get('/produtos/ver-mais/farmacia');
        const promiseBeleza = api.get('/produtos/ver-mais/beleza');
        const promiseModa = api.get('/produtos/ver-mais/moda');
        const promiseEletronicos = api.get('/produtos/ver-mais/eletronicos');
        const promiseJogos = api.get('/produtos/ver-mais/jogos');
        const promiseBrinquedos = api.get('/produtos/ver-mais/brinquedos');
        const promiseCasa = api.get('/produtos/ver-mais/casa');

        const [responseMercado, responseFarmacia, responseBeleza, responseModa, responseEletronicos, responseJogos, responseBrinquedos, responseCasa] = await Promise.all([
          promiseMercado,
          promiseFarmacia,
          promiseBeleza,
          promiseModa,
          promiseEletronicos,
          promiseJogos,
          promiseBrinquedos,
          promiseCasa
        ]);

        setMercadoProdutos(responseMercado.data);
        setFarmaciaProdutos(responseFarmacia.data);
        setBelezaProdutos(responseBeleza.data);
        setModaProdutos(responseModa.data);
        setEletronicosProdutos(responseEletronicos.data);
        setJogosProdutos(responseJogos.data);
        setBrinquedosProdutos(responseBrinquedos.data);
        setCasaProdutos(responseCasa.data);

      } catch (err) {
        console.error("Erro ao buscar produtos da home:", err);
      } finally {
        setIsLoading(false); // Termina de carregar (com sucesso ou erro)
      }
    };

    buscarDadosDaPagina();

  }, [searchResults]);
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await api.get(`/produtos/buscar?q=${term}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  const handleFetchSuggestions = async (term: string): Promise<SuggestionItem[]> => {
    try {
      const response = await api.get(`/produtos/buscar?q=${term}`);
      const topResults = response.data.slice(0, 5);
      return topResults.map((prod: any) => {
        const rawPath = prod.imagens?.[0]?.urlImagem;
        const fullUrl = rawPath
          ? `${API_URL}/${rawPath.replace(/\\/g, '/')}`
          : undefined;

        return {
          id: prod.id,
          nome: prod.nome,
          imagem: fullUrl,
          tipo: 'produto'
        };
      });
    } catch (error) {
      console.error("Erro no autocomplete:", error);
      return [];
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };


  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        <section className="w-full h-[45vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 flex items-center h-full">
            <div className="text-white ">
              <h1 className="text-7xl font-bold leading-tight">
                Do CAOS à organização,
              </h1>
              <h1 className="text-7xl font-bold leading-tight ml-50">
                em alguns cliques
              </h1>
            </div>
            <div className="absolute bottom-0 right-8 w-235 h-150 -mb-50">
              <img
                src="/Group 30.png"
                alt="Ilustração de uma pessoa organizando caixas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>
      </header>

      <div className="max-w-7xl mx-auto px-8">

        <section className="py-6">
          <SearchBar
            className="max-w-md ml-auto"
            onSearch={handleSearch}
            fetchSuggestions={handleFetchSuggestions}
          />
        </section>

        {searchResults ? ( 

          <section className="pb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#171918]">
                Resultados para: "{searchTerm}"
              </h2>
              <button onClick={clearSearch} className="text-sm text-[#6A38F3] hover:underline">
                Limpar busca
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {isSearching ? (
                <p className="col-span-full text-center text-gray-500">Buscando...</p>
              ) : searchResults.length > 0 ? (
                searchResults.map(produto => (
                  <ProductCard
                    key={produto.id}
                    id={produto.id}
                    name={produto.nome}
                    price={produto.preco.toString()}
                    isAvailable={produto.estoque > 0}
                    imageUrl={produto.imagens?.[0]?.urlImagem || '/Stock.io.png'}
                    badgeUrl={produto.loja?.logo || undefined}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg">
                  Nenhum produto encontrado para "{searchTerm}".
                </p>
              )}
            </div>
          </section>
        ) : ( 
          <>
            <section className="pb-6">
              <CategoryList />
            </section>

            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">Carregando...</p>
              </div>
            ) : (
              <>
                <section className="pb-12">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-2xl font-bold text-[#171918]">Produtos</h2>
                      <h2 className="text-sm text-[#6A38F3]">em mercado</h2>
                    </div>
                  </div>
                  <ProductRow
                    products={mercadoProdutos}
                    viewMoreHref="/ver-mais/mercado"
                  />
                </section>

                <section className="pb-12">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-2xl font-bold text-[#171918]">Produtos</h2>
                      <h2 className="text-sm text-[#6A38F3]">em beleza</h2>
                    </div>
                  </div>
                  <ProductRow
                    products={belezaProdutos}
                    viewMoreHref="/ver-mais/beleza"
                  />
                </section>
                <section className="pb-12">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-2xl font-bold text-[#171918]">Produtos</h2>
                      <h2 className="text-sm text-[#6A38F3]">em moda</h2>
                    </div>
                  </div>
                  <ProductRow
                    products={modaProdutos}
                    viewMoreHref="/ver-mais/moda"
                  />
                </section>
                <section className="pb-12">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                      <h2 className="text-2xl font-bold text-[#171918]">Produtos</h2>
                      <h2 className="text-sm text-[#6A38F3]">em eletrônicos</h2>
                    </div>
                  </div>
                  <ProductRow
                    products={eletronicosProdutos}
                    viewMoreHref="/ver-mais/eletronicos"
                  />
                </section>
                <StoreList />
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}