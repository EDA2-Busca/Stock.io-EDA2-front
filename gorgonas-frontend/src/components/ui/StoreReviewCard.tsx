'use client';
import React from 'react';
import { FaStar } from 'react-icons/fa'; 

// Define os props que o review card espera
type ReviewCardProps = {
  review: {
    author: string;
    text: string;
    avatarUrl: string; 
    rating: number;     
  };
};

// Componente para um card de review individual
export default function StoreReviewCard({ review }: ReviewCardProps) {
  
  // Função para renderizar as estrelas de rating
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
    // Card principal com fundo branco
    <div className="w-full bg-white rounded-2xl shadow-md p-6 flex gap-4">
      
      {/* Avatar */}
      <img 
        src={review.avatarUrl} 
        alt={`Avatar de ${review.author}`}
        className="w-16 h-16 rounded-full object-cover shrink-0"
        // Fallback para uma imagem que existe
        onError={(e) => { (e.target as HTMLImageElement).src = '/avatar-placeholder.png'; }} 
      />
      
      {/* Conteúdo do Review */}
      <div className="flex flex-col w-full">
        {/* Cabeçalho (Nome e Estrelas) */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{review.author}</h3>
          <div className="flex gap-1">
            {renderStars()}
          </div>
        </div>
        
        {/* Texto do Review */}
        <p className="text-gray-700 leading-relaxed">
          {review.text}
        </p>

        {/* "ver mais" link */}
        <a href="#" className="text-sm text-[#6A38F3] hover:underline mt-2 self-end">
          ver mais
        </a>
      </div>
    </div>
  );
}