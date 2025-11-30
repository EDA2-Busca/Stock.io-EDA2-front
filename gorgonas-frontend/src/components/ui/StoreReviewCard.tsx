'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa'; 

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
  
  // Renderização de estrelas
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= review.rating ? 'text-yellow-400' : 'text-gray-300'} 
        />
      );
    }
    return stars;
  };

  return (
    // Card principal
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex gap-4">
      
      {/* Avatar */}
      <img 
        src={review.avatarUrl} 
        alt={`Avatar de ${review.author}`}
        className="w-16 h-16 rounded-full object-cover shrink-0"
        // Fallback de imagem
        onError={(e) => { (e.target as HTMLImageElement).src = '/avatar-placeholder.png'; }} 
      />
      
      {/* Conteúdo */}
      <div className="flex flex-col w-full">
        {/* Cabeçalho (nome + estrelas) */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{review.author}</h3>
          <div className="flex gap-1">
            {renderStars()}
          </div>
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