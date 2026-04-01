'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../utilis/api';
import { useRouter } from 'next/navigation'; // <-- Importação correta e única do router

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
  const [isLoading, setIsLoading] = useState(true);

  // O HOOK TEM QUE FICAR AQUI, NO TOPO DO COMPONENTE!
  const router = useRouter(); 

  // 5. Lógica de Hidratação do Usuário
  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const decoded: { sub?: string } = jwtDecode(token);

          if (decoded.sub) {
            const { data: userData } = await api.get(`/usuario/${decoded.sub}`);
            setUser(userData); 
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Sessão inválida ou expirada:', error);
          localStorage.removeItem('token'); 
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []); 

  // 6. Define as funções que o contexto vai "exportar"
  const setLoggedInUser = (userData: User) => {
    setUser(userData);
  };

  // Apenas UMA função logout, usando a variável 'router' lá de cima
  const logout = () => {
    setUser(null); 
    localStorage.removeItem('token'); 
    delete api.defaults.headers.common['Authorization'];
    
    // Redireciona usando a instância criada no topo do componente
    router.push('/'); 
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};