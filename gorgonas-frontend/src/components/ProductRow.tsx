'use client';

import { ProductCard } from './ProductCard';

type ProdutoParaCard = {
    id: number;
    nome: string;
    preco: number;
    estoque: number;
    loja: { logo: string | null } | null;
    imagens: { urlImagem: string }[];
};

interface ProductRowProps {
    title?: string;
    products: ProdutoParaCard[];
    viewMoreHref: string;
}

export function ProductRow({ title, products, viewMoreHref }: ProductRowProps) {

    return (
        <section className="pb-12">

            {/* CORREÇÃO: O link deve estar DENTRO desta div */}
            <div className="flex justify-end mb-4">
                <a href={viewMoreHref} className="text-sm text-[#6A38F3] hover:underline">
                    ver mais
                </a>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex flex-nowrap gap-6">
                    {products.length > 0 ? (
                        products.map(produto => (
                            <div key={produto.id} className="shrink-0 w-64">
                                <ProductCard
                                    id={produto.id}
                                    name={produto.nome}
                                    price={produto.preco.toString()}
                                    isAvailable={produto.estoque > 0}
                                    imageUrl={produto.imagens?.[0]?.urlImagem || '/Stock.io.png'}
                                    badgeUrl={produto.loja?.logo || undefined}
                                />
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