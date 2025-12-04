"use client";

import React from "react";

type ReviewCardProps = {
  author: string;
  avatarUrl?: string;
  rating: number; // 1-5
  text: string;
  onSeeMore?: () => void;
};

export default function ReviewCard({ author, avatarUrl, rating, text, onSeeMore }: ReviewCardProps) {
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <svg
      key={i}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill={i < rating ? "#F5C518" : "#D1D5DB"}
      className="w-4 h-4"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
    </svg>
  ));

  return (
    <div className="rounded-2xl bg-white shadow-sm border border-[#eee] p-4 flex items-start gap-4">
      <img
        src={avatarUrl || "/stores/cjr.png"}
        alt={author}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-[#171918]">{author}</span>
          <div className="flex items-center gap-1">{stars}</div>
        </div>
        <p className="text-sm text-[#4B4E57] leading-relaxed">{text}</p>
        {onSeeMore && (
          <button
            onClick={onSeeMore}
            className="mt-2 text-sm text-[#6A38F3] hover:underline"
          >
            ver mais
          </button>
        )}
      </div>
    </div>
  );
}
