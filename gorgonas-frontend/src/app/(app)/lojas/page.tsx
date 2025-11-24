"use client";

import { useEffect, useState } from "react";
import api from "@/utilis/api";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";


interface LojaDetalhe {
  id: number;
  nome: string;
  categoria?: { nome: string };
  logo_url?: string | null;
  banner_url?: string | null;
}

export default function LojaPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [loja, setLoja] = useState<LojaDetalhe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoja = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/lojas/${id}`);
        setLoja(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da loja:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoja();
  }, [id]);

  if (loading) {
    return (
      <main className="bg-[#FDF9F2] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <p className="text-gray-600 text-lg">Carregando loja...</p>
        </div>
      </main>
    );
  }

  if (!loja) {
    return (
      <main className="bg-[#FDF9F2] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-8 py-20 text-center">
          <p className="text-red-500 text-lg">
            Loja não encontrada. Verifique o ID.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      <header className="w-full bg-black relative">
        <Navbar />
      </header>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Cabeçalho da loja */}
        <section className="flex items-center gap-8">
          <div className="w-40 h-40 flex items-center justify-center rounded-full bg-white shadow ring-1 ring-black/5">
            <Image
              src={loja.logo_url || "/StockIo.png"}
              alt={loja.nome}
              width={140}
              height={140}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-[#171918]">{loja.nome}</h1>
            <p className="text-xl text-[#6A38F3] mt-1">
              {loja.categoria?.nome || "Categoria não especificada"}
            </p>
          </div>
        </section>

        {/* Banner */}
        {loja.banner_url && (
          <div className="mt-12 w-full">
            <Image
              src={loja.banner_url}
              alt="Banner da loja"
              width={1200}
              height={400}
              className="w-full h-64 object-cover rounded-xl shadow"
            />
          </div>
        )}

        {/* Placeholder para futuros produtos */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[#171918] mb-6">
            Produtos desta loja
          </h2>

          <p className="text-gray-500">
            Em breve: listagem de produtos vinculados à loja.
          </p>
        </section>
      </div>
    </main>
  );
}
