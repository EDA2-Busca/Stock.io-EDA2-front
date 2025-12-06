"use client";

import React from "react";

type ReviewCardProps = {
  id?: number | string;
  lojaId?: number | string;
  author: string;
  avatarUrl?: string;
  rating: number;
  text: string;
  onSeeMore?: () => void; // legado
};


export default function ReviewCard({ id, lojaId, author, avatarUrl, rating, text, onSeeMore }: ReviewCardProps) {
  // Função para renderizar estrelas com suporte a meia-estrela
  const renderDecimalStars = (value: number) => {
    const outline = "#D1D5DB";
    const fill = "#F5C518";
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => {
          const diff = value - idx;
          const full = diff >= 1;
          const half = !full && diff >= 0.5;
          const width = full ? "100%" : half ? "50%" : "0%";
          return (
            <div key={idx} className="relative w-4 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={outline} className="w-4 h-4">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <div className="absolute inset-0 overflow-hidden" style={{ width }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={fill} className="w-4 h-4">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-[#eee] p-4 flex items-start gap-4">
      <img
        src={avatarUrl || "/Stock.io.png"}
        alt={author}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-[#171918]">{author}</span>
          {renderDecimalStars(rating)}
        </div>
        <p className="text-sm text-[#4B4E57] leading-relaxed">{text}</p>
        {(id && lojaId) ? (
          <a
            href={`/loja/${lojaId}/reviews/${id}`}
            className="mt-2 inline-block text-sm text-[#6A38F3] hover:underline"
          >
            ver mais
          </a>
        ) : (
          onSeeMore && (
            <button
              onClick={onSeeMore}
              className="mt-2 text-sm text-[#6A38F3] hover:underline"
            >
              ver mais
            </button>
          )
        )}
      </div>
    </div>
  );
}