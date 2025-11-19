'use client';

import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';

// Importa os componentes da página
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import ProductScroll from '@/components/ProductScroll';
import Pagination from '@/components/ui/Pagination';
import StoreBanner from '@/components/ui/StoreBanner';
import { useParams } from 'next/navigation';
// Importação corrigida (assumindo que está em 'ui/')
import StoreReviewSection from '@/components/ui/StoreReviewSection'; 

// --- DADOS SIMULADOS (Mock Data) ---
// (No futuro, estes dados virão da API usando o 'params.id')

const mockStore = {
  name: "Rare Beauty",
  category: "mercado",
  description: "by Selena Gomez",
  rating: 4.75,
  // Caminho corrigido para uma imagem que existe na sua pasta /public
  bannerImageUrl: "/banner-rare-beauty.jpg", 
};

// Produtos para o scroll horizontal "melhor avaliados"
const mockBestProducts = [
  // IDs como 'number' e imagens de placeholder existentes
  { id: 1, name: "Bronzer", price: "254,99", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 2, name: "Blush", price: "199,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
  { id: 3, name: "Perfume Rare", price: "599,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 4, name: "Iluminador", price: "249,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 5, name: "Mini Blush", price: "99,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
];

// Produtos para a grelha "Produtos de rare beauty"
const mockStoreProducts = [
  { id: 6, name: "Lapis Labial", price: "139,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 7, name: "Contorno", price: "289,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 8, name: "Iluminador", price: "249,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 9, name: "Primer", price: "139,00", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
  { id: 10, name: "Mascara de C.", price: "109,99", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
];

// Comentários para o scroll horizontal
const mockReviews = [
  { 
    id: 'r1', 
    author: "Sofia Figueiredo", 
    text: "Adorei o produto, Funcionou muito na minha pele. Estou muito contente...",
    avatarUrl: "/avatar-placeholder.png", // Usando o placeholder
    rating: 5 
  },
  { 
    id: 'r2', 
    author: "João Silva", 
    text: "A entrega foi rápida e o produto veio bem embalado...",
    avatarUrl: "/avatar-placeholder.png", 
    rating: 4
  },
  { 
    id: 'r3', 
    author: "Maria Clara", 
    text: "O blush é lindo e tem uma pigmentação ótima...",
    avatarUrl: "/avatar-placeholder.png", 
    rating: 3
  },
];
// --- Fim dos Dados Simulados ---


// --- Página da Loja Específica ---
export default function StorePage() {
  
  // "Desembrulha" o 'id' aqui para corrigir o erro 'params.id'
    const params = useParams();
    const id = params.id as string; 
  
  // Simulação do estado de login
  // TODO: Substituir por: const { isLoggedIn } = useAuth();
  const isLoggedIn = true; // Mude para 'false' para testar a versão deslogado

  return (
    // Fundo bege principal (para a Secção 3)
    <main className="bg-[#FDF9F2] min-h-screen">
      <Navbar />

      {/* 1. Secção do Banner (Imagem Full-Width) */}
      <StoreBanner
        id={Number(id)} 
        storeName={mockStore.name}
        category={mockStore.category}
        description={mockStore.description}
        bannerImageUrl={mockStore.bannerImageUrl}
        isLoggedIn={isLoggedIn}
      />

      {/* 2. Secção de Reviews (PRETA E HORIZONTAL) */}
      <StoreReviewSection
        rating={mockStore.rating}
        reviewCount={mockReviews.length}
        reviews={mockReviews} // Passa a lista de reviews
        seeMoreLink={`/loja/${id}/reviews`}
      />

      {/* 3. Secção de Conteúdo Principal (Container bege) */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Produtos melhor avaliados (Scroll Horizontal) */}
        <ProductScroll 
          title="Produtos melhor avaliados"
          products={mockBestProducts}
          seeMoreLink={`/loja/${id}/produtos?sort=rating`}
        />

        {/* A secção "Deixe o seu review" foi removida conforme solicitado */}

        {/* Produtos da Loja (Grelha) */}
        <section className="pb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#171918]">Produtos de {mockStore.name}</h2>
            <a href={`/loja/${id}/produtos`} className="text-sm text-[#6A38F3] hover:underline">
              ver mais
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {mockStoreProducts.map(product => (
               <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                isAvailable={product.isAvailable}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
          
          {/* Paginação */}
          <Pagination />
        </section>

      </div>
    </main>
  );
}