// app/components/ProductCard.tsx

import Image from 'next/image'; // Usando o componente Image do Next.js para otimização

// 1. Definimos as 'props' que o card vai aceitar
interface ProductCardProps {
  name: string;
  price: string; // Ex: "4,70"
  unit?: string; // O '?' torna opcional. Ex: "kg"
  imageUrl: string; // Caminho da imagem principal
  badgeUrl?: string; // O '?' torna opcional. Caminho do logo (ex: CJR)
  isAvailable: boolean;
}

// 2. Criamos o componente
export function ProductCard({
  name,
  price,
  unit,
  imageUrl,
  badgeUrl,
  isAvailable,
}: ProductCardProps) {
  return (
    // --- Container Principal do Card ---
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
      
      {/* --- 1. Área da Imagem (com o logo por cima) --- */}
      {/* 'relative' permite que o logo ('absolute') seja posicionado por cima */}
      <div className="relative w-full h-40 flex items-center justify-center mb-4">
        <Image
          src={imageUrl}
          alt={name}
          width={150} // Ajuste a largura
          height={150} // Ajuste a altura
          className="object-contain max-h-full"
        />

        {/* Logo da Marca (Badge) - Só aparece se 'badgeUrl' for fornecido */}
        {badgeUrl && (
          <Image
            src={badgeUrl}
            alt="Logo da marca"
            width={48} // 12 * 4 = 48px
            height={48} // 12 * 4 = 48px
            className="absolute top-0 right-0 h-12 w-12 rounded-full"
          />
        )}
      </div>

      {/* --- 2. Área de Texto --- */}
      <div className="flex flex-col">
        {/* Nome do Produto */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {name}
        </h3>

        {/* Preço e Unidade */}
        <div className="flex items-end gap-1 mb-3">
          <span className="text-xl font-bold text-gray-900">R${price}</span>
          {/* Unidade - Só aparece se 'unit' for fornecida */}
          {unit && (
            <span className="text-sm text-[#6A38F3] pb-0.5">/{unit}</span>
          )}
        </div>

        {/* Disponibilidade (com lógica condicional) */}
        {isAvailable ? (
          <span className="text-xs font-bold text-green-600 uppercase">
            Disponível
          </span>
        ) : (
          <span className="text-xs font-bold text-red-600 uppercase">
            Indisponível
          </span>
        )}
      </div>
    </div>
  );
}