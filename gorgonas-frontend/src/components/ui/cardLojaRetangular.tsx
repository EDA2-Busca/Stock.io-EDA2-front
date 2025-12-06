import Link from "next/link";
import Image from "next/image";

export interface StoreCardProps {
  id: number;
  nome: string;
  categoria: {
    nome: string;
  };
  imagemUrl: string;
}

export function StoreCard({ id, nome, categoria, imagemUrl }: StoreCardProps) {
  return (
    <Link href={`/loja/${id}`} className="block w-full max-w-[400px]">
      <div 
        className="group flex items-center justify-between 
        w-full bg-white p-6 rounded-[32px] 
        transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      >
        
        {/* Lado Esquerdo: Textos */}
        <div className="flex flex-col gap-1">
          <h3 className="font-merriweather text-3xl text-black font-normal">
            {nome}
          </h3>
          <p className="font-lato text-xl font-medium text-primary lowercase">
            {categoria.nome}
          </p>
        </div>

        {/* Lado Direito: Logo Circular */}
        <div className="shrink-0 relative h-24 w-24 rounded-full bg-[#FFF5F0] overflow-hidden flex items-center justify-center">
          <Image
            src={imagemUrl}
            alt={nome}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

      </div>
    </Link>
  );
}