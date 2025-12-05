"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Navbar } from "@/components/Navbar";
import ReviewCard from "@/components/ui/ReviewCard";
import StoreBanner from "@/components/ui/StoreBanner";
import api from "@/utilis/api";
import { useParams, useSearchParams } from "next/navigation";
import AddReviewModal from "@/components/ui/AddReviewModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

type Review = {
  id: number;
  author: string;
  avatarUrl?: string;
  rating: number;
  text: string;
};

export default function StoreReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const lojaId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);
  const search = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState<number>(0);
  const [store, setStore] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  // Modal de edição removido (botão de teste eliminado)
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchReviews = useCallback(async function fetchReviews(targetPage = 1, force = false) {
    if (!lojaId) return;
    try {
      setIsLoading(true);
      const { data } = await api.get(`/lojas/${lojaId}/avaliacoes`, { params: { page: targetPage, pageSize, _ts: force ? Date.now() : undefined } });
      const items: Review[] = (data?.data || []).map((it: any) => ({
        id: it.id,
        lojaId: it.lojaId,
        author: it.usuario?.nome || 'Usuário',
        avatarUrl: it.usuario?.fotoPerfil || '/Stock.io.png',
        rating: it.nota,
        text: it.conteudo,
      }));
      setReviews(items);
      setAverage(Number((data?.summary?.average ?? 0).toFixed(2)));
      const tp = data?.pagination?.totalPages ?? 1;
      setTotalPages(Math.max(1, Number(tp)));
    } catch (err) {
      setReviews([]);
      setAverage(0);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [lojaId]);

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page]);

  useEffect(() => {
    const flagKey = `review-updated-${lojaId}`;
    if (typeof window !== 'undefined') {
      const flag = localStorage.getItem(flagKey);
      if (flag) {
        localStorage.removeItem(flagKey);
        fetchReviews(page, true); // força cache busting
      }
    }
  }, [fetchReviews, lojaId, page]);

  useEffect(() => {
    const handler = () => {
      // Recarrega a página atual mantendo paginação
      fetchReviews(page);
    };
    window.addEventListener('review-updated', handler);
    return () => window.removeEventListener('review-updated', handler);
  }, [fetchReviews, page]);

  useEffect(() => {
    const nome = search.get('nome');
    const categoria = search.get('categoria');
    const descricao = search.get('descricao');
    const banner = search.get('banner');
    if (nome || categoria || descricao || banner) {
      setStore({ id: Number(lojaId), nome, categoria: categoria ? { nome: categoria } : null, descricao, banner });
      return;
    }
    async function fetchStore() {
      try {
        const res = await api.get(`/lojas/${lojaId}`);
        setStore(res.data);
      } catch {
        setStore(null);
      }
    }
    if (lojaId) fetchStore();
  }, [lojaId, search]);

  const paginated = reviews; // backend já retorna página solicitada
  const { user } = useAuth();
  const isOwner = Boolean(user && store?.usuarioId && user.id === (store as any).usuarioId);
  const showActions = Boolean(user) && !isOwner;

  const renderStars = (value: number) => {
    const outline = "#D1D5DB";
    const fill = "#F5C518";
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const diff = value - idx;
          const full = diff >= 1;
          const half = !full && diff >= 0.5;
          const width = full ? "100%" : half ? "50%" : "0%";
          return (
            <div key={idx} className="relative w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={outline} className="w-5 h-5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <div className="absolute inset-0 overflow-hidden" style={{ width }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={fill} className="w-5 h-5">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 pt-6">
        <button
          onClick={() => router.push(`/loja/${lojaId}`)}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white"
        >
          <IoArrowBack /> Voltar para a loja
        </button>
      </div>
      {store && (
        <StoreBanner
          id={Number(lojaId)}
          storeName={store?.nome || ""}
          category={store?.categoria?.nome || ""}
          description={store?.descricao || ""}
          bannerImageUrl={store?.banner || "/banner-rare-beauty.jpg"}
          isLoggedIn={Boolean(user)}
          isOwner={isOwner}
          onProductCreated={() => {}}
          onStoreUpdated={() => {}}
          onStoreDeleted={() => {}}
        />
      )}

      <div className="w-full bg-black">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold">Reviews e Comentários</h2>
            <div className="mt-3 flex items-center justify-center gap-3">
              <span className="text-3xl font-semibold">{average.toFixed(2)}</span>
              {renderStars(average)}
              <span className="text-white/70 text-sm">({reviews.length} reviews)</span>
            </div>
            {showActions && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <button onClick={() => setIsCreateOpen(true)} className="inline-flex items-center justify-center rounded-full bg-[#6A38F3] text-white px-6 py-3 text-sm font-semibold shadow-sm hover:brightness-110 transition">
                  Adicionar Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-gray-300 text-lg">Carregando...</p>
          </div>
        ) : (
          <section className="pb-8">
            <div className="max-w-7xl mx-auto px-8 space-y-6">
            {paginated.map((r) => (
              <ReviewCard
                key={r.id}
                id={r.id}
                lojaId={lojaId}
                author={r.author}
                avatarUrl={r.avatarUrl}
                rating={r.rating}
                text={r.text}
              />
            ))}
            </div>
          </section>
        )}

        {!isLoading && totalPages > 1 && (
          <section className="pb-16 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const isActive = n === page;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-full border ${isActive ? "bg-[#6A38F3] text-white border-[#6A38F3]" : "bg-white text-[#171918] border-[#ddd]"}`}
                >
                  {n}
                </button>
              );
            })}
          </section>
        )}
      </div>

      {/* Modais */}
      <AddReviewModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        storeName={store?.nome}
        onSubmit={async (data) => {
          try {
            await api.post(`/lojas/${lojaId}/avaliacoes`, { nota: data.rating, conteudo: data.text });
            setPage(1); // volta para a primeira página
            await fetchReviews(1);
            toast.success("Avaliação registrada com sucesso!");
          } catch (e: any) {
            const status = e?.response?.status;
            if (status === 409) {
              toast.warning("Você já avaliou esta loja. Apenas uma avaliação é permitida.");
            } else if (status === 403) {
              toast.error("Donos não podem avaliar a própria loja.");
            } else if (status === 400) {
              toast.error("Dados inválidos. Verifique a nota e o texto.");
            } else {
              toast.error("Não foi possível enviar sua avaliação. Tente novamente.");
            }
          }
        }}
      />
    </main>
  );
}
