'use client';

import { useState, useEffect, useMemo } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import api from "@/utilis/api";
import SearchBar, { SuggestionItem } from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';
import { ProductRow, ProdutoParaCard } from '@/components/ProductRow';
import { ArvoreBusca } from "@/utilis/Trie";

export default function HomePage() {

  // --- Estados das Categorias (sem mudança) ---
  const [mercadoProdutos, setMercadoProdutos] = useState<ProdutoParaCard[]>([]);
  const [farmaciaProdutos, setFarmaciaProdutos] = useState<ProdutoParaCard[]>([]);
  const [belezaProdutos, setBelezaProdutos] = useState<ProdutoParaCard[]>([]);
  const [modaProdutos, setModaProdutos] = useState<ProdutoParaCard[]>([]);
  const [eletronicosProdutos, setEletronicosProdutos] = useState<ProdutoParaCard[]>([]);
  const [jogosProdutos, setJogosProdutos] = useState<ProdutoParaCard[]>([]);
  const [brinquedosProdutos, setBrinquedosProdutos] = useState<ProdutoParaCard[]>([]);
  const [CasaProdutos, setCasaProdutos] = useState<ProdutoParaCard[]>([]);

  const [listarProdutos, setListarProdutos] = useState<ProdutoParaCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(15);

  const [isLoading, setIsLoading] = useState(true);

  const [searchResults, setSearchResults] = useState<ProdutoParaCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const arvoreDeProdutos = useMemo(() => {
    return new ArvoreBusca();
  }, []);


  useEffect(() => {
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
        const promiseListar = api.get(
          `/produtos/recentes?page=${currentPage}&limit=${limit}`
        );
        const [responseMercado, responseFarmacia, responseBeleza, responseModa, responseEletronicos, responseJogos, responseBrinquedos, responseCasa, responseListar] = await Promise.all([
          promiseMercado,
          promiseFarmacia,
          promiseBeleza,
          promiseModa,
          promiseEletronicos,
          promiseJogos,
          promiseBrinquedos,
          promiseCasa,
          promiseListar
        ]);

        console.log("Produto exemplo:", responseMercado?.data?.[0]);

        setMercadoProdutos(responseMercado.data);
        setFarmaciaProdutos(responseFarmacia.data);
        setBelezaProdutos(responseBeleza.data);
        setModaProdutos(responseModa.data);
        setEletronicosProdutos(responseEletronicos.data);
        setJogosProdutos(responseJogos.data);
        setBrinquedosProdutos(responseBrinquedos.data);
        setCasaProdutos(responseCasa.data);
        setListarProdutos(responseListar.data.produtos);
        const totalCount = responseListar.data.totalCount;
        setTotalPages(Math.ceil(totalCount / limit));

        const addCat = (lista: any[], cat: string) => lista.map(p => ({ ...p, categoriaBusca: cat }));

        const todosOsProdutos = [
          ...addCat(responseMercado.data, "mercado"),
          ...addCat(responseFarmacia.data, "farmacia"),
          ...addCat(responseBeleza.data, "beleza"),
          ...addCat(responseModa.data, "moda"),
          ...addCat(responseEletronicos.data, "eletrônicos"),
          ...addCat(responseJogos.data, "jogos"),
          ...addCat(responseBrinquedos.data, "brinquedos"),
          ...addCat(responseCasa.data, "casa"),
          ...responseListar.data.produtos
        ];

        const produtosUnicos = Array.from(new Map(todosOsProdutos.map(p => [p.id, p])).values());

        produtosUnicos.forEach(produto => {
          const nomeOriginal = produto.nome;

          if (produto.categoriaBusca) {
            produto.nome = `${nomeOriginal} ${produto.categoriaBusca}`;
          }

          arvoreDeProdutos.inserir(produto);

          produto.nome = nomeOriginal;
        });

        if (typeof window !== "undefined") {
          (window as any).arvoreHome = arvoreDeProdutos;
        }

      } catch (err) {
        console.error("Erro ao buscar produtos da home:", err);
      } finally {
        setIsLoading(false);
      }
    };
    buscarDadosDaPagina();
  }, [currentPage, limit, searchResults]);

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (!term.trim()) {
      clearSearch();
      return;
    }

    setIsSearching(true);
    const resultados = arvoreDeProdutos.buscar(term);
    setSearchResults(resultados);
    setIsSearching(false);
  };

  const handleFetchSuggestions = (term: string): SuggestionItem[] => {
    if (!term.trim()) return [];
    try {
      const resultados = arvoreDeProdutos.buscar(term).slice(0, 5);
      return resultados.map((prod: ProdutoParaCard) => ({
        id: prod.id,
        nome: prod.nome,
        imagem: prod.imagens?.[0]?.urlImagem || undefined,
        tipo: 'produto'
      }));
    } catch (error) {
      return [];
    }
  };

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
            onSearch={handleSearch} // Passa a função para o componente
            placeholder="Buscar por produto ou categoria..."
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
            {isLoading ? (
              <div className="py-12 text-center">
                <p className="text-gray-500 text-lg">Carregando...</p>
              </div>
            ) : (
              <>
                <ProductRow
                  title="Mercado"
                  products={mercadoProdutos}
                  viewMoreHref="/ver-mais/mercado"
                />
                <ProductRow
                  title="Farmácia"
                  products={farmaciaProdutos}
                  viewMoreHref="/ver-mais/farmacia"
                />
                <ProductRow
                  title="Beleza"
                  products={belezaProdutos}
                  viewMoreHref="/ver-mais/beleza"
                />
                <ProductRow
                  title="Moda"
                  products={modaProdutos}
                  viewMoreHref="/ver-mais/moda"
                />
                <ProductRow
                  title="Eletrônicos"
                  products={eletronicosProdutos}
                  viewMoreHref="/ver-mais/eletronicos"
                />
                <ProductRow
                  title="Jogos"
                  products={jogosProdutos}
                  viewMoreHref="/ver-mais/jogos"
                />
                <ProductRow
                  title="Brinquedos"
                  products={brinquedosProdutos}
                  viewMoreHref="/ver-mais/brinquedos"
                />
                <ProductRow
                  title="Casa"
                  products={CasaProdutos}
                  viewMoreHref="/ver-mais/casa"
                />

                {/* Lista de Produtos Paginada */}
                <section>
                  <div className="container mx-auto max-w-7xl p-4 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                      {listarProdutos.length > 0 ? (
                        listarProdutos.map(produto => {
                          const imageUrl = produto.imagens?.[0]?.urlImagem || '/Stock.io.png';
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
                        <p className="col-span-full text-center text-gray-500 text-lg">
                          Ops! Nenhum produto foi encontrado.
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Paginação */}
                <section className="flex justify-center items-center space-x-2 py-8">

                  {/* Botão "Anterior" */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  {/* Botões de Número */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-4 py-2 rounded shadow-sm ${currentPage === pageNumber
                        ? 'bg-[#6A38F3] text-white'
                        : 'bg-white text-black'
                        }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Botão "Próximo" */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50"
                  >
                    Próximo
                  </button>

                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}