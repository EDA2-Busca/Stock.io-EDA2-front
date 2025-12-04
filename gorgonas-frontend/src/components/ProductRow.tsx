'use client';

import { ProductCard } from './ProductCard';
import Link from 'next/link';

export type ProdutoParaCard = {
    id: number;
    nome: string;
    preco: number | string;
    estoque: number;
    imagens?: { urlImagem: string }[]; 
    loja?: {
        logo?: string | null
        sticker?: string | null;
    } | null;
    unidade?: string;
};

interface ProductRowProps {
    title?: string;
    products: ProdutoParaCard[]; 
    viewMoreHref: string;
}

export function ProductRow({ title, products, viewMoreHref }: ProductRowProps) {
    return (
        <section className="pb-12">
            <div className="flex justify-end mb-4">
                <Link href={viewMoreHref} className="text-sm text-[#6A38F3] hover:underline">
                    ver mais
                </Link>
            </div>
            <div className="overflow-x-auto pb-4">
                <div className="flex flex-nowrap gap-6">
                    {products.length > 0 ? (
                        products.map(produto => (
                             <div key={produto.id} className="shrink-0 w-64">
                            <ProductCard key={produto.id} produto={produto}  />
                        </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 text-lg">
                            Ops! Nenhum produto foi encontrado nesta categoria.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}