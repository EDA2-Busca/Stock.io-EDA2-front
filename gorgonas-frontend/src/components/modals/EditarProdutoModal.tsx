'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IoAdd, IoCameraOutline, IoClose, IoRemove } from 'react-icons/io5';
import api from '@/utilis/api';

type Subcategoria = {
  id?: number;
  nome?: string;
  categoriaId?: number;
};

export type ProdutoCompleto = {
  id: number;
  name: string;
  price: number | string;
  estoque: number;
  descricao?: string | null;
  subcategoria?: Subcategoria | null;
  imagens?: { id?: number; urlImagem?: string | null }[];
};

interface EditarProdutoModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto: ProdutoCompleto;
  onUpdated: () => void;
  onDeleted: () => void;
}

export default function EditarProdutoModal({
  isOpen,
  onClose,
  produto,
  onUpdated,
  onDeleted,
}: EditarProdutoModalProps) {
  const [nome, setNome] = useState('');
  const [subcategoriaId, setSubcategoriaId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState(0);
  const [listaSubcategorias, setListaSubcategorias] = useState<Subcategoria[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const normalizedPrice = useMemo(() => {
    if (typeof produto.price === 'number') {
      return produto.price.toFixed(2).replace('.', ',');
    }
    return produto.price?.toString() ?? '';
  }, [produto.price]);

  useEffect(() => {
    if (!isOpen) return;

    setNome(produto.name ?? '');
    setPreco(normalizedPrice);
    setDescricao(produto.descricao ?? '');
    setQuantidade(produto.estoque ?? 0);

    if (produto.subcategoria?.id) {
      setSubcategoriaId(String(produto.subcategoria.id));
      setListaSubcategorias([
        {
          id: produto.subcategoria.id,
          nome: produto.subcategoria.nome,
          categoriaId: produto.subcategoria.categoriaId,
        },
      ]);
    } else {
      setSubcategoriaId('');
      setListaSubcategorias([]);
    }

    const previews = Array.isArray(produto.imagens)
      ? produto.imagens
          .map((img) => img?.urlImagem)
          .filter((url): url is string => Boolean(url && url.trim().length > 0))
      : [];

    setPreviewImages(previews);
  }, [produto, isOpen, normalizedPrice]);

  const handleQuantityChange = (amount: number) => {
    setQuantidade((prev) => Math.max(0, prev + amount));
  };

  const parsePriceToNumber = (value: string | number) => {
    if (typeof value === 'number') return value;
    const sanitized = value.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const parsed = Number(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const buildImagesPayload = () => {
    const current = previewImages.length
      ? previewImages
      : (produto.imagens
          ?.map((img) => img?.urlImagem)
          .filter((url): url is string => Boolean(url && url.trim().length > 0)) ?? []);
    return current;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload: Record<string, any> = {
        nome,
        descricao,
        preco: parsePriceToNumber(preco),
        estoque: quantidade,
      };
      if (subcategoriaId) payload.subcategoriaId = Number(subcategoriaId);
      const imagensPayload = buildImagesPayload();
      if (imagensPayload.length) payload.imagens = imagensPayload;
      await api.patch(`/produtos/${produto.id}`, payload);
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Falha ao atualizar produto', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await api.delete(`/produtos/${produto.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error('Falha ao excluir produto', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle =
    'w-full p-3 bg-white rounded-xl shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 placeholder-gray-500 text-gray-900';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <IoClose size={28} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
          Editar Produto
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="w-full h-32 border-2 border-dashed border-purple-400 rounded-lg p-4 flex flex-col items-center justify-center text-center text-purple-600 bg-purple-50/50">
              <IoCameraOutline size={40} />
              <p className="text-sm font-medium">Gerencie as fotos do seu produto</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => {
                const image = previewImages[i];
                return (
                  <div
                    key={i}
                    className="w-full h-24 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center bg-white/50 overflow-hidden"
                  >
                    {image ? (
                      <img src={image} alt={`Produto ${produto.name}`} className="object-cover w-full h-full" />
                    ) : (
                      <IoCameraOutline className="text-purple-300" size={24} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <input
            type="text"
            placeholder="Nome do produto"
            className={inputStyle}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <div className="relative">
            <select
              className={`${inputStyle} ${
                !subcategoriaId ? 'text-gray-500' : 'text-gray-900'
              } appearance-none bg-white border border-gray-300 focus:ring-2 focus:ring-[#6A38F3]`}
              value={subcategoriaId}
              onChange={(e) => setSubcategoriaId(e.target.value)}
            >
              <option value="" disabled>
                Selecione uma subcategoria
              </option>
              {listaSubcategorias.map((sub) => (
                <option key={sub.id} value={sub.id} className="text-gray-900">
                  {sub.nome}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          <textarea
            placeholder="Descrição do produto"
            className={`${inputStyle} h-28 resize-none`}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <input
            type="text"
            placeholder="Preço do produto (R$)"
            className={inputStyle}
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />

          <div className="flex items-center justify-center space-x-8 pt-2">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="w-12 h-12 rounded-full border-2 border-[#6A38F3] text-[#6A38F3] text-3xl flex items-center justify-center transition-transform active:scale-90 hover:bg-purple-50"
            >
              <IoRemove />
            </button>
            <span className="text-6xl font-bold text-gray-800 w-20 text-center select-none">{quantidade}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="w-12 h-12 rounded-full bg-[#6A38F3] text-white text-3xl flex items-center justify-center transition-transform active:scale-90 hover:bg-[#5a2ee0]"
            >
              <IoAdd />
            </button>
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#6A38F3] text-white font-bold py-4 rounded-xl text-lg hover:bg-[#5a2ee0] transition-colors shadow-md hover:shadow-lg transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Deletando...' : 'DELETAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
