'use client';

import { useState, useEffect } from "react";
import { Navbar } from '@/components/Navbar';
import api from "@/utilis/api";
import SearchBar from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';
import { ProductRow } from '../components/ProductRow';

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
          <SearchBar className="max-w-md ml-auto" />
        </section>

        <section className="pb-6">
          <CategoryList />
        </section>

        {isLoading ? (
          <p className="text-center text-gray-500 text-lg">Carregando...</p>
        ) : (
          <>
            <ProductRow 
              title="Mercado"
              products={mercadoProdutos}
              viewMoreHref="/ver-mais/mercado"
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
          </>
        )}

      </div>
    </main>
  );
}