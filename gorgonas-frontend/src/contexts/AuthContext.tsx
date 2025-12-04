'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utilis/api';
import { useRouter } from 'next/navigation';

// 1. Define a interface do Usuário
interface User {
  id: number;
  nome: string;
  email: string;
  userName: string;
  fotoPerfil?: string | null;
}

// 2. Define a interface do Contexto
interface AuthContextType {
  user: User | null;
  setLoggedInUser: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

// 3. Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Cria o Provedor do Contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa 'carregando'

  // 5. Lógica de Hidratação do Usuário
  useEffect(() => {
    const checkUserSession = async () => {
      // Pega o token do localStorage (o mesmo nome que o LoginPage usa)
      const token = localStorage.getItem('token'); 

      if (token) {
        try {
          // Decodifica o token para pegar o ID (sub)
          const decoded: { sub?: string } = jwtDecode(token);

          if (decoded.sub) {
            // Token é válido, agora busca os dados reais do usuário na API
            // (Isso SÓ funciona se o 'api.ts' já estiver com o Interceptor)
            const { data: userData } = await api.get(`/usuario/${decoded.sub}`);
            setUser(userData); // Usuário está logado!
          } else {
            // Token mal formado
            localStorage.removeItem('token');
          }
        } catch (error) {
          // Erro (ex: token expirado, usuário deletado)
          console.error('Sessão inválida ou expirada:', error);
          localStorage.removeItem('token'); // Limpa o token ruim
        }
      }
      // Terminamos de verificar, não estamos mais carregando
      setIsLoading(false);
    };

    checkUserSession();
  }, []); // O '[]' vazio garante que isso rode só uma vez.

  // 6. Define as funções que o contexto vai "exportar"

  // A função que o seu LoginPage chama
  const setLoggedInUser = (userData: User) => {
    setUser(userData);
  };

  // A função que seu botão "Sair" na Navbar vai chamar futuramente
  const logout = () => {
    setUser(null); // Limpa o usuário do estado
    localStorage.removeItem('token'); // Limpa o token do "bolso"
    delete api.defaults.headers.common['Authorization'];
    useRouter().push('/login'); // Redireciona para a página de login
  };

  // 7. Junta tudo que vamos fornecer para a aplicação
  const value = {
    user,
    setLoggedInUser,
    logout,
    isLoading,
  };

  // 8. Retorna o Provedor com os 'filhos' (children) dentro dele
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 9. Cria o Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};