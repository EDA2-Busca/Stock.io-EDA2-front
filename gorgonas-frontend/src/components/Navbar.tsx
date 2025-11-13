'use client'; 

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

export function Navbar() {

  const { user, logout, isLoading: isAuthLoading } = useAuth();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className=" w-full h-23 bg-black flex items-center justify-between px-8">

  {/* --- Logo --- */}
      <Link href="/">
        <div className="flex items-center">
          <img
            src="/LOGOStock.io.png"
            alt="Logo Stock.io"
            className="h-9 object-contain"
          />
        </div>
      </Link>

        {(!isMounted || isAuthLoading) ? (
        
        // MOSTRA UM PLACEHOLDER VAZIO
        <div className="h-9 w-40" /> 

      ) : user ? (
          /* CASO 1: LOGADO */
          <>
            <div className="flex items-center space-x-6">
              <Link href="/produtos">
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/sacola.png')] 
                         hover:bg-[url('/sacola-hover.png')]
                         transition-all duration-200"
                  role="img"
                  aria-label="Sacola de compras"
                />
              </Link>
              <Link href="/loja">
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/lojinha.png')] 
                         hover:bg-[url('/lojinha-hover.png')]
                         transition-all duration-200"
                  role="img"
                  aria-label="Loja"
                />
              </Link>
              <Link href="/perfil">
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                             bg-[url('/avatar-placeholder.png')] 
                             hover:bg-[url('/avatar-hover.png')]
                             transition-all duration-200"
                  role="img"
                  aria-label="Perfil"
                />
              </Link>
              <button onClick={logout}>
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                             bg-[url('/logout.png')] 
                             hover:bg-[url('/logout-hover.png')]
                             transition-all duration-200"

                  role="img"
                  aria-label="Sair"
                />
              </button>
            </div>
          </>

        ) : (

          /* CASO 2: DESLOGADO */
          <>
          <div className="flex items-center space-x-20 px-8">            
            <div className="flex items-center space-x-6">
              <Link href="/carrinho">
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/sacola.png')] 
                         hover:bg-[url('/sacola-hover.png')]
                         transition-all duration-200"
                  role="img"
                  aria-label="Sacola de compras"
                />
              </Link>
              <Link href="/loja">
                <div
                  className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/lojinha.png')] 
                         hover:bg-[url('/lojinha-hover.png')]
                         transition-all duration-200"
                  role="img"
                  aria-label="Loja"
                />
              </Link>
            </div>
            <Link
              href="/login"
              className="text-white font-medium hover:text-[#6A38F3]"
            >
              LOGIN
            </Link>
            <Link
              href="/cadastro"
              className="bg-[#6A38F3] text-white font-bold py-2 px-6 rounded-[15px] hover:bg-[#FFFF] hover:text-[#6A38F3]"
            >
              CADASTRE-SE
            </Link>
            </div>
          </>
          
        )}
    </nav>
  );
}