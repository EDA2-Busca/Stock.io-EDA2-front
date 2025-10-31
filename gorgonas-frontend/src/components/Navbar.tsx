export function Navbar() {
  const isUserLoggedIn = true; 

  return (
    <nav className=" w-full h-23 bg-black flex items-center justify-between px-8">

      {/* --- Logo --- */}
      <a href="/"> 
        <div className="flex items-center">
          <img
            src="/LOGOStock.io.png"
            alt="Logo Stock.io"
            className="h-9 object-contain"
          />
        </div>
      </a>

      {/* --- GRUPO DA DIREITA (Ícones + Auth) --- */}
      <div className="flex items-center space-x-20 px-8">
        
        {/* --- Ícones --- */}
        <div className="flex space-x-6">
          <a href="/carrinho">
            <div
              className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/sacola.png')] 
                         hover:bg-[url('/sacola-hover.png')]
                         transition-all duration-200"
              role="img"
              aria-label="Sacola de compras"
            />
          </a>
          <a href="/loja">
            <div
              className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/lojinha.png')] 
                         hover:bg-[url('/lojinha-hover.png')]
                         transition-all duration-200"
              role="img"
              aria-label="Loja"
            />
          </a>
        

        {/* --- LÓGICA DE AUTENTICAÇÃO --- */}
        {isUserLoggedIn ? (
          <>
          <a href="/perfil">
            <div
              className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/avatar-placeholder.png')] 
                         hover:bg-[url('/avatar-hover.png')]
                         transition-all duration-200"
              role="img"
              aria-label="Loja"
            />
          </a>
          <a href="">
            <div
              className="h-9 w-9 bg-contain bg-no-repeat bg-center 
                         bg-[url('/logout.png')] 
                         hover:bg-[url('/logout-hover.png')]
                         transition-all duration-200"
              role="img"
              aria-label="Loja"
            />
          </a>
          </>
          

        ) : (

          /* CASO 2: USUÁRIO DESLOGADO (Mostra Login/Cadastro) */
          <>
            <a
              href="/login"
              className="text-white font-medium hover:text-[#6A38F3]"
            >
              LOGIN
            </a>
            <a
              href="/cadastro"
              className="bg-[#6A38F3] text-white font-bold py-2 px-6 rounded-[15px] hover:bg-[#FFFF] hover:text-[#6A38F3]"
            >
              CADASTRE-SE
            </a>
          </>
        )}
        </div>
        
      </div>
    </nav>
  );
}