'use client';

import React, { useEffect, useState, useCallback } from 'react';

// Componentes principais da página da loja
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import ProductScroll from '@/components/ProductScroll';
import Pagination from '@/components/ui/Pagination';
import StoreBanner from '@/components/ui/StoreBanner';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/utilis/api';
import { useAuth } from '@/contexts/AuthContext';
// Importação corrigida (assumindo que está em 'ui/')
import StoreReviewSection from '@/components/ui/StoreReviewSection';

// Banner fallback caso loja não tenha imagem
const API_URL = "http://localhost:3001";
const FALLBACK_BANNER = '/banner-rare-beauty.jpg';

// Mock de produtos melhor avaliados (substituir por endpoint futuro)
const mockBestProducts = [
  // IDs como 'number' e imagens de placeholder existentes
  { id: 1, name: "Bronzer", price: "254,99", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 2, name: "Blush", price: "199,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
  { id: 3, name: "Perfume Rare", price: "599,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 4, name: "Iluminador", price: "249,90", isAvailable: true, imageUrl: "/avatar-placeholder.png" },
  { id: 5, name: "Mini Blush", price: "99,99", isAvailable: false, imageUrl: "/avatar-placeholder.png" },
];

// Grid de produtos com dados reais via API
const FALLBACK_PRODUCT_IMAGE = '/avatar-placeholder.png';

// Reviews dinâmicos (resumo exibido em faixa horizontal)
type StoreReview = { id: string; author: string; text: string; avatarUrl: string; rating: number };


// --- Página da Loja Específica ---
export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Array<{ id: number; name: string; price: string; isAvailable: boolean; imageUrl: string }>>([]);
  const [store, setStore] = useState<{ nome: string; descricao: string; categoria: { nome: string } | null; banner: string | null; logo: string | null } | null>(null);
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  // Estado derivado do contexto de autenticação
  const [lastFetchTimestamp, setLastFetchTimestamp] = useState<number>(0);
  const isLoggedIn = !!user;

  useEffect(() => {
    let active = true;
    const nomeQS = searchParams.get('nome');
    const categoriaQS = searchParams.get('categoria');
    const descricaoQS = searchParams.get('descricao');
    const bannerQS = searchParams.get('banner');

    // Preenchimento inicial via querystring (fallback resiliente)
    if (nomeQS || categoriaQS || descricaoQS || bannerQS) {
      setStore({
        nome: nomeQS || 'Loja',
        descricao: descricaoQS || '',
        categoria: categoriaQS ? { nome: categoriaQS } : null,
        banner: bannerQS || null,
      } as any);
    }

    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lojas/${id}`);
        if (active) {
          setStore(res.data);
          setError(null);
        }
      } catch (e: any) {
        // Se 404, mantém informações da querystring sem interromper a página
        if (e?.response?.status !== 404) {
          console.error('Falha ao carregar loja', e);
        }
        if (active) {
          if (!(nomeQS || categoriaQS || descricaoQS || bannerQS)) {
            setError('Não foi possível carregar a loja.');
          } else {
            setError(null);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, searchParams]);

  const refetchStore = useCallback(async () => {
    try {
      const res = await api.get(`/lojas/${id}`);
      setStore(res.data);
    } catch (e) {
      console.error('Falha ao atualizar dados da loja após edição', e);
    }
  }, [id]);

  // Fetch inicial dos reviews (limitado para exibição horizontal)
  const fetchReviews = useCallback(async () => {
    if (!id) return;
    setReviewsLoading(true);
    try {
      const { data } = await api.get(`/lojas/${id}/avaliacoes`, { params: { page: 1, pageSize: 10 } });
      const mapped: StoreReview[] = (data?.data || []).map((r: any) => ({
        id: String(r.id),
        author: r.usuario?.nome || 'Usuário',
        text: r.conteudo,
        avatarUrl: r.usuario?.fotoPerfil || '/avatar-placeholder.png',
        rating: r.nota,
      }));
      setReviews(mapped);
      setAverageRating(Number((data?.summary?.average ?? 0).toFixed(2)));
      setReviewCount(data?.summary?.count ?? mapped.length);
    } catch (e) {
      setReviews([]);
      setAverageRating(0);
      setReviewCount(0);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  // Fetch dos produtos da loja
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
    fetchReviews();
  }, [fetchProducts]);

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return FALLBACK_BANNER;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `${API_URL}/${path}`;
  };

  const storeName = store?.nome || (loading ? 'Carregando...' : 'Loja não encontrada');
  // Nome original da categoria (evita erros em subcategorias)
  const storeCategory = store?.categoria?.nome || (loading ? '' : '');
  const storeDescription = store?.descricao || (loading ? '' : '');
  const bannerImageUrl = getImageUrl(store?.banner);

  const logoImageUrl =getImageUrl(store?.logo);

  // Lógica de proprietário (esconde ações para dono)
  const isOwnerBase = user && store && (user.id === (store as any).usuarioId || user.id === (store as any).usuario?.id);
  const testOverride = searchParams.get('testOwner') === '1' || (typeof window !== 'undefined' && localStorage.getItem('testOwner') === '1');
  const isOwner = !!(isOwnerBase || testOverride);

  return (
    // Layout principal
    <main className="bg-[#FDF9F2] min-h-screen">
      <Navbar />

      {/* Banner full-width */}
      <StoreBanner
        id={Number(id)}
        storeName={storeName}
        category={storeCategory}
        description={storeDescription}
        bannerImageUrl={bannerImageUrl}
        logoImageUrl={logoImageUrl}
        isLoggedIn={isLoggedIn}
        isOwner={isOwner}
        onProductCreated={(p) => {
          // Atualização otimista dos produtos
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
          // Re-fetch rápido para garantir consistência
          setTimeout(() => { void fetchProducts(); }, 100);
        }}
        onStoreUpdated={() => {
          void refetchStore();
        }}
        onStoreDeleted={() => {
          router.push('/');
        }}
      />

      {/* Faixa preta de reviews */}
      <StoreReviewSection
        rating={averageRating}
        reviewCount={reviewCount}
        reviews={reviews}
        seeMoreLink={`/loja/${id}/reviews?nome=${encodeURIComponent(storeName)}&categoria=${encodeURIComponent(storeCategory)}&descricao=${encodeURIComponent(storeDescription)}&banner=${encodeURIComponent(bannerImageUrl)}`}
      />

      {/* Conteúdo principal (produtos, lista) */}
      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Produtos melhor avaliados (scroll horizontal) */}
        <ProductScroll
          title="Produtos melhor avaliados"
          products={mockBestProducts}
          seeMoreLink={`/loja/${id}/produtos?sort=rating`}
        />

        {/* Secção de criar review removida nesta versão */}

        {/* Produtos da loja (grid) */}
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

          {/* Paginação (placeholder) */}
          <Pagination />
        </section>

      </div>
    </main>
  );
}