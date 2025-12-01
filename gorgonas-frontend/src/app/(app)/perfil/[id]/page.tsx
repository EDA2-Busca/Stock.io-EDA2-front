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
import { StoreHeader, StoreHeaderProps } from "@/components/lojasList";
import { StoreCardProps } from "@/components/ui/StoreCard";
import { ModalEdicaoUsuario } from "@/components/ModalEdicaoUsuario";
import { ModalEditarSenha } from "@/components/ModalEditarSenha";


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
  const [lojas, setLojas] = useState<StoreCardProps[] | null>(null);

  const [produtos, setProdutos] = useState<ProdutoParaCard[]>([]);

  const [isModalUsuarioOpen, setIsModalUsuarioOpen] = useState(false);
  const [isModalEditarSenhaOpen, setIsModalEditarSenhaOpen] = useState(false);

const openPasswordFlow = () => {
    setIsModalUsuarioOpen(false);      // Fecha o de usuário
    setIsModalEditarSenhaOpen(true);   // Abre o de senha
  };

  const backToUserFlow = () => {
    setIsModalEditarSenhaOpen(false);  // Fecha o de senha
    setIsModalUsuarioOpen(true);       // Reabre o de usuário
  };

  const closeAll = () => {
    setIsModalUsuarioOpen(false);
    setIsModalEditarSenhaOpen(false);
  };

  useEffect (() => {
    
    setIsLoading(true);

    async function listarProdutos() {
        
        try {

            const response = await api.get(`/produtos/ver-mais/usuario/${idPerfil.id}`);
            console.log("Produtos do usuário:", response.data);
            setProdutos(response.data);

            setIsLoading(false);

        } catch (error) {

            toast.error("Erro ao listar produtos do usuário.");
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

useEffect(() => {
    
    setIsLoading(true);

    async function procurarLojas() {

    try {
        const response = await api.get(`/lojas/usuario/${idPerfil.id}`);
        setLojas(response.data);
    } catch (error) {
        toast.error("Erro ao carregar Lojas do usuário.");
    } finally {
        setIsLoading(false);
    }
    }
    procurarLojas();
}, [idPerfil.id]);

return (
    <main className="bg-[#FDF9F2] min-h-screen">
                <Navbar />
                <ProfileHeader
                    perfil={perfil}
                    onEditProfile={() => setIsModalUsuarioOpen(true)}
                />
        <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        <ProductRow 
            title="Produtos"
            products={produtos}
            viewMoreHref="/ver-mais/produtos"
        />

        <StoreHeader
            title="Lojas"
            lojas={lojas || []}
        />
        </div>

        <ModalEdicaoUsuario
            isOpen={isModalUsuarioOpen}
            onClose={closeAll}
            onEditPassword={openPasswordFlow}
            initialData={perfil || undefined}
            />
        
        <ModalEditarSenha 
            isOpen={isModalEditarSenhaOpen}
            onClose={closeAll}       
            onBack={backToUserFlow}  
        />

    </main>
);
}