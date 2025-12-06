'use client';
import React from 'react';
import { ProductCard } from './ProductCard'; 

// Tipos simulados
type Product = {
  id: number; // Tipo 'number'
  name: string;
  price: string;
  isAvailable: boolean;
  imageUrl: string;
  unit?: string;
  rating?: number; // opcional: média de avaliações
};

type ProductScrollProps = {
  title: string;
  products: Product[];
  seeMoreLink?: string;
};

// Componente para uma secção com scroll horizontal de produtos
export default function ProductScroll({ title, products, seeMoreLink }: ProductScrollProps) {
  if (!products || products.length === 0) return null;
  return (
    <section className="w-full mb-12">
      {/* Título da Secção e "ver mais" */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#171918]">
          {title}
        </h2>
        {seeMoreLink && (
          <a href={seeMoreLink} className="text-sm text-[#6A38F3] hover:underline">
            ver mais
          </a>
        )}
      </div>
      
      {/* Container da Lista com Scroll Horizontal */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {products.map((product) => (
          // 'shrink-0' impede que os cartões encolham
          <div key={product.id} className="w-64 shrink-0">
            <ProductCard 
              id={product.id}
              name={product.name}
              price={product.price}
              isAvailable={product.isAvailable}
              imageUrl={product.imageUrl}
              unit={product.unit}
              rating={product.rating}
            />
          </div>
        ))}
      </div>
    </section>
  );
}