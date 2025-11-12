'use client';

import { useEffect, useState } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useParams } from "next/navigation";
import api from '@/utilis/api'; // 1. Importe seu 'api.ts'

// --- Componentes de Ícone ---
function PencilIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    );
}

function BackArrowIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
    );
}
// --- Fim dos Ícones ---


// --- 2. Interface CORRIGIDA (nomes do Prisma) ---
interface Products {
    id: number;
    lojaId: number; // MUDADO (era store_id)
    subcategoriaId: number; // MUDADO (era category_id)
    nome: string; // MUDADO (era name)
    descricao?: string; // MUDADO (era description)
    preco: number; // MUDADO (era price)
    estoque: number; // MUDADO (era stock)
    
    // Relações (nomes do Prisma)
    loja: { id: number, nome: string, banner_url?: string };
    subcategoria: { nome: string }; // MUDADO (era category)
    imagens?: { ordem: number, urlImagem: string }[]; // MUDADO (era product_images) e opcional
    avaliacoes?: { rating: number }[]; // MUDADO (era product_ratings) e opcional
}


export default function ProductPage() {
    const [products, setProducts] = useState<Products | null>(null);
    const { id } = useParams();
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    // --- 3. useEffect ATUALIZADO (com chamada de API real) ---
    useEffect(() => {
        if (!id) return; 

        async function fetchProduct() {
            try {
                // --- REMOVIDOS DADOS MOCK ---
                
                // --- CHAMADA DE API REAL ---
                const response = await api.get(`/produtos/${id}`);
                const product: Products = response.data;
                // --- FIM DA CHAMADA ---

                setProducts(product);

                // Lógica corrigida para imagens opcionais
                if (product && product.imagens && product.imagens.length > 0) {
                    const sortedImages = product.imagens.sort((a, b) => a.ordem - b.ordem);
                    setSelectedImageUrl(sortedImages[0].urlImagem);
                } else {
                    // Define um placeholder se não houver imagens
                    setSelectedImageUrl('/placeholder/default-product.png'); 
                }

            } catch (err) { 
                console.error("Erro ao buscar produto:", err);
            }
        }

        fetchProduct();
    }, [id]); // 'id' como dependência

    // Estado de Carregamento (Correto)
    if (!products || !selectedImageUrl) {
        return (
            <main className="bg-[#FDF9F2] min-h-screen">
                <Navbar />
                <div className="flex h-96 items-center justify-center text-gray-500">
                    Carregando produto...
                </div>
            </main>
        );
    }

    // --- 4. Formatação de Dados (Corrigida com nomes do Prisma) ---
    // --- 4. Formatação de Dados (Corrigida com checagem de segurança) ---
    
    // Use 'products?.preco' e um valor padrão '0'
    const formattedPrice = (products?.preco || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    // Use '?.' (optional chaining) para acessar 'avaliacoes' com segurança
    const avgRating = (products?.avaliacoes?.length || 0) > 0
        ? (products.avaliacoes!.reduce((acc, r) => acc + r.rating, 0) / products.avaliacoes!.length).toFixed(1)
        : "N/A";

    const totalReviews = products?.avaliacoes?.length || 0;


    // --- 5. Renderização do JSX (com seu layout e nomes de dados CORRIGIDOS) ---
    return (
        <main className="bg-[#FDF9F2] min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto p-4 md:p-8">

                <a href="/" className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 w-fit">
                    <BackArrowIcon />
                    <span className="font-medium">Voltar</span>
                </a>

                {/* --- 1. SEÇÃO PRINCIPAL (Duas Colunas) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-50">

                    {/* --- COLUNA ESQUERDA (Galeria Dinâmica) --- */}
                    <div className="flex flex-col">
                        <div className="flex gap-4">
                            {/* Thumbnails (Dinâmicas) */}
                            <div className="flex flex-col gap-4">
                                {products.imagens // MUDADO (era product_images)
                                    ?.sort((a, b) => a.ordem - b.ordem) 
                                    .map((img) => (
                                        <div
                                            key={img.ordem}
                                            onClick={() => setSelectedImageUrl(img.urlImagem)}
                                            className={`w-16 h-16 md:w-32 md:h-32 bg-white rounded-lg border p-1 flex items-center justify-center cursor-pointer transition-all
                                ${selectedImageUrl === img.urlImagem ? 'border-purple-600 border-2' : 'border-gray-200 hover:border-gray-400'}`}
                                        >
                                            <img src={img.urlImagem} alt={products.nome} className="object-contain max-h-full rounded-md" />
                                        </div>
                                    ))}
                            </div>

                            {/* Imagem Principal (Dinâmica) */}
                            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 md:p-8 flex items-center justify-center min-h-[528px] min-w-[500px]">
                                <img src={selectedImageUrl} alt={products.nome} className="object-contain w-100 h-auto max-w-full max-h-[600px]" />
                            </div>
                        </div>
                    </div>

                    {/* --- COLUNA DIREITA (Informações Dinâmicas) --- */}
                    <div className="flex flex-col gap-4 min-w-0"> 
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-900 wrap-break-word">{products.nome}</h1> {/* MUDADO (era name) */}
                            <button className="text-purple-600 hover:text-purple-800 ml-2">
                                <PencilIcon />
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>⭐ {avgRating} | {totalReviews} reviews</span>
                            <span className="text-purple-600 font-medium">{products.subcategoria.nome}</span> {/* MUDADO (era category.name) */}
                            <span className="text-blue-500 font-medium">{products.estoque} disponíveis</span> {/* MUDADO (era stock) */}
                        </div>

                        <div className="text-4xl font-bold text-gray-900">
                            {formattedPrice}
                        </div>

                        {/* Bloco Descrição */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800">Descrição</h3>
                            <p className="text-sm text-gray-600 leading-relaxed wrap-break-word">
                                {products.descricao || "Nenhuma descrição fornecida."} {/* MUDADO (era description) */}
                            </p>
                        </div> 
                    </div> {/* Fim da Coluna Direita */}

                </div> 
                {/* --- Fim da Seção Principal (Grid) --- */}


                {/* --- 2. SEÇÃO "DA MESMA LOJA" (Estática, como pedido) --- */}
                <div className="mt-16 md:mt-24">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Da mesma loja</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        
                        {/* (Seus ProductCards estáticos) */}
                        
                        <ProductCard
                            name="Nozes"
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/nozes.png"
                            badgeUrl="/logo-cjr.png"
                        />
                        
                        <ProductCard
                            name="Brownie"
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/brownie.png"
                            badgeUrl="/logo-cjr.png"
                        />
                    </div>
                </div>
            </div> {/* Fim do div max-w-7xl */}
        </main>
    );
}