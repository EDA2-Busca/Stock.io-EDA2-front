'use client';
import React from 'react';
// import { FaStar } from 'react-icons/fa';
import StoreReviewCard from '@/components/ui/StoreReviewCard'; 

// Tipos de dados locais
type Review = {
  id: string;
  lojaId?: string | number;
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

// Secção preta de reviews resumidos
export default function StoreReviewSection({ rating, reviewCount, reviews, seeMoreLink }: Props) {
  return (
    <section className="w-full bg-black text-white py-8">
      {/* Container principal */}
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Cabeçalho com título, média e estrelas */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-bold">Reviews e Comentários</h2>
          <span className="text-5xl font-bold">{rating.toFixed(2)}</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, idx) => {
              const diff = rating - idx;
              const full = diff >= 1;
              const half = !full && diff >= 0.5;
              const width = full ? "100%" : half ? "50%" : "0%";
              return (
                <span key={idx} className="relative w-6 h-6 inline-block">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#D1D5DB" className="w-6 h-6">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                  <span className="absolute inset-0 overflow-hidden" style={{ width }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#F5C518" className="w-6 h-6">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  </span>
                </span>
              );
            })}
          </div>
          <span className="text-gray-400 text-sm">({reviewCount} reviews)</span>
        </div>

        {/* Link para página completa */}
        <div className="flex justify-end mt-4">
          <a 
            href={seeMoreLink} 
            className="text-sm text-[#9B7BFF] hover:underline"
          >
            ver mais
          </a>
        </div>

        {/* Lista horizontal de reviews */}
        <div className="flex space-x-6 overflow-x-auto pt-6 pb-4">
          {reviews.map((review) => (
            <div key={review.id} className="w-lg shrink-0">
              {/* Cartão com largura fixa */}
              <StoreReviewCard review={review} />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}