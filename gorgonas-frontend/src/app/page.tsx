import { Navbar } from '@/components/Navbar';
import { ProductCard } from '@/components/ProductCard';

import SearchBar from '@/components/ui/SearchBar';
import CategoryList from '@/components/CategoryList';

export default function HomePage() {
  return (
    <main className="bg-[#FDF9F2] min-h-screen">
      {/* --- Seção Hero e Navbar (Agrupadas) --- */}
      <header className="w-full bg-black relative overflow-hidden -mt-px pt-px">
        <div aria-hidden className="absolute inset-x-0 -top-px h-px bg-black" />
        <Navbar />

        {/* --- Seção Hero (Conteúdo) --- */}
        <section className="w-full h-[45vh] flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 flex items-center h-full">
            <div className="text-white max-w-3xl">
              <h1 className="text-7xl font-bold leading-tight">
                Do CAOS à organização, em alguns cliques
              </h1>
            </div>
            <div className="absolute bottom-0 right-8 w-235 h-150 -mb-50">
              <img
                src="/Group 30.png"
                alt="Ilustração de uma pessoa organizando caixas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </section>
      </header>

      {/* --- Container Principal (para todo o conteúdo abaixo do Hero) --- */}
      <div className="max-w-7xl mx-auto px-8">
        {/* --- Seção de Pesquisa (NOVA) --- */}
        <section className="py-6">
          <SearchBar className="max-w-md ml-auto" />
        </section>

        {/* --- Seção de Categorias (NOVA) --- */}
        <section className="pb-6">
          <CategoryList />
        </section>

        {/* --- Seção de Produtos (Existente) --- */}
        <section className="pb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[#171918]">Produtos</h2>
            <a href="/produtos" className="text-sm text-[#6A38F3] hover:underline">
              ver mais
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <a href="/produto" className="block">
              <ProductCard
                name="Brownie Meio A."
                price="4,70"
                isAvailable={true}
                imageUrl="/brownie.png"
                badgeUrl="/logo-cjr.png"
              />
            </a>
            <a href="/produto" className="block">
              <ProductCard
                name="Nozes (Indisponível)"
                price="29,99"
                unit="kg"
                isAvailable={false}
                imageUrl="/nozes.png"
                badgeUrl="/logo-cjr.png"
              />
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}