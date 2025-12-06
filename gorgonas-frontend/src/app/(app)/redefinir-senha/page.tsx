'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { resetPassword } from '@/utilis/passwordRecovery';
import { MIN_PASSWORD_LENGTH, isValidPassword } from '@/utilis/validators';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Link de redefinição inválido ou expirado. Solicite um novo email.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error('Token de redefinição não encontrado.');
      router.push('/recuperar-senha');
      return;
    }

    if (!senha || !confirmarSenha) {
      toast.error('Preencha todos os campos.');
      return;
    }

    if (!isValidPassword(senha)) {
      toast.error(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, senha);

      toast.success('Senha redefinida com sucesso!');
      router.push('/login');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao redefinir senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3E4]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col md:flex-row-reverse items-center gap-10 px-6 py-10">
        {/* FORM */}
        <div className="md:w-1/2 w-full flex justify-center">
          <div className="w-full max-w-xl bg-[#171918] text-white p-12 md:p-16 shadow-xl flex flex-col justify-center h-full rounded-[36px]">
            <h1 className="text-center text-2xl md:text-3xl font-extrabold tracking-wide mb-6">
              REDEFINIR SENHA
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!token && (
                <div className="rounded-md bg-red-500/10 px-3 py-2 text-center text-sm text-red-200">
                  Link inválido ou expirado. Solicite uma nova recuperação.
                </div>
              )}

              <PasswordInput
                placeholder="Nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />

              <PasswordInput
                placeholder="Confirmar nova senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />

              <Button type="submit" disabled={loading || !token}>
                {loading ? 'Salvando...' : 'Salvar Nova Senha'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <a href="/login" className="text-[#9B7BFF] hover:underline">
                Voltar ao login
              </a>
            </div>
          </div>
        </div>

        {/* IMAGEM */}
        <div className="hidden md:flex md:w-1/2 w-full items-center justify-center">
          <Image
            src="/Stockles-Mascote2.png"
            width={260}
            height={420}
            alt="Mascote Stock.io"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}