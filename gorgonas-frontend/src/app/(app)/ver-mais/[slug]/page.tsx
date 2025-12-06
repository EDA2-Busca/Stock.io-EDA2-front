'use client'; 

import { useState, useEffect } from "react";
import api from "@/utilis/api";
import { useParams } from 'next/navigation';

import { ProductCard } from '@/components/ProductCard';
import { Navbar } from "@/components/Navbar";

type ProdutoParaCard = {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  loja: { sticker: string | null } | null;
  imagens: { urlImagem: string }[];
};

export default function VerMaisPage() {
  
  const params = useParams();
  const slug = params.slug as string; 

  const [produtos, setProdutos] = useState<ProdutoParaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const buscarProdutos = async () => {
        try {
          setIsLoading(true);
          setError(null); 
          const response = await api.get(`/produtos/ver-mais/${slug}`);
          setProdutos(response.data);
        } catch (err) {
          console.error("Erro ao buscar produtos:", err);
          setError("Não foi possível carregar os produtos.");
        } finally {
          setIsLoading(false); 
        }
      };
      buscarProdutos();
    }
  }, [slug]); 

  if (isLoading) {
    return (
      <main className="text-center p-8 bg-[#F6F3E4] min-h-screen">
        <p className="text-gray-500 text-lg">Carregando produtos...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="text-center p-8 bg-[#F6F3E4] min-h-screen">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  return (
    <>
    <Navbar />

    <main className="bg-background min-h-screen">

      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        
        <h1 className="text-3xl font-bold mb-6 capitalize text-gray-900">
          {decodeURIComponent(slug)}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          
          {produtos.length > 0 ? (

            produtos.map(produto => {
              
              const temImagem = produto.imagens && produto.imagens.length > 0;
              const imageUrl = temImagem 
                ? produto.imagens[0].urlImagem 
                : '/Stock.io.png';
              
              const badgeUrl = produto.loja?.sticker || undefined;
              
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
              Ops! Nenhum produto foi encontrado nesta categoria.
            </p>
          )}
        </div>
      </div>
    </main>
    </>
  );
}