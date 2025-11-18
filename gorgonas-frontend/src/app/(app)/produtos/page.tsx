'use client';

import { useState, useEffect } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard'; // <-- 1. IMPORTADO PARA OS RESULTADOS
import api from "@/utilis/api";
import SearchBar from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';
import { ProductRow } from '@/components/ProductRow'; // (Seu componente refatorado)

type ProdutoParaCard = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  loja: { logo: string | null } | null;
  imagens: { urlImagem: string }[];
};


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

  // --- Estados da Paginação (sem mudança) ---
  const [listarProdutos, setListarProdutos] = useState<ProdutoParaCard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(15);
  
  const [isLoading, setIsLoading] = useState(true);

  // --- 2. NOVOS ESTADOS PARA A BUSCA ---
  const [searchResults, setSearchResults] = useState<ProdutoParaCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


  // --- useEffect (ATUALIZADO) ---
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

        } catch (err) {
          console.error("Erro ao buscar produtos da home:", err);
        } finally {
          setIsLoading(false); 
        }
      };
      buscarDadosDaPagina();
  }, [currentPage, limit, searchResults]); // <-- 'searchResults' agora controla este efeito

  // --- 3. NOVA FUNÇÃO DE BUSCA (Chamada pelo SearchBar) ---
  const handleSearch = async (term: string) => {
    setSearchTerm(term); 
    setIsSearching(true); 
    setSearchResults([]); 

    try {
      // (Depende do endpoint 'GET /produtos/buscar?q=...' no seu backend)
      const response = await api.get(`/produtos/buscar?q=${term}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setSearchResults([]); 
    } finally {
      setIsSearching(false); 
    }
  };

  // --- 4. NOVA FUNÇÃO PARA LIMPAR A BUSCA ---
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults(null); // Define como 'null' para voltar à home
  };


  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      {/* --- Header e Hero (sem mudança) --- */}
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        <section className="w-full h-[30vh] flex items-center justify-center [&_h2]:text-white">
            <div>
                <CategoryList/>
            </div>
        </section>
      </header>
      
      <div className="max-w-7xl mx-auto px-8">
        
        {/* --- 5. SearchBar ATUALIZADA --- */}
        <section className="py-6">
          <SearchBar 
            className="max-w-md ml-auto" 
            onSearch={handleSearch} // Passa a função para o componente
            placeholder="Buscar por produto, loja ou categoria..."
          />
        </section>

        {/* --- 6. LÓGICA DE RENDERIZAÇÃO --- */}
        {/* Mostra os resultados da busca OU as categorias */}
        
        {searchResults ? ( // Se 'searchResults' NÃO for nulo, mostre a busca
          
          // --- SEÇÃO DE RESULTADOS DA BUSCA ---
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
                  // Usamos ProductCard aqui (uma grade)
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

        ) : ( // Se 'searchResults' for nulo, mostre a home normal
          
          // --- SEÇÃO DE CATEGORIAS (Seu código original) ---
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
                      className={`px-4 py-2 rounded shadow-sm ${
                        currentPage === pageNumber 
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