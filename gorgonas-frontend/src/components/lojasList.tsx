import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { StoreCard, StoreCardProps } from "./ui/cardLojaRetangular";

export interface StoreHeaderProps {
  title?: string;
  lojas: any[];
  onAddStore?: () => void;
}

export function StoreHeader({ title = "Lojas", lojas, onAddStore }: StoreHeaderProps) {
  return (
    <section className="flex flex-col gap-4"> {/* 1. Container principal em coluna */}
      
      {/* 2. Header: Título e Botão (Alinhados horizontalmente) */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-merriweather text-black">
          {title}
        </h2>

        <button
          onClick={onAddStore}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6A38F3] text-white shadow-md transition-colors hover:bg-[#5829d6] active:scale-95"
          title="Adicionar nova loja"
        >
          <FiPlus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* 3. Lista: Abaixo do Header */}
      <div className="overflow-x-auto pb-4">
          <div className="flex flex-nowrap gap-6">
              {lojas.length > 0 ? (
                  lojas.map(loja => (
                      // Ajustei w-64 para w-auto ou w-[400px] pois seu card retangular é largo
                      <div key={loja.id} className="shrink-0 w-[90vw] md:w-[400px]">
                          <StoreCard
                              id={loja.id}
                              nome={loja.nome}
                              categoria={{ nome: loja.categoria?.nome || "categoria" }}
                              imagemUrl={loja.imagemUrl || '/Stock.io.png'}
                          />
                      </div>
                  ))
              ) : (
                  <p className="text-gray-500 text-lg font-lato">
                      Nenhuma loja encontrada.
                  </p>
              )}
          </div>
      </div>

    </section>
  );
}