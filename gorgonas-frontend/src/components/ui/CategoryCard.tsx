'use client';
import React from 'react';

type CategoryCardProps = {
  icon: React.ReactNode; 
  label: string;
  href: string; 
};

export default function CategoryCard({ icon, label, href }: CategoryCardProps) {
  return (
    <a
      href={href}
      className="flex flex-col items-center justify-center w-28 h-28 bg-white rounded-3xl shadow-md hover:shadow-lg transition-shadow cursor-pointer shrink-0"
    >
      <div className="text-4xl text-[#6A38F3]"> 
        {icon}
      </div>
      <span className="mt-2 text-sm font-medium text-[#6A38F3]">
        {label}
      </span>
    </a>
  );
}