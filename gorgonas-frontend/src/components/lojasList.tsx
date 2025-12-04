import { FiPlus } from "react-icons/fi";
import Link from "next/link";
import { StoreCard, StoreCardProps } from "./ui/cardLojaRetangular";

export interface StoreHeaderProps {
  isUsuario: boolean;
  title?: string;
  lojas: any[];
  onAddStore?: () => void;
}


export function StoreHeader({ isUsuario, title = "Lojas", lojas, onAddStore }: StoreHeaderProps) {

  if (isUsuario === true) {
  
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
      <div className="pb-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lojas.length > 0 ? (
                  lojas.map(loja => (

                      <div key={loja.id} className="w-full">
                          <StoreCard
                              id={loja.id}
                              nome={loja.nome}
                              categoria={{ nome: loja.categoria?.nome || "categoria" }}
                              imagemUrl={loja.imagemUrl || '/Stock.io.png'}
                          />
                      </div>
                  ))
              ) : (

                  <div className="col-span-full">
                      <p className="text-gray-500 text-lg font-lato">
                          Nenhuma loja encontrada.
                      </p>
                  </div>
              )}
          </div>
      </div>

    </section>
  );
} else {
      return (
    <section className="flex flex-col gap-4"> {/* 1. Container principal em coluna */}
      
      {/* 2. Header: Título e Botão (Alinhados horizontalmente) */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold font-merriweather text-black">
          {title}
        </h2>
      </div>

      {/* 3. Lista: Abaixo do Header */}
      <div className="pb-4">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lojas.length > 0 ? (
                  lojas.map(loja => (

                      <div key={loja.id} className="w-full">
                          <StoreCard
                              id={loja.id}
                              nome={loja.nome}
                              categoria={{ nome: loja.categoria?.nome || "categoria" }}
                              imagemUrl={loja.imagemUrl || '/Stock.io.png'}
                          />
                      </div>
                  ))
              ) : (

                  <div className="col-span-full">
                      <p className="text-gray-500 text-lg font-lato">
                          Nenhuma loja encontrada.
                      </p>
                  </div>
              )}
          </div>
      </div>

    </section>
  );}
}