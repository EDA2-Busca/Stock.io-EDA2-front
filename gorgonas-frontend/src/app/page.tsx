import { Navbar } from '../components/Navbar'; 
import { League_Spartan } from 'next/font/google';
const leagueSpartan = League_Spartan({ subsets: ['latin'] });

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
      
    </main>
  );
}
