'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import StoreReviewCard from './ui/StoreReviewCard'; // Ajuste o caminho se necessário

// Interface para os dados da review (igual ao que seu Card espera)
export interface ReviewData {
  author: string;
  text: string;
  avatarUrl: string;
  rating: number;
}

interface ReviewSectionProps {
  reviews: ReviewData[];
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Se não houver reviews, não renderiza nada ou renderiza mensagem
  if (!reviews || reviews.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="flex flex-col gap-6 py-8">
      {/* Título */}
      <h2 className="text-3xl font-bold font-merriweather text-black">
        Avaliações
      </h2>

      {/* Área do Card */}
      <div className="w-full">
        {/* Passamos a review atual para o seu componente existente */}
        <StoreReviewCard review={currentReview} />
      </div>

      {/* Controles e Ver Mais */}
      <div className="flex items-center justify-between mt-2 px-2">
        
        {/* Espaço vazio para equilibrar o flex (opcional, ou pode usar justify-center para as setas) */}
        <div className="w-20 hidden md:block"></div>

        {/* Botões de Navegação (Pílula Preta) */}
        <div className="bg-[#222222] rounded-full p-1.5 flex items-center gap-2 shadow-lg">
          <button 
            onClick={handlePrev}
            className="p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <FiChevronLeft size={20} />
          </button>
          
          <div className="h-4 w-[1px] bg-white/20"></div> {/* Divisória sutil */}

          <button 
            onClick={handleNext}
            className="p-1 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Link Ver Mais (Alinhado à direita) */}
        <a href="/avaliacoes" className="text-lg text-[#6A38F3] hover:underline font-lato w-20 text-right">
          ver mais
        </a>
      </div>
    </section>
  );
}