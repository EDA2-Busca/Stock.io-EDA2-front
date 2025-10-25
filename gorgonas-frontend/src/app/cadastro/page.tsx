'use client'; 

import { useRouter } from 'next/navigation'; 
import React, { useState } from 'react';

import { toast } from 'react-toastify'; 

import TextInput from '@/components/ui/TextInput';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function CadastroPage() {
  const router = useRouter();

  // (Estados e UI - Sem Alterações)
  const [nome, setNome] = useState('');
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [popupAberto, setPopupAberto] = useState(false);

  // --- Funções de Validação (Com '.' adicionado à regex da senha) ---
  const validarNome = (nome: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return regex.test(nome.trim());
  };

  const validarUsername = (username: string) => {
    const regex = /^\S+$/; 
    return regex.test(username);
  };
  
  const validarEmail = (email: string) => {
    const regexFormato = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexFormato.test(email.trim());
  };

  // ATUALIZADA: Regex da senha para incluir '.' (ponto)
  const validarSenhaSegura = (senha: string) => {
    // 1. Adicionado '\.' (ponto escapado) ao grupo de caracteres especiais
    const regex = /^(?=.*[a-zç])(?=.*[A-ZÇ])(?=.*\d)(?=.*[@$!%*?&.]).{8,}$/;
    return regex.test(senha);
  };

  // --- Lógica de Submissão ---
  const lendoRegister = async () => {
    console.log('Dados enviados (simulação):', { nome, username, email, senha });
    setPopupAberto(true);
  };

  const handleModalConfirm = () => {
    setPopupAberto(false);
    router.push('/login');
  };

  // ATUALIZADO: handleSubmit com a nova mensagem de erro da senha
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Teste: Campos vazios
    if (!nome || !username || !email || !senha || !confirmarSenha) {
      toast.error('Por favor, preencha todos os campos.', { toastId: 'err-campos' });
      return;
    }
    // Teste: Nome inválido
    if (!validarNome(nome)) {
      toast.error('O nome deve conter apenas letras e espaços.', { toastId: 'err-nome' });
      return;
    }

    // Teste: Username inválido
    if (!validarUsername(username)) {
      toast.error('O username não pode conter espaços.', { toastId: 'err-username' });
      return;
    }

    // Teste: Email inválido
    if (!validarEmail(email)) {
      toast.error('Por favor, insira um email válido.', { toastId: 'err-email' });
      return;
    }
    
    // Teste: Senhas não coincidem
    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem.', { toastId: 'err-match' });
      return;
    }

    // Teste: Senha inválida
    if (!validarSenhaSegura(senha)) {
      // 2. Adicionado '.' (ponto) à mensagem de exemplo do toast
      toast.error('Senha inválida. Deve ter 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 caractere especial (ex: @$!%*?&.).', { toastId: 'err-segura' });
      return;
    }
    
    // Se passar em tudo, regista
    await lendoRegister();
  };
  
  return (
    <div className="min-h-screen flex items-stretch bg-[#F6F3E4]">
      
      <div className="w-full max-w-[1300px] mx-auto flex flex-col md:flex-row items-stretch py-12 px-6 md:px-8">
        
        {/* Lado Esquerdo (Formulário) */}
        <div className="md:w-1/2 w-full flex items-stretch justify-center">
          <div
            className="w-full max-w-lg bg-[#171918] text-white p-8 md:p-12 shadow-xl flex flex-col justify-start h-full overflow-hidden rounded-[18px] md:rounded-l-[36px] md:rounded-r-[36px]"
            style={{ boxSizing: 'border-box' }}
          >
            <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white mb-10 mt-8">
              CRIE SUA CONTA
            </h1>

            {/* Formulário (sem alteração) */}
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              
              <TextInput
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome Completo"
                type="text"
              />
              
              <TextInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                type="text"
              />

              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
              
              <PasswordInput
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
              />

              <PasswordInput
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar Senha"
              />

              <div className="pt-4">
                <Button type="submit">
                  CRIE SUA CONTA
                </Button>
              </div>
            </form>

            <div className="mt-6 text-sm text-[#d1cfcf] text-center">
              Já possui uma conta?{' '}
              <a href="/login" className="text-[#9B7BFF] font-semibold hover:underline">
                Login
              </a>
            </div>

            <div className="flex-1" />
          </div>
        </div>

        {/* Lado Direito (Ilustração e Logo) */}
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center">
          <div className="w-full max-w-lg px-8 py-6 flex flex-col items-center justify-start -ml-8">
            
            <div className="mb-6 w-full flex justify-end">
              <img
                src="/Stock.io.png" /* */
                alt="Logo Stock.io"
                className="h-20 object-contain" 
              />
            </div>

            <div className="w-full h-[80vh] flex items-start justify-center">
               <img
                src="/StockLee.png" /* */
                alt="Mascote Stock.io"
                className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
               />
            </div>
            
          </div>
        </div>
      </div>

      {/* Modal (sem alteração na chamada, mas o componente foi corrigido para o erro do children) */}
      <Modal
        isOpen={popupAberto}
        onClose={() => setPopupAberto(false)}
        onConfirm={handleModalConfirm}
        title="Cadastro realizado com sucesso!"
      >
        <p>Redirecionando para o login...</p>
      </Modal>
    </div>
  );
}