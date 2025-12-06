'use client'; 

import { useRouter } from 'next/navigation'; 
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify'; 

import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';

import api from '../../../utilis/api';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function LoginPage() {
  const router = useRouter();

  // --- Estados do Componente ---
  const [email, setEmail] = useState(''); 
  const [senha, setSenha] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, setLoggedInUser, isLoading: isAuthLoading } = useAuth();

  // --- Função de Validação ---
  const validarEmail = (email: string) => {
    const regexFormato = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexFormato.test(email.trim());
  };

  // --- Lógica de Redirecionamento se já estiver logado ---
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // --- Lógica de Submissão ---
  const handleLogin = async () => {
      setIsLoading(true);

      try {
        // chama a api de login
        const response = await api.post('/auth/login', { email, senha });
        
        // pega o token da resposta
        const token = response.data.access_token;
        if (!token) {
          throw new Error('Token de acesso não recebido.');
        }

        // salva o token no localStorage
        localStorage.setItem('token', token);

        // decodifica o token para pegar o ID do usuário
        const decoded: { sub?: string } = jwtDecode(token);
        const userId = decoded.sub; // 'sub' é o ID do usuário

        if (!userId) {
          throw new Error('Token inválido (não contém ID).');
        }

        // busca os dados completos do usuário na API
        const userResponse = await api.get(`/usuario/${userId}`);
        const userData = userResponse.data;

        // atualiza o contexto de autenticação
        setLoggedInUser(userData);
        
        // aviso de sucesso
        toast.success('Login realizado com sucesso!');

      } catch (error) {
        // trata erros
        console.error('Erro ao fazer login:', error);
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data.message || 'Email ou senha inválidos.');
        } else {
          toast.error('Erro de conexão. O servidor parece estar fora do ar.');
        }
      } finally {
        setIsLoading(false);
      }
    };

  // --- Função de Validação e Submissão ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação: Campos vazios
    if (!email || !senha) {
      toast.error('Por favor, preencha o email e a senha.', { toastId: 'err-login-campos' });
      return;
    }
    
    // Validação: Formato do Email
    if (!validarEmail(email)) {
      toast.error('Por favor, insira um email válido.', { toastId: 'err-login-email' });
      return;
    }

    // Chama a lógica de login se validações passarem
    await handleLogin();
  };
  
  // --- Renderização do Componente (JSX) ---
  return (
    <div className="min-h-screen flex items-stretch bg-[#F6F3E4]"> 
      
      {/* Container principal (layout responsivo com imagem à esquerda no desktop) */}
      <div className="w-full max-w-[1300px] mx-auto flex flex-col md:flex-row-reverse items-stretch py-12 px-6 md:px-8">
        
        {/* Lado Direito: Formulário de Login */}
        <div className="md:w-1/2 w-full flex items-stretch justify-center">
          <div
            className="w-full max-w-lg bg-foreground text-white p-8 md:p-12 shadow-xl flex flex-col justify-center h-full overflow-hidden rounded-[18px] md:rounded-[36px]"
            style={{ boxSizing: 'border-box' }}
          >
            <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white mb-10 mt-8">
              BEM VINDO DE VOLTA! 
            </h1>

            {/* Formulário */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              
              {/* Campo Email */}
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" 
                type="email"
              />
              
              {/* Campo Senha */}
              <PasswordInput
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha" 
              />

              {/* Link "Esqueceu sua senha?" */}
              <div className="text-right text-sm">
                <a href="/recuperar-senha" className="text-[#9B7BFF] hover:underline">
                  Esqueceu sua senha?
                </a>
              </div>

              {/* Botão de submissão */}
              <div className="pt-4">
                <Button type="submit">
                  ENTRAR
                </Button>
              </div>
            </form>

            {/* Link para Cadastro */}
            <div className="mt-6 text-sm text-[#d1cfcf] text-center">
              Não possui uma conta?{' '}
              <a href="/cadastro" className="text-[#9B7BFF] font-semibold hover:underline">
                Cadastre-se
              </a>
            </div>
          </div>
        </div>

        {/* Lado Esquerdo: Logo e Ilustração (Oculto no móvel) */}
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center">
          <div className="w-full max-w-lg px-8 py-6 flex flex-col items-center justify-center"> 
            
            {/* Logo */}
            <div className="mb-10 w-full flex justify-start"> 
              <img
                src="/Stock.io.png" 
                alt="Logo Stock.io"
                className="h-20 object-contain" 
              />
            </div>

            {/* Ilustração */}
            <div className="w-full"> 
               <img
                src="/Stockles_01.png" 
                alt="Mascote Stock.io"
                className="w-full h-auto object-contain max-h-[68vh]" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
               />
            </div>
            
          </div>
        </div>
      </div>
      {/* O ToastContainer é global, não precisa estar aqui */}
    </div>
  );
}