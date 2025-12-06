'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';

export type AddReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  onSubmit?: (data: { rating: number; text: string }) => void;
  mode?: 'create' | 'edit';
  existing?: { rating: number; text: string } | null;
  onDelete?: () => void; // apenas no modo edição
};

export default function AddReviewModal({ isOpen, onClose, storeName, onSubmit, mode = 'create', existing, onDelete }: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(existing?.rating || 0);
  const [hover, setHover] = useState<number>(0);
  const [text, setText] = useState<string>(existing?.text || '');
  const [submitting, setSubmitting] = useState(false);

  // Atualiza estado ao abrir em modo edição caso props mudem
  useEffect(() => {
    if (isOpen && mode === 'edit' && existing) {
      setRating(existing.rating);
      setText(existing.text);
    } else if (isOpen && mode === 'create') {
      setRating(0);
      setText('');
    }
  }, [isOpen, mode, existing]);

  const canSubmit = useMemo(() => rating > 0 && text.trim().length > 0, [rating, text]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      onSubmit?.({ rating, text: text.trim() });
      if (mode === 'create') {
        setRating(0);
        setText('');
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const Star = ({ index }: { index: number }) => {
    const effective = hover || rating; // valor mostrado durante hover
    const full = effective >= index;
    const half = !full && effective >= index - 0.5;
    const outline = '#A78BFA';
    const fill = '#6A38F3';
    const width = full ? '100%' : half ? '50%' : '0%';
    return (
      <div
        className="relative inline-block w-12 h-12 select-none"
        onMouseLeave={() => setHover(0)}
        aria-label={`Definir avaliação ${index} de 5`}
        role="group"
      >
        {/* Estrela base */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke={outline}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute inset-0"
        >
          <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"></polygon>
        </svg>
        {/* Preenchimento controlado (meia/cheia) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill={fill}
            stroke={fill}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0"
          >
            <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9"></polygon>
          </svg>
        </div>
        {/* Áreas clicáveis (meia esquerda / meia direita) */}
        <button
          type="button"
          className="absolute left-0 top-0 h-full w-1/2 bg-transparent"
          onMouseEnter={() => setHover(index - 0.5)}
          onClick={() => setRating(index - 0.5)}
          aria-label={`${index - 0.5} estrelas`}
        />
        <button
          type="button"
          className="absolute right-0 top-0 h-full w-1/2 bg-transparent"
          onMouseEnter={() => setHover(index)}
          onClick={() => setRating(index)}
          aria-label={`${index} estrelas`}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <IoClose size={28} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {mode === 'create' ? (
            <>Você está avaliando <span className="text-gray-700">{storeName || 'esta loja'}</span></>
          ) : (
            <>Editar sua avaliação</>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} index={i} />
            ))}
          </div>

          <textarea
            placeholder="Avaliação da loja"
            className="w-full h-56 md:h-64 p-4 bg-white rounded-2xl shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900 placeholder-gray-500 resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="pt-2">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="flex-1 bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#5a2ee0] transition-colors shadow-md"
              >
                {submitting ? (mode === 'create' ? 'Enviando...' : 'Salvando...') : mode === 'create' ? 'Avaliar' : 'Salvar alterações'}
              </button>
              {mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="md:w-48 bg-red-600 text-white font-semibold py-4 rounded-xl text-lg hover:bg-red-700 transition-colors shadow-md"
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}