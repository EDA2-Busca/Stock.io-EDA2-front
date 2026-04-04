'use client';

import { useState, useEffect, useMemo } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import api from "@/utilis/api";
import SearchBar, { SuggestionItem } from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';
import { ProductRow, ProdutoParaCard } from '@/components/ProductRow';

import { ArvoreBusca } from "@/utilis/Trie";
import { ArvoreBuscaCategoria } from "@/utilis/TrieCategorias";

type CategoriaComProdutos = {
  id: number;
  nome: string;
  slug: string;
  produtos: ProdutoParaCard[];
};

export default function HomePage() {

  const [categoriasData, setCategoriasData] = useState<CategoriaComProdutos[]>([]);
  const [listarProdutos, setListarProdutos] = useState<ProdutoParaCard[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  const [searchResults, setSearchResults] = useState<ProdutoParaCard[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const arvoreDeProdutos = useMemo(() => new ArvoreBusca(), []);
  const arvoreDeCategorias = useMemo(() => new ArvoreBuscaCategoria(), []);

  useEffect(() => {
    if (searchResults) {
      setIsLoading(false);
      return;
    }

    const buscarDadosDaPagina = async () => {
      try {
        setIsLoading(true);

        const responseCategorias = await api.get('/categorias'); 
        const listaCategorias = responseCategorias.data; 

        const promessasProdutos = listaCategorias.map((cat: any) => {
          const slug = cat.slug || cat.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          return api.get(`/produtos/ver-mais/${slug}`).catch(() => ({ data: [] })); 
        });

        const promiseListar = api.get(`/produtos/recentes?page=${currentPage}&limit=${limit}`);

        const resultadosProdutos = await Promise.all(promessasProdutos);
        const responseListar = await promiseListar;

        let todosOsProdutosParaArvore: ProdutoParaCard[] = [...(responseListar.data.produtos || [])];
        const categoriasMontadasNaTela: CategoriaComProdutos[] = [];

        listaCategorias.forEach((cat: any, index: number) => {
           const produtosDaCategoria = resultadosProdutos[index].data || [];
           const slug = cat.slug || cat.nome.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

           // Árvore de Categorias 
           arvoreDeCategorias.inserir({
             id: cat.id,
             nome: cat.nome,
             produtos: produtosDaCategoria
           });

           categoriasMontadasNaTela.push({
             id: cat.id,
             nome: cat.nome,
             slug: slug,
             produtos: produtosDaCategoria
           });

           todosOsProdutosParaArvore = [...todosOsProdutosParaArvore, ...produtosDaCategoria];
        });

        const produtosUnicos = Array.from(new Map(todosOsProdutosParaArvore.map(p => [p.id, p])).values());
        produtosUnicos.forEach(produto => {
          arvoreDeProdutos.inserir(produto);
        });

        setCategoriasData(categoriasMontadasNaTela);
        setListarProdutos(responseListar.data.produtos || []);
        setTotalPages(Math.ceil((responseListar.data.totalCount || 0) / limit));

      } catch (err) {
        console.error("Erro ao buscar dados dinâmicos da home:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    buscarDadosDaPagina();
  }, [currentPage, limit, searchResults, arvoreDeCategorias, arvoreDeProdutos]);

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
    const categoriasEncontradas = arvoreDeCategorias.buscar(term);
    const produtosEncontrados = arvoreDeProdutos.buscar(term);

    let resultadosFinais = [...produtosEncontrados];
    categoriasEncontradas.forEach(categoria => {
        resultadosFinais = [...resultadosFinais, ...categoria.produtos];
    });

    const unicos = Array.from(new Map(resultadosFinais.map(p => [p.id, p])).values());
    setSearchResults(unicos);
    setIsSearching(false);
  };

  const handleFetchSuggestions = (term: string): SuggestionItem[] => {
    if (!term.trim()) return [];
    try {
      const categorias = arvoreDeCategorias.buscar(term);
      const produtos = arvoreDeProdutos.buscar(term);

      const sugestoesCat = categorias.map(c => ({
        id: -c.id,
        nome: `Categoria: ${c.nome}`, 
        tipo: 'categoria'
      }));

      const sugestoesProd = produtos.slice(0, 5).map(p => ({
        id: p.id,
        nome: p.nome,
        imagem: p.imagens?.[0]?.urlImagem || undefined,
        tipo: 'produto'
      }));

      return [...sugestoesCat, ...sugestoesProd].slice(0, 7);
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
          <div><CategoryList /></div>
        </section>
      </header>

      <div className="max-w-7xl mx-auto px-8">
        <section className="py-6">
          <SearchBar
            className="max-w-md ml-auto"
            onSearch={handleSearch} 
            placeholder="Buscar por produto ou categoria..."
            fetchSuggestions={handleFetchSuggestions}
          />
        </section>

        {searchResults ? (
          <section className="pb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#171918]">Resultados para: "{searchTerm}"</h2>
              <button onClick={clearSearch} className="text-sm text-[#6A38F3] hover:underline">Limpar busca</button>
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
                <p className="col-span-full text-center text-gray-500 text-lg">Nenhum produto encontrado.</p>
              )}
            </div>
          </section>
        ) : (
          <>
            {isLoading ? (
              <div className="py-12 text-center"><p className="text-gray-500 text-lg">Carregando...</p></div>
            ) : (
              <>
                {categoriasData.map(categoria => (
                   <ProductRow
                      key={categoria.id}
                      title={categoria.nome}
                      products={categoria.produtos}
                      viewMoreHref={`/ver-mais/${categoria.slug}`}
                   />
                ))}

                <section>
                  <div className="container mx-auto max-w-7xl p-4 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                      {listarProdutos.length > 0 ? (
                        listarProdutos.map(produto => (
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
                        <p className="col-span-full text-center text-gray-500 text-lg">Ops! Nenhum produto foi encontrado.</p>
                      )}
                    </div>
                  </div>
                </section>
                <section className="flex justify-center items-center space-x-2 py-8">
                  <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50">Anterior</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                    <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`px-4 py-2 rounded shadow-sm ${currentPage === pageNumber ? 'bg-[#6A38F3] text-white' : 'bg-white text-black'}`}>{pageNumber}</button>
                  ))}
                  <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded bg-white text-black shadow-sm disabled:opacity-50">Próximo</button>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}