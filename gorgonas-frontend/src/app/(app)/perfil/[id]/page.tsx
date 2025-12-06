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
import  AddStoreModal from "@/components/ui/AddStoreModal";
import { ReviewSection, ReviewData } from "@/components/secaoAvaliacao";

type ProdutoParaCard = {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
    loja: { logo: string | null } | null;
    imagens: { urlImagem: string }[];
};

const mockReviews = [
    {
      author: "Selena Gomez",
      text: "Não é por nada não, mas essa garota arrasa. Os produtos são incríveis e chegaram super rápido!",
      avatarUrl: "https://github.com/shadcn.png", // ou a url da foto dela
      rating: 5
    },
    {
      author: "Justin B.",
      text: "Muito bom, recomendo a todos da plataforma!",
      avatarUrl: "/avatar-placeholder.png",
      rating: 4
    }
  ];

export default function PerfilPage() {
  const idPerfil = useParams();
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<ProfileHeaderProps | null>(null);
  const [lojas, setLojas] = useState<StoreCardProps[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [produtos, setProdutos] = useState<ProdutoParaCard[]>([]);
  const [avaliacoes, setAvaliacoes] = useState<ReviewData[]>([]);

  const [isModalUsuarioOpen, setIsModalUsuarioOpen] = useState(false);
  const [isModalEditarSenhaOpen, setIsModalEditarSenhaOpen] = useState(false);
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

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

    async function procurarAvaliacoes() {
        if (!idPerfil?.id) return;

        try {
            const response = await api.get(`/usuario/avaliacoes/${idPerfil.id}`);
            
            // A resposta é: { nome: "User", fotoPerfil: "...", avaliacoesLoja: [...] }
            const { nome, fotoPerfil, avaliacoesLoja } = response.data;

            // Se o usuário não tiver avaliações, avaliacoesLoja pode vir undefined ou vazio
            if (!avaliacoesLoja) {
                setAvaliacoes([]);
                return;
            }

            // Mapeamos a lista de reviews usando os dados do usuário como Autor
            const avaliacoesFormatadas = avaliacoesLoja.map((review: any) => ({
                id: review.id,
                author: nome, // O autor é o dono do perfil
                avatarUrl: fotoPerfil || "/stores/cjr.png",
                rating: review.nota,
                text: review.conteudo || "Sem comentário."
            }));

            setAvaliacoes(avaliacoesFormatadas);

        } catch (error) {
            console.error("Erro ao buscar avaliações:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    procurarAvaliacoes();
  }, [idPerfil?.id]);

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
    <main className="bg-background min-h-screen">
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
            isUsuario={user?.id === Number(idPerfil.id)}
            title="Lojas"
            lojas={lojas || []}
            onAddStore={() => setIsAddStoreModalOpen(true)}
        />


        {avaliacoes.length > 0 && (
            <ReviewSection reviews={avaliacoes} />
        )}
        </div>

        <ModalEdicaoUsuario
            isUsuario={user?.id === Number(idPerfil.id)}
            isOpen={isModalUsuarioOpen}
            onClose={closeAll}
            onEditPassword={openPasswordFlow}
            initialData={perfil || undefined}
            />
        
        <ModalEditarSenha 
            isUsuario={user?.id === Number(idPerfil.id)}
            isOpen={isModalEditarSenhaOpen}
            onClose={closeAll}       
            onBack={backToUserFlow}  
        />

        <AddStoreModal 
            isUsuario={user?.id === Number(idPerfil.id)}
            isOpen={isAddStoreModalOpen}
            onClose={() => setIsAddStoreModalOpen(false)}
        />

        
    </main>
);
}