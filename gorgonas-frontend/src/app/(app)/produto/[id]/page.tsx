    'use client';

    import { useEffect, useState } from "react";
    import { useRouter } from 'next/navigation';
    import { Navbar } from '@/components/Navbar';
    import { ProductCard } from '@/components/ProductCard';
    import { useParams } from "next/navigation";
    import api from '@/utilis/api';
    import { useAuth } from "@/contexts/AuthContext";
    import PencilIcon from "@/components/ui/pencil";
    import BackArrowIcon from "@/components/ui/arrow";
    import { toast } from "react-toastify";
    interface Products {
        id: number;
        lojaId: number;
        subcategoriaId: number;
        nome: string;
        descricao?: string;
        preco: number;
        estoque: number;

        loja: {
            id: number,
            nome: string,
            sticker?: string,
            usuarioId?: number
        };
        
        subcategoria: { nome: string };
        imagens?: { ordem: number, urlImagem: string }[];
        avaliacoes?: { nota: number }[];
    }


    export default function ProductPage() {
        const router = useRouter();
        const [products, setProducts] = useState<Products | null>(null);
        const { id } = useParams();
        const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
        const { user } = useAuth();
        const [relatedProducts, setRelatedProducts] = useState<Products[]>([]);
        const [isRatingOpen, setIsRatingOpen] = useState(false);
        const [rating, setRating] = useState<number>(0);
        const [hoverRating, setHoverRating] = useState<number | null>(null);

        function openRating() {
            if (!user) {
                toast.warn("Entre para avaliar o produto.");
                return;
            }
            setIsRatingOpen(true);
        }

        async function submitRating() {
            if (!products || !id) return;
            // Arredonda para inteiro 1..5 para alinhar ao backend
            const rounded = Math.max(1, Math.min(5, Math.round(rating)));
            try {
                await api.post(`/avaliacoes-produto`, {
                    produtoId: products.id,
                    nota: rounded,
                });
                toast.success("Avaliação registrada!");
                setIsRatingOpen(false);
                const response = await api.get(`/produtos/${id}`);
                setProducts(response.data);
            } catch (err) {
                console.error("Erro ao salvar avaliação:", err);
                toast.error("Não foi possível salvar sua avaliação.");
            }
        }
        useEffect(() => {
            if (!id) return;

            async function fetchProduct() {
                try {
                    // --- CHAMADA DE API REAL ---
                    const response = await api.get(`/produtos/${id}`);
                    const product: Products = response.data;

                    setProducts(product);

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
        }, [id]);

        useEffect(() => {
            // Só rode se o produto principal já tiver sido carregado
            if (!products) return;

            const lojaId = products.lojaId;
            const productId = products.id;
            
            async function fetchRelated() {
                try {
                    const response = await api.get(`/produtos/loja/${lojaId}`);
                    
                    const filtered = response.data.filter((p: Products) => p.id !== productId);

                    setRelatedProducts(filtered.slice(0, 5)); // Limita a 5 produtos
                } catch (err) {
                    console.error("Erro ao buscar produtos da loja:", err);
                }
            }
            fetchRelated();
        }, [products]);

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
        
        const formattedPrice = (products.preco || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });

        const avgRating = (products.avaliacoes && products.avaliacoes.length > 0)
            ? (products.avaliacoes.reduce((acc, r) => acc + r.nota, 0) / products.avaliacoes.length).toFixed(1)
            : "N/A";

        const totalReviews = products.avaliacoes?.length || 0;
        const isOwner = user && products.loja && user.id === products.loja.usuarioId;
        return (
            <main className="bg-[#FDF9F2] min-h-screen">
                <Navbar />
                <div className="max-w-7xl mx-auto p-4 md:p-8">

                    <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 w-fit">
                        <BackArrowIcon />
                        <span className="font-medium">Voltar</span>
                    </button>

                    {/* --- 1. SEÇÃO PRINCIPAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-50">

                        {/* --- COLUNA ESQUERDA (Galeria Dinâmica) --- */}
                        <div className="flex flex-col">
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-4">
                                    {products.imagens
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

                                {/* Imagem Principal*/}
                                <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 md:p-8 flex items-center justify-center min-h-[528px] min-w-[500px]">
                                    <img src={selectedImageUrl} alt={products.nome} className="object-contain w-100 h-auto max-w-full max-h-[600px]" />
                                </div>
                            </div>
                        </div>

                        {/* --- COLUNA DIREITA  --- */}
                        <div className="flex flex-col gap-4 min-w-0">
                            <div className="flex justify-between items-start">
                                <h1 className="text-3xl font-bold text-gray-900 wrap-break-word">{products.nome}</h1>
                                {isOwner && (
                                    <button className="text-purple-600 hover:text-purple-800 ml-2">
                                        <PencilIcon />
                                    </button>
                                )}
                            </div>

                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                                                                <span>⭐ {avgRating} | {totalReviews} reviews</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={openRating}
                                                                    className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                                                                >
                                                                    Avaliar
                                                                </button>
                                <span className="text-purple-600 font-medium">{products.subcategoria.nome}</span>
                                <span className="text-blue-500 font-medium">{products.estoque} disponíveis</span>
                            </div>

                            <div className="text-4xl font-bold text-gray-900">
                                {formattedPrice}
                            </div>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-800">Descrição</h3>
                                <p className="text-sm text-gray-600 leading-relaxed wrap-break-word">
                                    {products.descricao || "Nenhuma descrição fornecida."}
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="mt-16 md:mt-24">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Da mesma loja</h2>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">


                            {relatedProducts.map((related: Products) => {
                                // Adaptação segura dos dados
                                const priceString = (related.preco || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('R$', '');
                                const isAvailable = (related.estoque || 0) > 0;
                                const imageUrl = related.imagens?.[0]?.urlImagem || '/placeholder/default-product.png';
                                const badgeUrl = related.loja?.sticker;

                                return (
                                    <ProductCard
                                        key={related.id}
                                        id={related.id} 
                                        name={related.nome}
                                        price={priceString}
                                        isAvailable={isAvailable}
                                        imageUrl={imageUrl}
                                        badgeUrl={badgeUrl}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div> 

                                {/* Modal de Avaliação */}
                                {isRatingOpen && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Avaliar produto</h3>
                                            <div className="flex items-center justify-center gap-3 mb-6">
                                                {[1,2,3,4,5].map((i) => {
                                                    const active = (hoverRating ?? rating) >= i;
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onMouseEnter={() => setHoverRating(i)}
                                                            onMouseLeave={() => setHoverRating(null)}
                                                            onClick={() => setRating(i)}
                                                            aria-label={`Selecionar ${i} estrela(s)`}
                                                            className="p-1"
                                                        >
                                                            <svg width={32} height={32} viewBox="0 0 24 24">
                                                                <path
                                                                    d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.787 1.402 8.168L12 18.897l-7.336 3.969 1.402-8.168L.132 9.211l8.2-1.193z"
                                                                    fill={active ? '#fbbf24' : '#e5e7eb'}
                                                                />
                                                            </svg>
                                                        </button>
                                                    );
                                                })}
                                                <span className="ml-2 text-sm text-gray-700">{(hoverRating ?? rating) || 0}/5</span>
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsRatingOpen(false); setHoverRating(null); }}
                                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={submitRating}
                                                    className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                                                >
                                                    Salvar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
            </main>
        );
    }