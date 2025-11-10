'use client';

import { useState, useEffect } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import api from "@/utilis/api";
import SearchBar from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';

type ProdutoParaCard = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  loja: { logo: string | null } | null;
  imagens: { urlImagem: string }[];
};


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

  useEffect(() => {

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
      
    }, []);

  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      {/* --- Seção Hero e Navbar (Agrupadas) --- */}
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        {/* --- Seção Hero (Conteúdo) --- */}
        <section className="w-full h-[45vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 flex items-center h-full">
            <div className="text-white max-w-3xl">
              <h1 className="text-7xl font-bold leading-tight">
                Do CAOS à organização, em alguns cliques
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

      {/* --- Container Principal (para todo o conteúdo abaixo do Hero) --- */}
      <div className="max-w-7xl mx-auto px-8">
        {/* --- Seção de Pesquisa (NOVA) --- */}
        <section className="py-6">
          <SearchBar className="max-w-md ml-auto" />
        </section>

        {/* --- Seção de Categorias (NOVA) --- */}
        <section className="pb-6">
          <CategoryList />
        </section>

        {/* --- Seção de Produtos (Existente) --- */}
        <section className="pb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#171918]">Produtos em Mercado</h2>
            <a href="/ver-mais/mercado" className="text-sm text-[#6A38F3] hover:underline">
              ver mais
            </a>
          </div>

          <div className="overflow-x-auto pb-4">
              
              {/* 2. O "TRILHO" (flexível, em linha única) */}
              <div className="flex flex-nowrap gap-6">

                {/* 3. A "Guarda" (continua igual) */}
                {mercadoProdutos.length > 0 ? (

                  // 4. O "Motor" (SEM .slice() agora)
                  mercadoProdutos.map(produto => (
                    
                    // 5. O "Item" (com largura fixa e sem encolher)
                    <div key={produto.id} className="flex-shrink-0 w-64"> 
                      {/* (w-64 = 256px. Ajuste este valor se o card ficar muito grande ou pequeno) */}
                      
                      <ProductCard
                        name={produto.nome}
                        price={produto.preco.toString()} 
                        isAvailable={produto.estoque > 0}
                        imageUrl={produto.imagens?.[0]?.urlImagem || '/Stock.io.png'}
                        badgeUrl={produto.loja?.logo || undefined}
                      />
                    </div>
                  ))

                ) : (
                  <p className="text-center text-gray-500 text-lg">
                    Ops! Nenhum produto foi encontrado nesta categoria.
                  </p>
                )}
              </div>
            </div>
        </section>

        {/*Beleza*/}
        <section className="pb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#171918]">Produtos em Beleza</h2>
            <a href="/ver-mais/beleza" className="text-sm text-[#6A38F3] hover:underline">
              ver mais
            </a>
          </div>

          <div className="overflow-x-auto pb-4">
              
              {/* 2. O "TRILHO" (flexível, em linha única) */}
              <div className="flex flex-nowrap gap-6">

                {/* 3. A "Guarda" (continua igual) */}
                {belezaProdutos.length > 0 ? (

                  // 4. O "Motor" (SEM .slice() agora)
                  belezaProdutos.map(produto => (
                    
                    // 5. O "Item" (com largura fixa e sem encolher)
                    <div key={produto.id} className="flex-shrink-0 w-64"> 
                      {/* (w-64 = 256px. Ajuste este valor se o card ficar muito grande ou pequeno) */}
                      
                      <ProductCard
                        name={produto.nome}
                        price={produto.preco.toString()} 
                        isAvailable={produto.estoque > 0}
                        imageUrl={produto.imagens?.[0]?.urlImagem || '/Stock.io.png'}
                        badgeUrl={produto.loja?.logo || undefined}
                      />
                    </div>
                  ))

                ) : (
                  <p className="text-center text-gray-500 text-lg">
                    Ops! Nenhum produto foi encontrado nesta categoria.
                  </p>
                )}
              </div>
            </div>
        </section>

      </div>
    </main>
  );
}