import Image from 'next/image'; 
import Link from 'next/link'
interface ProductCardProps {
  id: number;
  name: string;
  price: string; 
  unit?: string; 
  imageUrl: string; 
  badgeUrl?: string; 
  isAvailable: boolean;
}

export function ProductCard({
  id,
  name,
  price,
  unit,
  imageUrl,
  badgeUrl,
  isAvailable,
}: ProductCardProps) {
  return (
    <Link href={`/produto/${id}`}>
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="relative w-full h-40 flex items-center justify-center mb-4">
        <Image
          src={imageUrl}
          alt={name}
          width={150}
          height={150}
          className="object-contain max-h-full"
        />
        {badgeUrl && (
          <Image
            src={badgeUrl}
            alt="Logo da marca"
            width={48} 
            height={48} 
            className="absolute top-0 right-0 h-12 w-12 rounded-full"
          />
        )}
      </div>
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {name}
        </h3>

        <div className="flex items-end gap-1 mb-3">
          <span className="text-xl font-bold text-gray-900">R${price}</span>
          {unit && (
            <span className="text-sm text-[#6A38F3] pb-0.5">/{unit}</span>
          )}
        </div>
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
    </Link>
  );
}