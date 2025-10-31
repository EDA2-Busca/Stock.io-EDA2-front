import { Navbar } from '../components/Navbar'; 
import { ProductCard } from '../components/ProductCard';

export default function HomePage() {
  return (
    <main className="bg-[#FDF9F2] min-h-screen"> {/* Usando classe personalizada */}
      <Navbar />

      {/* --- Seção Hero (Retângulo Preto) --- */}
      <section className="w-full bg-black h-[45vh] flex items-center relative overflow-hidden">
        
        {/* Removi justify-between para permitir que o texto se aproxime mais da imagem */}
        <div className="w-full max-w-7xl mx-auto px-8 flex items-center h-full">
          
          {/* 1. Conteúdo de Texto */}
          {/* max-w-md (reduzido de max-w-lg) para aproximar da imagem. 
              text-7xl (aumentado de text-6xl) para reduzir as quebras de linha.
          */}
          <div className="text-white max-w-3xl">
            <h1 className="text-7xl font-bold leading-tight">
              Do CAOS à organização, em alguns cliques
            </h1>
          </div>
          
          {/* 2. Ilustração */}
          {/* Mantive as classes da imagem como você as forneceu */}
          <div className="absolute bottom-0 right-8 w-235 h-150 -mb-50">
            <img
              src="/Group 30.png" // Use o caminho correto para sua imagem
              alt="Ilustração de uma pessoa organizando caixas"
              className="w-full h-full object-contain" // Tailwind CSS para preencher o div
            />
          </div>
        </div>
      </section>


      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-8">
          {/* A grade ainda está aqui, mas com um item só */}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <a href="/produto">
            <ProductCard 
              name="Brownie Meio A."
              price="4,70"
              isAvailable={true}
              imageUrl="/brownie.png" // Use um caminho de imagem válido ou placeholder
              badgeUrl="/logo-cjr.png"       // Use um caminho de imagem válido ou placeholder
              // unit não foi passado, então não vai aparecer
            />
            </a>
            <a href="/produto">
            {/* Você pode adicionar um segundo card aqui para ver o espaçamento */}
            <ProductCard 
              name="Nozes (Indisponível)"
              price="29,99"
              unit="kg"
              isAvailable={false} // Testando o indisponível
              imageUrl="/nozes.png" // Use um caminho de imagem válido ou placeholder
              badgeUrl="/logo-cjr.png"
            />
            </a>
          </div>
          
        </div>
        
      </section>
      
    </main>
  );
}
