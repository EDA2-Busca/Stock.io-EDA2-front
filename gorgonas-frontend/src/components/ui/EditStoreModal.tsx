"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import Button from "./Button";
import ImageUploadDropzone from "./ImageUploadStore";
import api from "@/utilis/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lojaId: string;
  initialName: string;
  initialCategory: string;
  initialImages?: {
    perfilUrl?: string | null;
    logoSvgUrl?: string | null;
    bannerUrl?: string | null;
  };
  onUpdated?: (updated: {
    nome: string;
    categoria: string;
    perfilUrl?: string | null;
    logoSvgUrl?: string | null;
    bannerUrl?: string | null;
  }) => void;
  onDeleted?: () => void;
};

export default function EditStoreModal({
  isOpen,
  onClose,
  lojaId,
  initialName,
  initialCategory,
  initialImages,
  onUpdated,
  onDeleted,
}: Props) {
  const [nomeLoja, setNomeLoja] = useState(initialName || "");
  const [categoria, setCategoria] = useState(initialCategory || "");
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const categoriasNomes = ["Mercado", "Farmácia", "Moda", "Eletrônicos"];
  const [resolvendoCategoria, setResolvendoCategoria] = useState(false);

  const [perfilFile, setPerfilFile] = useState<File | null>(null);
  const [logoSvgFile, setLogoSvgFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categoriaAlteradaPeloUsuario, setCategoriaAlteradaPeloUsuario] = useState(false);

  const canSubmit = useMemo(() => {
    const categoriaOk = categoriaAlteradaPeloUsuario ? categoriaId !== null : true;
    return !!nomeLoja && categoriaOk && !isSubmitting && !isDeleting;
  }, [nomeLoja, categoriaAlteradaPeloUsuario, categoriaId, isSubmitting, isDeleting]);

  // Resolve categoriaId chamando GET /categorias/:nome
  useEffect(() => {
    let active = true;
    (async () => {
      if (!initialCategory) { setCategoriaId(null); return; }
      // Ajusta valor exibido no select para corresponder às opções (normaliza enum -> label)
      const normalizedNoAccent = initialCategory
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const display =
        normalizedNoAccent === 'mercado' ? 'Mercado' :
          normalizedNoAccent === 'farmacia' ? 'Farmácia' :
            normalizedNoAccent === 'moda' ? 'Moda' :
              normalizedNoAccent === 'eletronicos' ? 'Eletrônicos' : initialCategory;
      setCategoria(display);
      try {
        const normalized = initialCategory
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        const nomeReq = normalized.charAt(0).toUpperCase() + normalized.slice(1);
        const res = await api.get(`/categorias/${encodeURIComponent(nomeReq)}`);
        if (!active) return;
        setCategoriaId(res.data?.id ?? null);
      } catch {
        setCategoriaId(null);
      }
    })();
    return () => { active = false; };
  }, [initialCategory]);

  const resetAndClose = useCallback(() => {
    setIsSubmitting(false);
    setIsDeleting(false);
    setPerfilFile(null);
    setLogoSvgFile(null);
    setBannerFile(null);
    onClose();
  }, [onClose]);

  const fileToDataUrl = async (file: File | null) => {
    if (!file) return null;
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (nomeLoja) formData.append('nome', nomeLoja);
      if (categoriaAlteradaPeloUsuario && categoriaId !== null) {
        formData.append('categoriaId', String(categoriaId));
      }
      if (perfilFile) formData.append('perfil', perfilFile);
      if (logoSvgFile) formData.append('logo', logoSvgFile);
      if (bannerFile) formData.append('banner', bannerFile);

      await api.patch(`/lojas/${lojaId}`, formData);

      toast.success("Loja atualizada com sucesso!");
      onUpdated?.({ nome: nomeLoja, categoria });
      resetAndClose();
    } catch (err: any) {
      console.error(err);
      const status = err?.response?.status;
      const message: string | undefined = err?.response?.data?.message || err?.response?.data?.error;

      if (status === 409) {
        toast.error("Já existe outra loja com este nome.");
      } else if (status === 403) {
        toast.error("Permissão negada.");
      } else {
        toast.error(message || "Falha ao atualizar a loja.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm("Tem certeza que deseja deletar a loja? Esta ação é irreversível.");
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await api.delete(`/lojas/${lojaId}`);
      toast.success("Loja deletada com sucesso.");
      onDeleted?.();
      resetAndClose();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 403) {
        toast.error("Você não tem permissão para excluir esta loja.");
      } else {
        toast.error("Falha ao excluir a loja. Tente novamente.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl px-10 py-8 shadow-lg">
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Editar loja</h2>
          <button
            onClick={resetAndClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-800 transition-colors"
            aria-label="Fechar"
          >
            <IoClose size={28} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da loja"
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            className="w-full h-14 px-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900"
          />

          <select
            value={categoria || ''}
            onChange={async (e) => {
              const nome = e.target.value;
              setCategoria(nome);
              setCategoriaAlteradaPeloUsuario(true);
              if (!nome) { setCategoriaId(null); return; }
              setResolvendoCategoria(true);
              try {
                const normalized = nome
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .toLowerCase();
                const nomeReq = normalized.charAt(0).toUpperCase() + normalized.slice(1);
                const res = await api.get(`/categorias/${encodeURIComponent(nomeReq)}`);
                setCategoriaId(res.data?.id ?? null);
              } catch {
                setCategoriaId(null);
              } finally {
                setResolvendoCategoria(false);
              }
            }}
            className="w-full h-14 pl-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A38F3]/50 text-gray-900"
          >
            <option value="" disabled>Categoria</option>
            {categoriasNomes.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          <ImageUploadDropzone label="Anexe a foto de perfil da sua loja" onFileChange={(file) => setPerfilFile(file)} />
          <ImageUploadDropzone label="Anexe a logo em SVG de sua loja" onFileChange={(file) => setLogoSvgFile(file)} />
          <ImageUploadDropzone label="Anexe o banner de sua loja" onFileChange={(file) => setBannerFile(file)} />

          <div className="pt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              disabled={isDeleting || isSubmitting}
              onClick={handleDelete}
              className="w-full py-3 rounded-full bg-red-600 text-white font-semibold shadow-lg hover:bg-red-700 disabled:opacity-60"
            >
              Deletar
            </button>
            <div className="flex-1" />
            <Button type="submit" disabled={!canSubmit || resolvendoCategoria} fullWidth={false}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
