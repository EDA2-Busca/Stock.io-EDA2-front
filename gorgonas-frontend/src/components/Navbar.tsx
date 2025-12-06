'use client'; 

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import NotificationBell from './NotificationBell';
import { useTheme } from './ThemeProvider'; // Certifique-se que o caminho está certo

export function Navbar() {

  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  // Hook do tema
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const baseClass = "h-9 w-9 bg-contain bg-no-repeat bg-center";

  // Botão reutilizável para não repetir código
  const ThemeToggleButton = () => (
    <button 
      onClick={toggleTheme} 
      className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white"
      title="Alternar Tema"
    >
      {theme === 'light' ? (
        // Ícone de Lua (para ir pro escuro)
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      ) : (
        // Ícone de Sol (para ir pro claro)
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
      )}
    </button>
  );

  return (
    // MUDANÇA 1: Troquei bg-black por bg-header-bg para obedecer o tema
    <nav className="w-full h-23 bg-header-bg flex items-center justify-between px-8 py-4 border-b border-white/10 transition-colors duration-300">
      
      <Link href="/">
        <div className="flex items-center">
          <img src="/LOGOStock.io.png" alt="Logo" className="h-9 object-contain" />
        </div>
      </Link>

      {(!isMounted) ? (
        <div className="h-9 w-40" /> 
      ) : user ? (
        
        // --- ÁREA LOGADA ---
        <div className="flex items-center space-x-6">
          
          {/* MUDANÇA 2: Adicionei o botão aqui, antes do sino */}
          <ThemeToggleButton />
          
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
          <Link href="/perfil">
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
        // --- ÁREA DESLOGADA ---
        <div className="flex items-center space-x-15 px-8">
          <div className="flex items-center space-x-6">
            
            {/* MUDANÇA 3: Adicionei o botão aqui também */}
            <ThemeToggleButton />

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
            {/* Adicionei text-header-text para garantir visibilidade */}
            <Link href="/login" className="text-header-text font-medium hover:text-primary">
              LOGIN
            </Link>
            <Link href="/cadastro" className="bg-primary text-white font-bold py-2 px-6 rounded-[15px] hover:bg-white hover:text-primary">
              CADASTRE-SE
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
