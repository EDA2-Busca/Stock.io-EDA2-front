'use client';

import React, { useMemo, useState } from 'react';
import { IoClose } from 'react-icons/io5';

export type EditReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  storeName?: string;
  initialRating?: number;
  initialText?: string;
  onSave?: (data: { rating: number; text: string }) => void;
  onDelete?: () => void;
};

export default function EditReviewModal({ isOpen, onClose, storeName, initialRating = 0, initialText = '', onSave, onDelete }: EditReviewModalProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);
  const [text, setText] = useState<string>(initialText);
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => rating > 0 && text.trim().length > 0, [rating, text]);

  const Star = ({ index }: { index: number }) => {
    const effective = hover || rating;
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || saving) return;
    setSaving(true);
    try {
      onSave?.({ rating, text: text.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <IoClose size={28} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Você está avaliando <span className="text-gray-700">{storeName || 'esta loja'}</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-6">
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

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={onDelete}
              className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl text-lg hover:bg-red-700 transition-colors shadow-md"
            >
              DELETAR
            </button>

            <button
              type="submit"
              disabled={!canSave || saving}
              className="w-full bg-[#6A38F3] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#5a2ee0] transition-colors shadow-md"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
