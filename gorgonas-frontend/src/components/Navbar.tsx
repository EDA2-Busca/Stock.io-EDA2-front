'use client'; 

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NotificationBell from './NotificationBell';

export function Navbar() {

  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseClass = "h-9 w-9 bg-contain bg-no-repeat bg-center";

  return (
    <nav className="w-full h-23 bg-black flex items-center justify-between px-8 py-4">
      
      <Link href="/">
        <div className="flex items-center">
          <img src="/LOGOStock.io.png" alt="Logo" className="h-9 object-contain" />
        </div>
      </Link>

      {(!isMounted) ? (
        <div className="h-9 w-40" /> 
      ) : user ? (
        
      
        <div className="flex items-center space-x-6">
          <NotificationBell/>
          <Link href="/produtos">
            <div className={`${baseClass} ${
              pathname.startsWith('/produtos') 
                ? "bg-[url('/sacola-hover.png')]" 
                : "bg-[url('/sacola.png')] hover:bg-[url('/sacola-hover.png')]"
            }`} />
          </Link>
          <Link href="/loja">
            <div className={`${baseClass} ${
              pathname.startsWith('/loja') 
                ? "bg-[url('/lojinha-hover.png')]" 
                : "bg-[url('/lojinha.png')] hover:bg-[url('/lojinha-hover.png')]"
            }`} />
          </Link>
          <Link href={`/perfil/${user.id}`}>
            <div className={`${baseClass} ${
              pathname.startsWith('/perfil') 
                ? "bg-[url('/avatar-hover.png')]" 
                : "bg-[url('/ion_person.png')] hover:bg-[url('/avatar-hover.png')]"
            }`} />
          </Link>
          <button onClick={logout}>
            <div className={`${baseClass} bg-[url('/logout.png')] hover:bg-[url('/logout-hover.png')]`} />
          </button>
        </div>

      ) : (
        <div className="flex items-center space-x-15 px-8">
          <div className="flex items-center space-x-6">
            <Link href="/produtos">
              <div className={`${baseClass} ${
                pathname.startsWith('/produtos') 
                  ? "bg-[url('/sacola-hover.png')]" 
                  : "bg-[url('/sacola.png')] hover:bg-[url('/sacola-hover.png')]"
              }`} />
            </Link>
            
            <Link href="/loja">
              <div className={`${baseClass} ${
                pathname.startsWith('/loja') 
                  ? "bg-[url('/lojinha-hover.png')]" 
                  : "bg-[url('/lojinha.png')] hover:bg-[url('/lojinha-hover.png')]"
              }`} />
            </Link>
          </div>
          
          <div className="flex items-center gap-15">
            <Link href="/login" className="text-white font-medium hover:text-[#6A38F3]">
              LOGIN
            </Link>
            <Link href="/cadastro" className="bg-[#6A38F3] text-white font-bold py-2 px-6 rounded-[15px] hover:bg-white hover:text-[#6A38F3]">
              CADASTRE-SE
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}