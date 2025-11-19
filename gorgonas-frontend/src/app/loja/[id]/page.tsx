'use client';

import React, { useEffect, useState, useCallback } from 'react';

// Importa os componentes da página
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import ProductScroll from '@/components/ProductScroll';
import Pagination from '@/components/ui/Pagination';
import StoreBanner from '@/components/ui/StoreBanner';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/utilis/api';
import { useAuth } from '@/contexts/AuthContext';
// Importação corrigida (assumindo que está em 'ui/')
import StoreReviewSection from '@/components/ui/StoreReviewSection'; 

// --- DADOS SIMULADOS (Mock Data) ---
// (No futuro, estes dados virão da API usando o 'params.id')

// Banner usa dados reais; demais blocos permanecem mock nesta fase.
const FALLBACK_BANNER = '/banner-rare-beauty.jpg';
const mockStoreStatic = { rating: 4.75 };

// Produtos para o scroll horizontal "melhor avaliados"
const mockBestProducts = [
  // IDs como 'number' e imagens de placeholder existentes
  { id: 1, name: "Bronzer", price: "254,99", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 2, name: "Blush", price: "199,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
  { id: 3, name: "Perfume Rare", price: "599,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 4, name: "Iluminador", price: "249,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 5, name: "Mini Blush", price: "99,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
];

// Grid de produtos será preenchida com dados reais nesta fase.
const FALLBACK_PRODUCT_IMAGE = '/avatar-placeholder.png';

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
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Array<{ id: number; name: string; price: string; isAvailable: boolean; imageUrl: string }>>([]);
  const [store, setStore] = useState<{ nome: string; descricao: string; categoria: { nome: string } | null; banner: string | null } | null>(null);
  // Estado de login derivado do contexto
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);
  const isLoggedIn = !!user;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lojas/${id}`);
        if (active) {
          setStore(res.data);
          setError(null);
        }
      } catch (e: any) {
        console.error('Falha ao carregar loja', e);
        if (active) setError('Não foi possível carregar a loja.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  // Fetch dos produtos da loja (Phase 2)
  const fetchProducts = useCallback(async () => {
    if (!id) return;
    const now = Date.now();
    if (now - lastFetchTimestamp < 500) return;
    setLastFetchTimestamp(now);
    setProductsLoading(true);
    try {
      const res = await api.get(`/produtos/loja/${id}`);
      const normalized = (res.data || []).map((p: any) => {
        const rawPrice = typeof p.preco === 'string' ? p.preco : p.preco?.toString() || '0';
        const numeric = parseFloat(rawPrice);
        const priceFormatted = numeric.toFixed(2).replace('.', ',');
        const firstImage = p.imagens?.[0]?.urlImagem;
        const img = firstImage || p.loja?.logo || FALLBACK_PRODUCT_IMAGE;
        return {
          id: p.id,
          name: p.nome,
          price: priceFormatted,
          isAvailable: (p.estoque ?? 0) > 0,
          imageUrl: img,
        };
      });
      setProducts(normalized);
    } catch (e) {
      console.error('Falha ao carregar produtos da loja', e);
    } finally {
      setProductsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const storeName = store?.nome || (loading ? 'Carregando...' : 'Loja não encontrada');
  // Mantém o nome original da categoria (sem lowerCase) para evitar falhas ao buscar subcategorias
  const storeCategory = store?.categoria?.nome || (loading ? '' : '');
  const storeDescription = store?.descricao || (loading ? '' : '');
  const bannerImageUrl = store?.banner || FALLBACK_BANNER;

  // Lógica de proprietário (Phase 3)
  const isOwnerBase = user && store && (user.id === (store as any).usuarioId || user.id === (store as any).usuario?.id);
  const testOverride = searchParams.get('testOwner') === '1' || (typeof window !== 'undefined' && localStorage.getItem('testOwner') === '1');
  const isOwner = !!(isOwnerBase || testOverride);

  return (
    // Fundo bege principal (para a Secção 3)
    <main className="bg-[#FDF9F2] min-h-screen">
      <Navbar />

      {/* 1. Secção do Banner (Imagem Full-Width) */}
      <StoreBanner
        id={Number(id)}
        storeName={storeName}
        category={storeCategory}
        description={storeDescription}
        bannerImageUrl={bannerImageUrl}
        isLoggedIn={isLoggedIn}
        isOwner={isOwner}
        onProductCreated={(p) => {
          // Otimista: adiciona item formatado à lista atual
          const numeric = typeof p.preco === 'number' ? p.preco : parseFloat(String(p.preco));
          const priceFormatted = numeric.toFixed(2).replace('.', ',');
          setProducts(prev => [
            ...prev.filter(existing => existing.id !== p.id),
            {
              id: p.id,
              name: p.nome,
              price: priceFormatted,
              isAvailable: (p.estoque ?? 0) > 0,
              imageUrl: p.imagens?.[0]?.urlImagem || FALLBACK_PRODUCT_IMAGE,
            }
          ]);
          // Re-fetch silencioso (debounced) para garantir consistência
          setTimeout(() => { void fetchProducts(); }, 100);
        }}
      />

      {/* 2. Secção de Reviews (PRETA E HORIZONTAL) */}
      <StoreReviewSection
        rating={mockStoreStatic.rating}
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
            <h2 className="text-2xl font-bold text-[#171918]">Produtos de {storeName}</h2>
            <a href={`/loja/${id}/produtos`} className="text-sm text-[#6A38F3] hover:underline">
              ver mais
            </a>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {productsLoading && products.length === 0 && (
              [...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 h-64 animate-pulse" />
              ))
            )}
            {!productsLoading && products.length === 0 && (
              <p className="col-span-full text-sm text-gray-500">Nenhum produto cadastrado.</p>
            )}
            {products.map(product => (
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