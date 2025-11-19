import axios from 'axios';

// Garante funcionamento mesmo se a env não estiver definida (dev local)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
});

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  // Log leve para ajudar a detectar ambiente sem variável configurada
  // eslint-disable-next-line no-console
  console.warn('[API] NEXT_PUBLIC_API_BASE_URL não definida, usando http://localhost:3000');
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Limpa o header antigo ANTES de qualquer coisa
    delete config.headers.Authorization; 
    
    if (token) {
      // Adiciona o novo token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;