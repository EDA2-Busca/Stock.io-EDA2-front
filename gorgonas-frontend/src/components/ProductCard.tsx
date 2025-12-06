import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
const API_URL = "http://localhost:3001";

export function ProductCard(props: any) {

  let produto = props.produto;
  if (!produto && props.name) {
    produto = {
      id: props.id,
      nome: props.name,
      preco: props.price,
      estoque: props.isAvailable ? 1 : 0,
      imagens: [{ urlImagem: props.imageUrl || null }],
      loja: { 
        logo: props.badgeUrl || null, 
        sticker: props.sticker || null 
      },
      unidade: props.unit
    };
  }

  const buildUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('/')) return path;
    
    return `${API_URL}/${path.replace(/\\/g, '/')}`;
  };

  const productFallback = '/avatar-placeholder.png';

  const rawProductPath = produto.imagens?.[0]?.urlImagem;
  const [productSrc, setProductSrc] = useState(buildUrl(rawProductPath) || productFallback);

  const rawStickerPath = produto.loja?.sticker || produto.loja?.logo;
  const [stickerSrc, setStickerSrc] = useState(buildUrl(rawStickerPath));

  useEffect(() => {
    setProductSrc(buildUrl(rawProductPath) || productFallback);
  }, [rawProductPath]);

  useEffect(() => {
    setStickerSrc(buildUrl(rawStickerPath));
  }, [rawStickerPath]);

  const isAvailable = (produto.estoque || 0) > 0;

  return (
    <Link href={`/produto/${produto.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
        <div className="relative w-full h-40 flex items-center justify-center mb-4">
          <Image
            src={productSrc}
            alt={produto.nome}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {typeof props.rating === 'number' && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 shadow text-xs font-medium text-gray-800">
              ⭐ {props.rating.toFixed(1)}
            </div>
          )}
          {stickerSrc && (
            <div className="absolute top-2 right-2 h-10 w-10 bg-white rounded-full shadow-md overflow-hidden p-1">
              <Image
                src={stickerSrc}
                alt="Loja"
                width={40}
                height={40}
                className="object-cover w-full h-full rounded-full"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
            {produto.nome}
          </h3>

          <div className="flex items-end gap-1 mb-3">
            <span className="text-xl font-bold text-gray-900">R${produto.preco}</span>
            {produto.unidade && (
              <span className="text-sm text-primary pb-0.5">/{produto.unidade}</span>
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