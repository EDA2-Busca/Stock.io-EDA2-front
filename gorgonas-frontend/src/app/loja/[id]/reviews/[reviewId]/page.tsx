"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import AddReviewModal from "@/components/ui/AddReviewModal";
import EditCommentModal from "@/components/ui/EditCommentModal";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/utilis/api";
import type { Review, ReviewComment } from "@/types/review";
import { IoArrowBack, IoPencil } from "react-icons/io5";

export default function ReviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const lojaId = params.id as string;
  const reviewId = params.reviewId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsTotalPages, setCommentsTotalPages] = useState(1);
  const commentsPageSize = 10;
  const [newComment, setNewComment] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [storeOwnerId, setStoreOwnerId] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<ReviewComment | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const isAuthor = Boolean(user && review && user.id === review.usuarioId);

  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/lojas/${lojaId}/avaliacoes`, { params: { page: 1, pageSize: 50 } });
      const item = (data?.data || []).find((r: any) => String(r.id) === String(reviewId));
      if (!item) {
        setError("Avaliação não encontrada");
        setReview(null);
      } else {
        setReview({
          id: item.id,
            lojaId: item.lojaId,
            author: item.usuario?.nome || "Usuário",
            avatarUrl: item.usuario?.fotoPerfil || "/avatar-placeholder.png",
            rating: item.nota,
            text: item.conteudo,
            createdAt: item.createdAt,
            usuarioId: item.usuarioId,
        });
      }
    } catch (e: any) {
      setError("Falha ao carregar avaliação");
      setReview(null);
    } finally {
      setLoading(false);
    }
  }, [lojaId, reviewId]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get(`/lojas/${lojaId}`);
        if (active) {
          const ownerId = res.data?.usuarioId || res.data?.usuario?.id || null;
          setStoreOwnerId(ownerId);
        }
      } catch {
        if (active) setStoreOwnerId(null);
      }
    })();
    return () => { active = false; };
  }, [lojaId]);

  useEffect(() => { void fetchReview(); }, [fetchReview]);

  const fetchComments = useCallback(async (page = 1) => {
    try {
      const { data } = await api.get(`/lojas/${lojaId}/avaliacoes/${reviewId}/comentarios`, { params: { page, pageSize: commentsPageSize } });
      const items = (data?.data || []).map((c: any) => ({
        id: c.id,
        reviewId: reviewId,
        author: c.usuario?.nome || 'Usuário',
        avatarUrl: c.usuario?.fotoPerfil || '/avatar-placeholder.png',
        text: c.conteudo,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        usuarioId: c.usuarioId || c.usuario?.id,
        isOwner: storeOwnerId !== null && String(c.usuarioId || c.usuario?.id) === String(storeOwnerId),
        edited: c.updatedAt && c.createdAt && c.updatedAt !== c.createdAt,
      }));
      setComments(items);
      const tp = data?.pagination?.totalPages ?? 1;
      setCommentsTotalPages(tp);
    } catch {
      setComments([]);
      setCommentsTotalPages(1);
    }
  }, [lojaId, reviewId, storeOwnerId]);

  useEffect(() => { void fetchComments(commentsPage); }, [fetchComments, commentsPage]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;
    setCommentSubmitting(true);
    try {
      await api.post(`/lojas/${lojaId}/avaliacoes/${reviewId}/comentarios`, { conteudo: newComment.trim() });
      setNewComment("");
      setCommentsPage(1);
      await fetchComments(1);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const renderDecimalStars = (value: number) => {
    const outline = "#D1D5DB";
    const fill = "#F5C518";
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const index = idx + 1;
          const diff = value - idx; // e.g., 2.5 - 2 = 0.5
          const full = diff >= 1;
          const half = !full && diff >= 0.5;
          const width = full ? "100%" : half ? "50%" : "0%";
          return (
            <div key={index} className="relative w-5 h-5">
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
    <main className="min-h-screen bg-[#E4E2DC] flex flex-col">
      <Navbar />
      <div className="w-full bg-black text-white px-8 md:px-12 py-8">
        <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <IoArrowBack /> Voltar
            </button>
            {isAuthor && (
              <button
                onClick={() => setEditOpen(true)}
                aria-label="Editar avaliação"
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <IoPencil />
              </button>
            )}
          </div>
          {loading && (
            <p className="text-sm text-white/70">Carregando avaliação...</p>
          )}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          {review && !loading && !error && (
            <div className="flex items-start gap-4">
              <img
                src={review.avatarUrl}
                alt={review.author}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">{review.author}</h2>
                <div className="flex items-center gap-2 mb-4">{review ? renderDecimalStars(Number(review.rating)) : null}</div>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{review.text}</p>
              </div>
            </div>
          )}
        </div>
      <div className="flex-1 flex flex-col w-full bg-[#FDF9F2]">
        <div className="flex-1 px-8 md:px-12 py-8 space-y-6 overflow-y-auto">
          {comments.map(c => {
            const ownerMatch = storeOwnerId !== null && c.usuarioId != null && String(c.usuarioId) === String(storeOwnerId);
            const currentUserIsOwner = storeOwnerId !== null && user && String(user.id) === String(storeOwnerId);
            const nameMatchOwner = currentUserIsOwner && user && c.author === (user.nome || user.userName);
            const showOwner = c.isOwner || ownerMatch || nameMatchOwner;
            const canEdit = !!(user && (
              (c.usuarioId != null && String(c.usuarioId) === String(user.id)) ||
              c.author === (user.nome || user.userName)
            ));
            return (
              <div key={c.id} className="flex items-start gap-4 group">
                <img
                  src={c.avatarUrl || "/avatar-placeholder.png"}
                  alt={c.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 relative">
                  {canEdit && (
                    <button
                      onClick={() => { setEditingComment(c); setEditModalOpen(true); }}
                      className="absolute -top-2 -right-2 p-2 rounded-full bg-white shadow-md border border-gray-200 text-gray-500 hover:text-[#6A38F3] hover:border-[#6A38F3] transition-opacity duration-150 opacity-100 md:opacity-0 md:group-hover:opacity-100"
                      aria-label="Editar comentário"
                    >
                      <IoPencil size={18} />
                    </button>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[#171918] text-sm leading-none">{c.author}</span>
                    <span className="text-[11px] text-[#6B7280] mt-0.5">{formatRelativeTime(c.createdAt)}</span>
                    {c.edited && (
                      <span className="text-[10px] text-[#6B7280] italic mt-0.5">(editado)</span>
                    )}
                  </div>
                  {showOwner && (
                    <span className="text-xs text-[#6A38F3] font-medium mt-0.5 block">dona da loja</span>
                  )}
                  <p className="text-sm text-[#171918] leading-relaxed whitespace-pre-wrap mt-1">{c.text}</p>
                </div>
              </div>
            );
          })}
          {commentsTotalPages > 1 && (
            <div className="pt-4 flex gap-2 flex-wrap">
              {Array.from({ length: commentsTotalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === commentsPage;
                return (
                  <button
                    key={n}
                    onClick={() => setCommentsPage(n)}
                    className={`px-3 py-1 rounded-full text-xs border ${active ? 'bg-[#6A38F3] text-white border-[#6A38F3]' : 'bg-white text-[#171918] border-[#D1D5DB] hover:bg-[#F3F4F6]'}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {user && (
          <div className="px-8 md:px-12 py-4 bg-[#FDF9F2] border-t border-[#E4E2DC] flex items-center gap-3">
            <textarea
              placeholder="Adicionar comentário"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!commentSubmitting && newComment.trim()) {
                    void handleAddComment();
                  }
                }
              }}
              rows={1}
              spellCheck={false}
              className="flex-1 rounded-2xl bg-white px-5 py-3 text-sm text-[#171918] placeholder:text-[#9CA3AF] outline-none border border-[#D1D5DB] focus:border-[#6A38F3] focus:ring-2 focus:ring-[#6A38F3]/40 transition resize-none"
            />
            <button
              disabled={commentSubmitting || !newComment.trim()}
              onClick={handleAddComment}
              className="h-11 px-5 rounded-full bg-[#6A38F3] text-white text-sm font-semibold disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        )}
      </div>

      {/* Modal de edição com suporte a salvar e excluir */}
      {review && (
        <AddReviewModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          mode="edit"
          existing={{ rating: review.rating, text: review.text }}
          onSubmit={async ({ rating, text }) => {
            try {
              await api.patch(`/lojas/${lojaId}/avaliacoes/${reviewId}`, { nota: rating, conteudo: text });
              setReview(prev => prev ? { ...prev, rating, text } : prev);
              window.dispatchEvent(new Event('review-updated'));
              if (typeof window !== 'undefined') {
                localStorage.setItem(`review-updated-${lojaId}`, Date.now().toString());
              }
            } finally {
              setEditOpen(false);
            }
          }}
          onDelete={async () => {
            try {
              await api.delete(`/lojas/${lojaId}/avaliacoes/${reviewId}`);
              window.dispatchEvent(new Event('review-updated'));
              if (typeof window !== 'undefined') {
                localStorage.setItem(`review-updated-${lojaId}`, Date.now().toString());
              }
              router.push(`/loja/${lojaId}/reviews`);
            } catch {
            } finally {
              setEditOpen(false);
            }
          }}
        />
      )}
      {editingComment && (
        <EditCommentModal
          isOpen={editModalOpen}
          onClose={() => { setEditModalOpen(false); setEditingComment(null); }}
          initialText={editingComment.text}
          onSubmit={async (text) => {
            try {
              await api.patch(`/lojas/${lojaId}/avaliacoes/${reviewId}/comentarios/${editingComment.id}`, { conteudo: text });
              await fetchComments(commentsPage);
            } catch (e) {
            }
          }}
          onDelete={async () => {
            try {
              await api.delete(`/lojas/${lojaId}/avaliacoes/${reviewId}/comentarios/${editingComment.id}`);
              const newList = comments.filter(cc => cc.id !== editingComment.id);
              if (newList.length === 0 && commentsPage > 1) {
                setCommentsPage(p => p - 1);
                await fetchComments(commentsPage - 1);
              } else {
                await fetchComments(commentsPage);
              }
            } catch (e) {
            }
          }}
        />
      )}
    </main>
  );
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo`;
  const year = Math.floor(month / 12);
  return `${year}y`;
}
