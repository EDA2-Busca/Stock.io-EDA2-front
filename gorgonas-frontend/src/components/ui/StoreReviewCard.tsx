'use client';
import React from 'react';
// import { FaStar } from 'react-icons/fa'; 

// Props do card de review
type ReviewCardProps = {
  review: {
    id?: string | number;
    lojaId?: string | number;
    author: string;
    text: string;
    avatarUrl: string; 
    rating: number;     
  };
};

// Card de review individual
export default function StoreReviewCard({ review }: ReviewCardProps) {
  
  // Renderização de estrelas com suporte a meia-estrela
  const renderDecimalStars = (value: number) => {
    const outline = "#D1D5DB";
    const fill = "#F5C518";
    return (
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const diff = value - idx;
          const full = diff >= 1;
          const half = !full && diff >= 0.5;
          const width = full ? "100%" : half ? "50%" : "0%";
          return (
            <span key={idx} className="relative w-5 h-5 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={outline} className="w-5 h-5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span className="absolute inset-0 overflow-hidden" style={{ width }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={fill} className="w-5 h-5">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </span>
            </span>
          );
        })}
      </div>
    );
  };

  return (
    // Card principal
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex gap-4">
      
      {/* Avatar */}
      <img 
        src={review.avatarUrl} 
  // ...
  onError={(e) => { 
    const target = e.target as HTMLImageElement;
    const fallback = '/avatar-placeholder.png';
    if (target.src.includes(fallback)) {
       return; 
    }
    
    target.src = fallback;
  }} 
      />
      
      {/* Conteúdo */}
      <div className="flex flex-col w-full">
        {/* Cabeçalho (nome + estrelas) */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{review.author}</h3>
          {renderDecimalStars(review.rating)}
        </div>
        
        {/* Texto */}
        <p className="text-gray-700 leading-relaxed">
          {review.text}
        </p>

        {/* Link ver mais */}
        {review.id && review.lojaId && (
          <a
            href={`/loja/${review.lojaId}/reviews/${review.id}`}
            className="text-sm text-[#6A38F3] hover:underline mt-2 self-end"
          >
            ver mais
          </a>
        )}
      </div>
    </div>
  );
}