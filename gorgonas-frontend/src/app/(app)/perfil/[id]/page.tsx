'use client';

import { Navbar } from "@/components/Navbar";
import ProductScroll from '@/components/ProductScroll';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utilis/api';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, use } from "react";
import { toast } from "react-toastify";
import { ProductRow } from "@/components/ProductRow";
import { ProfileHeader } from "@/components/headPerfil";
import { ProfileHeaderProps } from "@/components/headPerfil";

type ProdutoParaCard = {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
    loja: { logo: string | null } | null;
    imagens: { urlImagem: string }[];
};

export default function PerfilPage() {
  const idPerfil = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [perfil, setPerfil] = useState<ProfileHeaderProps | null>(null);

  const [produtos, setProdutos] = useState<ProdutoParaCard[]>([]);

  useEffect (() => {
    
    setIsLoading(true);

    async function listarProdutos() {
        
        try {

            const response = await api.get(`/produtos/ver-mais/usuario/${idPerfil.id}`);
            console.log("Produtos do usuário:", response.data);
            setProdutos(response.data);

            setIsLoading(false);

        } catch (error) {

            toast.error("Erro ao listar produtos do usuário:");
            setIsLoading(false);
 
        } finally {
            setIsLoading(false);
        }

    }
        listarProdutos();
}, [idPerfil.id]);


useEffect(() => {
    
    setIsLoading(true);

    async function procurarPerfil() {

    try {
        const response = await api.get(`/usuario/${idPerfil.id}`);
        setPerfil(response.data);
    } catch (error) {
        toast.error("Erro ao carregar perfil do usuário.");
    } finally {
        setIsLoading(false);
    }
    }
    procurarPerfil();
}, [idPerfil.id]);

return (
    <main className="bg-[#FDF9F2] min-h-screen">
                <Navbar />
                <ProfileHeader
                    perfil={perfil}
                />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <ProductRow 
            title="Produtos"
            products={produtos}
            viewMoreHref="/ver-mais/produtos"
        />
        </div>
    </main>
);
}