'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/utilis/api';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import EditarProdutoModal, { ProdutoCompleto } from '@/components/modals/EditarProdutoModal';

// Reuso do componente Pagination simples, embrulhando lógica mínima
function Pager({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav className="flex justify-center items-center space-x-2 mt-8">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="px-3 py-2 rounded-md text-sm disabled:opacity-40 bg-gray-50 hover:bg-gray-100">&lt;</button>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)} className={`px-3 py-2 rounded-md text-sm ${p === currentPage ? 'bg-[#6A38F3] text-white font-semibold' : 'bg-gray-50 hover:bg-gray-100'}`}>{p}</button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="px-3 py-2 rounded-md text-sm disabled:opacity-40 bg-gray-50 hover:bg-gray-100">&gt;</button>
    </nav>
  );
}

const FALLBACK_PRODUCT_IMAGE = '/avatar-placeholder.png';
const PAGE_SIZE = 20;

type ProdutoImagem = {
  id?: number;
  urlImagem?: string | null;
};

type NormalizedProduct = {
  id: number;
  name: string;
  price: string;
  rawPrice: number;
  estoque: number;
  isAvailable: boolean;
  imageUrl: string;
  descricao: string;
  subcategoria?: { id?: number; nome?: string; categoriaId?: number } | null;
  subcategoriaNome?: string;
  imagens?: ProdutoImagem[];
};

const normalizeProducts = (list: any[]): NormalizedProduct[] => {
  return (list || []).map((p: any) => {
    const rawNumber =
      typeof p.preco === 'number'
        ? p.preco
        : parseFloat(String(p.preco ?? '0').replace(/\./g, '').replace(',', '.')) || 0;
    const safeNumber = Number.isFinite(rawNumber) ? rawNumber : 0;
    const priceFormatted = safeNumber.toFixed(2).replace('.', ',');
    const imagens: ProdutoImagem[] = Array.isArray(p.imagens) ? p.imagens : [];
    const firstImage = imagens[0]?.urlImagem;
    return {
      id: p.id,
      name: p.nome,
      price: priceFormatted,
      rawPrice: safeNumber,
      estoque: p.estoque ?? 0,
      isAvailable: (p.estoque ?? 0) > 0,
      imageUrl: firstImage || p.loja?.logo || FALLBACK_PRODUCT_IMAGE,
      descricao: p.descricao ?? '',
      subcategoria: p.subcategoria ?? null,
      subcategoriaNome: p.subcategoria?.nome || '',
      imagens,
    };
  });
};

const buildSubcategoryList = (list: NormalizedProduct[]) =>
  Array.from(
    new Set(
      list
        .map((p) => p.subcategoriaNome)
        .filter((s): s is string => typeof s === 'string' && s.trim().length > 0),
    ),
  );

export default function LojaProdutosPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const lojaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<NormalizedProduct[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoCompleto | null>(null);

  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
  const sortParam = searchParams.get('sort') || 'recent';
  const subParam = searchParams.get('sub') || '';
  const statusParam = searchParams.get('status') || '';

  const lojaUsuarioId =
    user?.loja?.id ??
    (user as any)?.lojaId ??
    (user as any)?.idLoja ??
    (user as any)?.loja_id;
  const isOwner = lojaUsuarioId ? String(lojaUsuarioId) === String(lojaId) : false;

  const updateQuery = (patch: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => { if (!v) q.delete(k); else q.set(k, String(v)); });
    router.push(`/loja/${lojaId}/produtos?${q.toString()}`);
  };

  const fetchProductsData = useCallback(async () => {
    const res = await api.get(`/produtos/loja/${lojaId}`);
    return normalizeProducts(res.data || []);
  }, [lojaId]);

  const applyProducts = useCallback((list: NormalizedProduct[]) => {
    setAllProducts(list);
    setSubcategories(buildSubcategoryList(list));
  }, []);

  const refreshProducts = useCallback(async () => {
    try {
      const produtos = await fetchProductsData();
      applyProducts(produtos);
      setError(null);
    } catch (e: any) {
      console.error('Falha ao atualizar lista de produtos', e);
      setError('Não foi possível atualizar os produtos.');
    }
  }, [fetchProductsData, applyProducts]);

  const parsePriceToNumber = (value: string | number) => {
    if (typeof value === 'number') return value;
    const normalized = value.replace(/\./g, '').replace(',', '.');
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const closeModal = () => {
    setModalOpen(false);
    setProdutoSelecionado(null);
  };

  const openModalForProduct = (product: NormalizedProduct) => {
    setProdutoSelecionado({
      id: product.id,
      name: product.name,
      price: product.price,
      estoque: typeof product.estoque === 'number' ? product.estoque : (product.isAvailable ? 1 : 0),
      descricao: product.descricao ?? '',
      subcategoria: product.subcategoria ?? null,
      imagens: product.imagens ?? [],
    });
    setModalOpen(true);
  };

  const handleEditClick = (product: NormalizedProduct) => {
    openModalForProduct(product);
  };

  const handleDeleteClick = (product: NormalizedProduct) => {
    openModalForProduct(product);
  };

  const handleUpdate = useCallback(async () => {
    if (!produtoSelecionado) return;
    const current = produtoSelecionado;
    try {
      await api.put(`/produtos/${current.id}`, {
        nome: current.name,
        preco: parsePriceToNumber(current.price),
        estoque: current.estoque,
        descricao: current.descricao ?? '',
        subcategoriaId: current.subcategoria?.id,
      });
      await refreshProducts();
    } catch (e: any) {
      console.error('Falha ao atualizar produto', e);
    }
  }, [produtoSelecionado, refreshProducts]);

  const handleDelete = useCallback(async () => {
    if (!produtoSelecionado) return;
    const currentId = produtoSelecionado.id;
    try {
      await api.delete(`/produtos/${currentId}`);
      setAllProducts(prev => {
        const updated = prev.filter(prod => prod.id !== currentId);
        setSubcategories(buildSubcategoryList(updated));
        return updated;
      });
    } catch (e: any) {
      console.error('Falha ao excluir produto', e);
    }
  }, [produtoSelecionado]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const produtos = await fetchProductsData();
        if (!active) return;
        applyProducts(produtos);
        setError(null);
      } catch (e: any) {
        if (!active) return;
        console.error('Falha ao carregar produtos completos', e);
        setError('Não foi possível carregar os produtos.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [fetchProductsData, applyProducts]);

  const filteredSorted = useMemo(() => {
    let list = [...allProducts];
    if (subParam) list = list.filter(p => p.subcategoriaNome === subParam);
    if (statusParam === 'disponivel') list = list.filter(p => p.isAvailable);
    if (statusParam === 'indisponivel') list = list.filter(p => !p.isAvailable);
    switch (sortParam) {
      case 'nome_asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'nome_desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
      case 'preco_asc': list.sort((a,b)=>a.rawPrice - b.rawPrice); break;
      case 'preco_desc': list.sort((a,b)=>b.rawPrice - a.rawPrice); break;
      case 'disponivel': list.sort((a,b)=>Number(b.isAvailable)-Number(a.isAvailable)); break;
      case 'recent': default: list.sort((a,b)=>b.id - a.id);
    }
    return list;
  }, [allProducts, subParam, statusParam, sortParam]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const currentPage = Math.min(pageParam, totalPages);
  const pageSlice = filteredSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (p: number) => updateQuery({ page: p });

  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#171918]">Todos os Produtos</h1>
          <a href={`/loja/${lojaId}`} className="text-sm text-[#6A38F3] hover:underline">Voltar para a loja</a>
        </div>
        <section className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-semibold block mb-1 text-gray-700">Ordenar</label>
              <select value={sortParam} onChange={e=>updateQuery({ sort: e.target.value, page: 1 })} className="rounded-lg bg-white/90 border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]">
                <option value="recent">Recentes</option>
                <option value="nome_asc">Nome A-Z</option>
                <option value="nome_desc">Nome Z-A</option>
                <option value="preco_asc">Preço ↑</option>
                <option value="preco_desc">Preço ↓</option>
                <option value="disponivel">Disponibilidade</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1 text-gray-700">Subcategoria</label>
              <select value={subParam} onChange={e=>updateQuery({ sub: e.target.value || undefined, page: 1 })} className="rounded-lg bg-white/90 border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]">
                <option value="">Todas</option>
                {subcategories.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1 text-gray-700">Status</label>
              <select value={statusParam} onChange={e=>updateQuery({ status: e.target.value || undefined, page: 1 })} className="rounded-lg bg-white/90 border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]">
                <option value="">Todos</option>
                <option value="disponivel">Disponível</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </div>
          </div>
        </section>
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(10)].map((_,i)=><div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}
          </div>
        )}
        {!loading && error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {!loading && !error && pageSlice.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Nenhum produto encontrado com estes filtros.</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
          {pageSlice.map(p => (
            <div key={p.id} className="flex flex-col">
              <ProductCard id={p.id} name={p.name} price={p.price} isAvailable={p.isAvailable} imageUrl={p.imageUrl} />
              {isOwner && (
                <div className="flex items-center justify-between mt-2 px-1">
                  <button
                    type="button"
                    onClick={() => handleEditClick(p)}
                    className="text-sm text-[#6A38F3] font-semibold hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(p)}
                    className="text-sm text-red-500 font-semibold hover:underline"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {totalPages > 1 && <Pager currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
      </div>
      {modalOpen && produtoSelecionado && (
        <EditarProdutoModal
          isOpen={modalOpen}
          onClose={closeModal}
          produto={produtoSelecionado}
          onUpdated={handleUpdate}
          onDeleted={handleDelete}
        />
      )}
    </main>
  );
}
