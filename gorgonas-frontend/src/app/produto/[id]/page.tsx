'use client';

import { useEffect, useState } from "react";
import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';
import { useParams } from "next/navigation";

// (Sua função getProductsById deve estar importada aqui)
// import { getProductsById } from '@/utils/api'; 

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


// Interface dos dados do produto
interface Products {
    id: number,
    store_id: number,
    category_id: number,
    name: string,
    description?: string,
    price: number,
    stock: number,
    store: { banner_url: string },
    category: { name: string },
    product_images: { order: number, image_url: string }[]
    product_ratings: { rating: number }[]
}


export default function ProductPage() {
    const [products, setProducts] = useState<Products | null>(null);
    const { id } = useParams();
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                // (Assumindo que getProductsById existe e funciona)
                // const product = await getProductsById(Number(id));

                // --- DADOS MOCK (SUBSTITUA PELA LINHA ACIMA) ---
                const product: Products = {
                    id: Number(id),
                    name: "Brownie Meio Amargo (Dado Real)",
                    description: "Descrição vinda do banco de dados... Recheado com um mini ganache...",
                    price: 4.70,
                    stock: 3,
                    category: { name: "Mercado" },
                    store: { banner_url: "/placeholder/logo-cjr.png" },
                    product_images: [
                        { order: 1, image_url: '/placeholder/brownie-pacote.png' },
                        { order: 2, image_url: '/placeholder/brownie-fatia.png' },
                        { order: 3, image_url: '/placeholder/brownie-fatia-2.png' },
                        { order: 4, image_url: '/placeholder/brownie-tabela.png' },
                    ],
                    product_ratings: [{ rating: 4 }, { rating: 5 }], // Dados mock
                    store_id: 2, 
                    category_id:1
                };
                // --- FIM DOS DADOS MOCK ---

                setProducts(product);

                if (product && product.product_images && product.product_images.length > 0) {
                    const sortedImages = product.product_images.sort((a, b) => a.order - b.order);
                    setSelectedImageUrl(sortedImages[0].image_url);
                }

            } catch (err) { console.log(err) }
        }

        if (id) {
            fetchProduct();
        }

    }, [id]);

    // Estado de Carregamento
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

    // Formatação de Dados
    const formattedPrice = products.price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    const avgRating = products.product_ratings.length > 0
        ? (products.product_ratings.reduce((acc, r) => acc + r.rating, 0) / products.product_ratings.length).toFixed(1)
        : "N/A";

    // --- Renderização do JSX ---
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
                                {products.product_images
                                    .sort((a, b) => a.order - b.order) 
                                    .map((img) => (
                                        <div
                                            key={img.order}
                                            onClick={() => setSelectedImageUrl(img.image_url)}
                                            className={`w-16 h-16 md:w-30 md:h-30 bg-white rounded-lg border p-1 flex items-center justify-center cursor-pointer transition-all
                                ${selectedImageUrl === img.image_url ? 'border-purple-600 border-2' : 'border-gray-200 hover:border-gray-400'}`}
                                        >
                                            <img src={img.image_url} alt={products.name} className="object-contain max-h-full rounded-md" />
                                        </div>
                                    ))}
                            </div>

                            {/* Imagem Principal (Dinâmica) */}
                            <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 md:p-8 flex items-center justify-center min-h-[528px] min-w-[550px]">
                                <img src={selectedImageUrl} alt={products.name} className="object-contain w-auto h-auto max-w-full max-h-[500px]" />
                            </div>
                        </div>
                    </div>

                    {/* --- COLUNA DIREITA (Informações Dinâmicas) --- */}
                    <div className="flex flex-col gap-4 min-w-0"> 
                        <div className="flex justify-between items-start">
                            <h1 className="text-3xl font-bold text-gray-900 break-words">{products.name}</h1>
                            <button className="text-purple-600 hover:text-purple-800 ml-2">
                                <PencilIcon />
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span>⭐ {avgRating} | {products.product_ratings.length} reviews</span>
                            <span className="text-purple-600 font-medium">{products.category.name}</span>
                            <span className="text-blue-500 font-medium">{products.stock} disponíveis</span>
                        </div>

                        <div className="text-4xl font-bold text-gray-900">
                            {formattedPrice}
                        </div>

                        {/* Bloco Descrição */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800">Descrição</h3>
                            <p className="text-sm text-gray-600 leading-relaxed break-words">
                                {products.description || "Nenhuma descrição fornecida."}
                            </p>
                            {/* CORREÇÃO 1: </Ddiv> foi trocado por </p> */}
                        </div> 
                        {/* CORREÇÃO 2: O <div> de Descrição fecha aqui */}

                        {/* Bloco Ingredientes (Movido para fora do <div> de Descrição) */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-gray-800">Ingredientes</h3>
                            <p className="text-sm text-gray-600 leading-relaxed break-words">
                                (Campo 'ingredientes' não encontrado no seu model. Adicione ao banco de dados.)
                            </p>
                        </div>

                        {/* Bloco Alergênicos (Movido para fora do <div> de Descrição) */}
                        <div className="space-y-1 pt-2">
                            <p className="text-xs font-semibold text-red-600">
                                (Campo 'alergênicos' não encontrado no seu model. Adicione ao banco de dados.)
                            </p>
                        </div>
                        
                    </div> {/* Fim da Coluna Direita */}

                </div> 
                {/* --- Fim da Seção Principal (Grid) --- */}
                {/* CORREÇÃO 3: Este </div> estava faltando */}


                {/* --- 2. SEÇÃO "DA MESMA LOJA" --- */}
                <div className="mt-16 md:mt-24">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Da mesma loja</h2>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                        
                        {/* (Seus ProductCards estáticos) */}
                        <ProductCard
                            name="Brownie Trad."
                            price="3,80"
                            isAvailable={false}
                            imageUrl="/placeholder/brownie-trad.png"
                            badgeUrl="/placeholder/logo-cjr.png"
                        />
                        <ProductCard
                            name="Brownie Doce L."
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/placeholder/brownie-doce.png"
                            badgeUrl="/placeholder/logo-cjr.png"
                        />
                        <ProductCard
                            name="Brownie Nozes"
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/placeholder/brownie-nozes.png"
                            badgeUrl="/placeholder/logo-cjr.png"
                        />
                        <ProductCard
                            name="Brownie Cookies"
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/placeholder/brownie-cookies.png"
                            badgeUrl="/placeholder/logo-cjr.png"
                        />
                        <ProductCard
                            name="Brownie M8"
                            price="4,70"
                            isAvailable={true}
                            imageUrl="/placeholder/brownie-m8.png"
                            badgeUrl="/placeholder/logo-cjr.png"
                        />
                    </div>
                </div>
            </div> {/* Fim do div max-w-7xl */}
        </main>
    );
}