import Link from "next/link";
import Image from "next/image";

export interface StoreCardProps {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}
const API_URL = "http://localhost:3001";

export function StoreCard({ id, name, category, imageUrl }: StoreCardProps) {
  const imageSrc = imageUrl? `${API_URL}/${imageUrl}`: "/placeholder-loja.png";
  return (
    <Link href={`/loja/${id}`}>
      <div className="group flex w-[161px] flex-col items-center text-center cursor-pointer">

        {/* Círculo com o logo */}
        <div
          className="flex h-[135px] w-[135px] items-center justify-center
          rounded-full bg-white shadow-sm ring-1 ring-black/5
          transition-all duration-200 group-hover:scale-[1.04] group-hover:shadow-md"
        >
          <Image
            src={imageSrc}
            alt={name}
            width={115}
            height={115}
            className="object-contain"
          />
        </div>

        {/* Nome + categoria */}
        <div className="mt-3 flex h-[53px] w-full flex-col items-center justify-center">
          <p className="w-full truncate text-[15px] font-semibold leading-tight text-black">
            {name}
          </p>

          <p className="mt-0.5 text-[13px] font-medium lowercase text-primary">
            {category}
          </p>
        </div>
      </div>
    </Link>
  );
}