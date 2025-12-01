'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';

import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';

import api from '../../../utilis/api';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!novaSenha || !confirmarSenha) {
      toast.error('Preencha todos os campos de senha.');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('A confirmação de senha não confere.');
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      toast.error('Token de recuperação inválido ou ausente.');
      return;
    }

    try {
      setIsLoading(true);

      await api.post('/auth/reset-password', {
        token,
        novaSenha,
      });

      toast.success('Senha redefinida com sucesso! Faça login novamente.');
      router.push('/login');
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível redefinir a senha. Verifique o token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#F6F3E4]">
      <div className="w-full max-w-[1300px] mx-auto flex flex-col md:flex-row-reverse items-stretch py-12 px-6 md:px-8">
        {/* Card à direita */}
        <div className="md:w-1/2 w-full flex items-stretch justify-center">
          <div
            className="w-full max-w-lg bg-[#171918] text-white p-8 md:p-12 shadow-xl flex flex-col justify-center h-full overflow-hidden rounded-[18px] md:rounded-[36px]"
            style={{ boxSizing: 'border-box' }}
          >
            <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white mb-4 mt-8">
              REDEFINIR SENHA
            </h1>

            <p className="text-center text-sm text-[#d1cfcf] mb-8">
              Defina uma nova senha para acessar sua conta.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <PasswordInput
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Nova senha"
              />

              <PasswordInput
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Confirmar nova senha"
              />

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'SALVANDO...' : 'SALVAR NOVA SENHA'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-sm text-[#d1cfcf] text-center">
              Lembrou sua senha?{' '}
              <a
                href="/login"
                className="text-[#9B7BFF] font-semibold hover:underline"
              >
                Voltar para o login
              </a>
            </div>
          </div>
        </div>

        
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center">
          <div className="w-full max-w-lg px-8 py-6 flex flex-col items-center justify-center">
            <div className="mb-10 w-full flex justify-start">
              <img
                src="/Stock.io.png"
                alt="Logo Stock.io"
                className="h-20 object-contain"
              />
            </div>

            <div className="w-full flex justify-center">
              <img
                src="/Stockles_RecuperarSenha.png"
                alt="Mascote Stock.io"
                className="w-auto h-[420px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
