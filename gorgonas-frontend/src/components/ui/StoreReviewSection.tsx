'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa';
import StoreReviewCard from '@/components/ui/StoreReviewCard'; 

// Tipos de dados
type Review = {
  id: string;
  author: string;
  text: string;
  avatarUrl: string;
  rating: number;
};

type Props = {
  rating: number;
  reviewCount: number;
  reviews: Review[]; 
  seeMoreLink: string;
};

// Componente para a secção preta de Reviews
export default function StoreReviewSection({ rating, reviewCount, reviews, seeMoreLink }: Props) {
  return (
    <section className="w-full bg-black text-white py-8">
      {/* Container principal */}
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Conteúdo Centralizado (Título, Rating, Estrelas) */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold">Reviews e Comentários</h2>
          <span className="text-5xl font-bold">{rating.toFixed(2)}</span>
          <div className="flex gap-1 text-yellow-400">
            <FaStar size={24} />
            <FaStar size={24} />
            <FaStar size={24} />
            <FaStar size={24} />
            <FaStar size={24} /> 
          </div>
          <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
        </div>

        {/* "ver mais" link */}
        <div className="flex justify-end mt-4">
          <a 
            href={seeMoreLink} 
            className="text-sm text-[#9B7BFF] hover:underline"
          >
            ver mais
          </a>
        </div>

        {/* Lista Horizontal de Reviews (Scroll) */}
        <div className="flex space-x-6 overflow-x-auto pt-6 pb-4">
          {reviews.map((review) => (
            // Wrapper para o cartão (com largura fixa 'w-lg' equivalente a 32rem)
            <div key={review.id} className="w-lg shrink-0">
              <StoreReviewCard review={review} />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}