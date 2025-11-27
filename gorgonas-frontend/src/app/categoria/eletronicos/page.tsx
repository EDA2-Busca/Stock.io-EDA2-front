'use client';

import { useState, useEffect } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import api from "@/utilis/api";
import SearchBar from '@/components/ui/SearchBar';
import StoreList from "@/components/ui/StoreList";
import { ProductRow } from "@/components/ProductRow";

// Definição do Tipo de Dados
type ProdutoParaCard = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  loja: { logo: string | null } | null;
  imagens: { urlImagem: string }[];
  avaliacoes?: { nota: number }[];
};


export default function CategoriaPage() {
  const [maisAvaliados, setMaisAvaliados] = useState<ProdutoParaCard[]>([]);
  const [recemAdicionados, setRecemAdicionados] = useState<ProdutoParaCard[]>([]);
  const [eletronicosProdutos, setEletronicosProdutos] = useState<ProdutoParaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(2);

  // Estados de Busca
  const [searchResults, setSearchResults] = useState<ProdutoParaCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (term === '') {
      clearSearch();
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await api.get(`/produtos/buscar?q=${term}&categoria=eletronicos`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchResults !== null) {
      setIsLoading(false);
      return;
    }

    const buscarDadosDaPagina = async () => {
      try {
        setIsLoading(true);
        const promisePrincipal = api.get(
          `/produtos/categoria/eletronicos?page=${currentPage}&limit=${limit}`
        );

        // 2. Mais Avaliados
        const promiseMaisAvaliados = api.get(
          '/produtos/ver-mais/eletronicos?limit=50'
        );

        const promiseRecentes = api.get(
          '/produtos/ver-mais/eletronicos?limit=10&ordenar=recentes'
        );

        const [responsePrincipal, responseAvaliados, responseRecentes] = await Promise.all([
          promisePrincipal,
          promiseMaisAvaliados,
          promiseRecentes 
        ]);

        const dadosPrincipal = responsePrincipal.data;
        const listaProdutos = dadosPrincipal.produtos || [];
        const total = dadosPrincipal.totalCount || 0;

        setEletronicosProdutos(listaProdutos);
        setTotalPages(Math.ceil(total / limit));

        let candidatos = Array.isArray(responseAvaliados.data) ? responseAvaliados.data : responseAvaliados.data.produtos || [];

        const getMedia = (prod: ProdutoParaCard) => {
          if (!prod.avaliacoes || prod.avaliacoes.length === 0) return 0;
          const soma = prod.avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
          return soma / prod.avaliacoes.length;
        };

        const listaOrdenadaPorNota = candidatos.sort((a: ProdutoParaCard, b: ProdutoParaCard) => {
          return getMedia(b) - getMedia(a);
        });

        setMaisAvaliados(listaOrdenadaPorNota.slice(0, 10));

        const listaRecentes = Array.isArray(responseRecentes.data)
            ? responseRecentes.data
            : responseRecentes.data.produtos || [];
        setRecemAdicionados(listaRecentes);

      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosDaPagina();

  }, [searchResults, currentPage, limit]);

  const dataToDisplay = searchResults || eletronicosProdutos;
  const isDisplayingSearch = searchResults !== null;
  const title = isDisplayingSearch ? `Resultados da Busca` : "";

  if (isLoading) {
    return (
      <main className="text-center p-8 bg-[#FDF9F2] min-h-screen">
        <Navbar />
        <p className="text-gray-500 text-lg mt-20">Carregando produtos...</p>
      </main>
    );
  }

  return (
    <main className="bg-[#FDF9F2] min-h-screen">

      {/* SEÇÃO HEADER */}
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        <section className="w-full h-[45vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 flex items-center h-full">
            <div className="text-white ">
              <h1 className="text-7xl font-bold leading-tight">
                O universo da tecnologia
              </h1>
              <h1 className="text-7xl font-bold leading-tight ml-70">
                em um só lugar
              </h1>
            </div>
            <div className="absolute bottom-0 right-8 w-235 h-150 -mb-50">
              <img
                src="/eletronicos-mascote.png"
                alt="mascote pagina de categoria"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>
      </header>

      <div className="max-w-[1440px] mx-auto px-8 w-full grow">
        <section className="py-6 flex justify-end">
          <SearchBar
            className="max-w-md"
            onSearch={handleSearch}
            placeholder="Buscar em Eletrônicos..."
          />
        </section>
        <section className="pb-12 pt-4">

          {isDisplayingSearch && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#171918]">
                Resultados para: "{searchTerm}"
              </h2>
              <button onClick={clearSearch} className="text-sm text-[#6A38F3] hover:underline">
                Limpar busca
              </button>
            </div>
          )}
          {!isDisplayingSearch && (
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {title}
            </h2>
          )}

          {isSearching ? (
            <div className="py-12 text-center col-span-full">
              <p className="text-gray-500">Buscando resultados...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mb-0">

              {dataToDisplay.length > 0 ? (
                dataToDisplay.map(produto => {
                  const temImagem = produto.imagens && produto.imagens.length > 0;
                  const imageUrl = temImagem
                    ? produto.imagens[0].urlImagem
                    : '/Stock.io.png';
                  const badgeUrl = produto.loja?.logo || undefined;
                  return (
                    <ProductCard
                      id={produto.id}
                      key={produto.id}
                      name={produto.nome}
                      price={produto.preco.toString()}
                      isAvailable={produto.estoque > 0}
                      imageUrl={imageUrl}
                      badgeUrl={badgeUrl}
                    />
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-500 text-lg py-12">
                  {isDisplayingSearch
                    ? `Nenhum produto encontrado para "${searchTerm}" em Eletrônicos.`
                    : 'Nenhum produto encontrado nesta categoria.'
                  }
                </p>
              )}
            </div>
          )}
        </section>

        {!isDisplayingSearch && totalPages > 1 && (
          <section className="flex justify-center items-center space-x-2 py-2 mb-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`transition-all duration-200 font-light leading-none px-5 ${currentPage === pageNumber
                  ? 'text-5xl text-black font-normal' 
                  : 'text-3xl text-[#171918]/60 hover:text-[#171918]' 
                  }`}
              >
                {pageNumber}
              </button>
            ))}
          </section>
        )}
      </div>

      {/* RODAPÉ */}
      {!isDisplayingSearch && (
        <>
          <div className="w-full h-[430px] bg-black py-10 mt-auto">
            <div className="max-w-[1440px] mx-auto px-8">
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-4xl font-500 text-white">
                  Principais Lojas
                </h2>
              </div>
              <StoreList categoria='ELETRONICOS' />
            </div>
          </div>
          <section className="pb-0 max-w-[1440px] mx-auto px-8 py-12">
            <div className="flex justify-between items-center mb-0">
              <div className="flex items-baseline gap-1">
                <h2 className="text-4xl font-500 text-[#171918]">Melhores Avaliados</h2>
              </div>
            </div>
            <ProductRow
              title=""
              products={maisAvaliados}
              viewMoreHref="/ver-mais/eletronicos"
            />
          </section>

          <section className="pb-8 max-w-[1440px] mx-auto px-8 py-0">
            <div className="flex justify-between items-center mb-0">
              <div className="flex items-baseline gap-1">
                <h2 className="text-4xl font-500 text-[#171918]">Recém adicionados</h2>
              </div>
            </div>
            <ProductRow title="" products={recemAdicionados} viewMoreHref="/ver-mais/eletronicos?ordenar=createdAt" />
          </section>
        </>
      )}
    </main>
  );
}