import Image from 'next/image';
import Link from 'next/link'
import { useState, useEffect } from 'react';

export function ProductCard(props: any) {
  console.log("PROPS RECEBIDAS:", props);
  let produto = props.produto;
  if (!produto && props.name) {
    produto = {
      id: props.id,
      nome: props.name,
      preco: props.price,
      estoque: props.isAvailable ? 1 : 0,
      imagens: [{ urlImagem: props.imageUrl || '/avatar-placeholder.png' }],
      loja: { logo: props.badgeUrl || null },
      unidade: props.unit
    };
  }
  const imageCover = produto.imagens && produto.imagens.length > 0
    ? produto.imagens[0].urlImagem
    : '/avatar-placeholder.png';

  const [src, setSrc] = useState(imageCover);
  const fallback = '/avatar-placeholder.png';

  useEffect(() => {
    setSrc(imageCover);
  }, [imageCover]);

  let precoFormatado = "0,00";
  const valorPreco = produto.preco;

  if (valorPreco !== undefined && valorPreco !== null) {
      if (typeof valorPreco === 'number') {
          precoFormatado = valorPreco.toFixed(2).replace('.', ',');
      } else if (typeof valorPreco === 'string') {
          if (valorPreco.includes(',')) {
              precoFormatado = valorPreco;
          } else {
              precoFormatado = Number(valorPreco).toFixed(2).replace('.', ',');
          }
      }
  }
  const isAvailable = produto.estoque > 0;

  return (
    <Link href={`/produto/${produto.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col transition-all duration-300 hover:shadow-md">
        <div className="relative w-full h-40 flex items-center justify-center mb-4">
          <Image
            src={src}
            alt={produto.nome}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setSrc(fallback)}
          />
          {produto.loja?.logo && (
            <div className="absolute top-2 right-2 h-10 w-10 bg-white rounded-full shadow-md overflow-hidden p-1">
              <Image
                src={produto.loja.logo}
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
            <span className="text-xl font-bold text-gray-900">R${precoFormatado}</span>
            {produto.unidade && (
              <span className="text-sm text-[#6A38F3] pb-0.5">/{produto.unidade}</span>
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