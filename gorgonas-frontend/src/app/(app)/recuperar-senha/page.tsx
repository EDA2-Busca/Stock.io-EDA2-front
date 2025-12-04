'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';

import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';

import { requestPasswordReset } from '@/utilis/passwordRecovery';
import { isValidEmail } from '@/utilis/validators';

export default function RecuperarSenhaPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Por favor, preencha o email.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await requestPasswordReset(email.trim());

      toast.success(
        'Se o email existir, enviamos instruções para recuperar a senha.',
      );

      const token = data?.token;

      if (token) {
        // Já redireciona o usuário para a tela de redefinir senha com o token na URL
        router.push(`/redefinir-senha?token=${token}`);
      }

      setEmail('');
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          'Não foi possível iniciar a recuperação de senha. Tente novamente.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-[#F6F3E4]">
      <div className="w-full max-w-[1300px] mx-auto flex flex-col md:flex-row-reverse items-stretch py-12 px-6 md:px-8">
        {/* Card à direita (igual login) */}
        <div className="md:w-1/2 w-full flex items-stretch justify-center">
          <div
            className="w-full max-w-lg bg-[#171918] text-white p-8 md:p-12 shadow-xl flex flex-col justify-center h-full overflow-hidden rounded-[18px] md:rounded-[36px]"
            style={{ boxSizing: 'border-box' }}
          >
            <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide text-white mb-4 mt-8">
              ESQUECEU SUA SENHA?
            </h1>

            <p className="text-center text-sm text-[#d1cfcf] mb-8">
              Informe seu email e, se ele estiver cadastrado, você poderá
              redefinir sua senha.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />

              <div className="pt-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'ENVIANDO...' : 'ENVIAR INSTRUÇÕES'}
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

        {/* Lado esquerdo – boneco novo */}
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

            {/* Boneco novo */}
            <div className="w-full flex justify-center">
              <img
                src="/Stockles-Mascote2.png"
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
