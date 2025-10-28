'use client'; 

import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';

import { toast } from 'react-toastify'; 

import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();

  // --- Estados do Componente ---
  const [email, setEmail] = useState(''); 
  const [senha, setSenha] = useState(''); 

  // --- Função de Validação ---
  const validarEmail = (email: string) => {
    const regexFormato = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexFormato.test(email.trim());
  };

  // --- Lógica de Submissão (Simulada) ---
  const handleLogin = async () => {
    // TODO: Substituir por chamada real à API de login (axios.post)
    console.log('Tentando fazer login com:', { email, senha });

    try {
      // Simulação de chamada à API 
      // const response = await fakeApiLogin(email, senha); 

      // Simulação de sucesso:
      toast.success('Login efetuado com sucesso! Redirecionando...');
      setTimeout(() => {
        router.push('/'); // Redireciona para a página principal
      }, 1500); 

    } catch (error) {
      // --- Tratamento de Erros do Backend (Exemplo) ---
      // TODO: Implementar tratamento de erros reais da API
      console.error("Erro na tentativa de login (simulado ou real):", error);
     
      // Simulação de erro genérico por agora:
      toast.error('Email ou senha incorretos (simulação).', { toastId: 'err-login-simulado' });
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
            className="w-full max-w-lg bg-[#171918] text-white p-8 md:p-12 shadow-xl flex flex-col justify-center h-full overflow-hidden rounded-[18px] md:rounded-[36px]"
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