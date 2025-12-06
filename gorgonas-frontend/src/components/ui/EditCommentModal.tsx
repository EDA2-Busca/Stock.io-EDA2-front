'use client';

import React, { useEffect, useState } from 'react';
import { IoClose, IoTrash } from 'react-icons/io5';

export type EditCommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  onSubmit: (text: string) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
};

export default function EditCommentModal({ isOpen, onClose, initialText, onSubmit, onDelete }: EditCommentModalProps) {
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) setText(initialText);
  }, [isOpen, initialText]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    setLoading(true);
    try {
      await onSubmit(text.trim());
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || loading) return;
    setLoading(true);
    try {
      await onDelete();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
          <IoClose size={26} />
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Editar comentário</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Comentário</label>
            <textarea
              className="w-full h-48 p-4 bg-white rounded-2xl shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900 placeholder-gray-500 resize-none"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Atualize seu comentário"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <button
              type="submit"
              disabled={!text.trim() || loading}
              className="flex-1 bg-primary disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-base hover:bg-[#5a2ee0] transition-colors shadow-md"
            >
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="md:w-40 bg-red-600 text-white font-semibold py-3 rounded-xl text-base hover:bg-red-700 transition-colors shadow-md inline-flex items-center justify-center gap-2"
              >
                <IoTrash />
                {loading ? 'Excluindo...' : 'Excluir'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
