'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import api from '@/utilis/api';
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';

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

type NormalizedProduct = {
  id: number; name: string; price: string; isAvailable: boolean; imageUrl: string; subcategoria?: string;
};

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

  const pageParam = parseInt(searchParams.get('page') || '1', 10) || 1;
  const sortParam = searchParams.get('sort') || 'recent';
  const subParam = searchParams.get('sub') || '';
  const statusParam = searchParams.get('status') || '';

  const updateQuery = (patch: Record<string, string | number | undefined>) => {
    const q = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => { if (!v) q.delete(k); else q.set(k, String(v)); });
    router.push(`/loja/${lojaId}/produtos?${q.toString()}`);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/produtos/loja/${lojaId}`);
        if (!active) return;
        const norm: NormalizedProduct[] = (res.data || []).map((p: any) => {
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
            subcategoria: p.subcategoria?.nome || '',
          };
        });
        setAllProducts(norm);
        const subs = Array.from(
          new Set(
            norm
              .map(p => p.subcategoria)
              .filter((s): s is string => typeof s === 'string' && s.length > 0)
          )
        );
        setSubcategories(subs);
        setError(null);
      } catch (e: any) {
        console.error('Falha ao carregar produtos completos', e);
        setError('Não foi possível carregar os produtos.');
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [lojaId]);

  const filteredSorted = useMemo(() => {
    let list = [...allProducts];
    if (subParam) list = list.filter(p => p.subcategoria === subParam);
    if (statusParam === 'disponivel') list = list.filter(p => p.isAvailable);
    if (statusParam === 'indisponivel') list = list.filter(p => !p.isAvailable);
    switch (sortParam) {
      case 'nome_asc': list.sort((a,b)=>a.name.localeCompare(b.name)); break;
      case 'nome_desc': list.sort((a,b)=>b.name.localeCompare(a.name)); break;
      case 'preco_asc': list.sort((a,b)=>parseFloat(a.price.replace(',','.'))-parseFloat(b.price.replace(',','.'))); break;
      case 'preco_desc': list.sort((a,b)=>parseFloat(b.price.replace(',','.'))-parseFloat(a.price.replace(',','.'))); break;
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
            <ProductCard key={p.id} id={p.id} name={p.name} price={p.price} isAvailable={p.isAvailable} imageUrl={p.imageUrl} />
          ))}
        </div>
        {totalPages > 1 && <Pager currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
      </div>
    </main>
  );
}
