import axios from 'axios';

const api = axios.create({
  baseURL:'http://localhost:3000',
});

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