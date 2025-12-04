import api from './api';

export type PasswordRecoveryResponse = {
  token?: string;
};

export function requestPasswordReset(email: string) {
  return api.post<PasswordRecoveryResponse>('/auth/forgot-password', { email });
}

export function resetPassword(token: string, novaSenha: string) {
  return api.post('/auth/reset-password', { token, novaSenha });
}
