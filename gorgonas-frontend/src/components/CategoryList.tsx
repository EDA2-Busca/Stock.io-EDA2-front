'use client';
import React from 'react';
import CategoryCard from './ui/CategoryCard';

// Importando ícones do 'react-icons'
import { 
  BsCart, 
  BsCapsule, 
  BsBrush, 
  BsLaptop 
} from 'react-icons/bs';
import { 
  IoShirtOutline, 
  IoGameControllerOutline, 
  IoHomeOutline 
} from 'react-icons/io5';
import { FaPuzzlePiece } from 'react-icons/fa'; 

// Dados das categorias
const categories = [
  { label: 'Mercado', icon: <BsCart />, href: '/categoria/mercado' },
  { label: 'Farmácia', icon: <BsCapsule />, href: '/categoria/farmacia' },
  { label: 'Beleza', icon: <BsBrush />, href: '/categoria/beleza' },
  { label: 'Moda', icon: <IoShirtOutline />, href: '/categoria/moda' },
  { label: 'Eletrônicos', icon: <BsLaptop />, href: '/categoria/eletronicos' },
  { label: 'Jogos', icon: <IoGameControllerOutline />, href: '/categoria/jogos' },
  { label: 'Brinquedos', icon: <FaPuzzlePiece />, href: '/categoria/brinquedos' },
  { label: 'Casa', icon: <IoHomeOutline />, href: '/categoria/casa' },
];

export default function CategoryList() {
  return (
    <section className="w-full"> 
      <h2 className="text-2xl font-bold text-foreground mb-4">
        Categorias
      </h2>
      
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {categories.map((category) => (
          <CategoryCard
            key={category.label}
            label={category.label}
            icon={category.icon}
            href={category.href}
          />
        ))}
      </div>
    </section>
  );
}