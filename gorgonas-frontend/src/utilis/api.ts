import axios from 'axios';

const api = axios.create({
  // Ele vai ler .env.local
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  // headers: {
  //  'Content-Type': 'application/json',
  // },
});

export default api;