import axios from 'axios';

// Configurar la URL base de tu API
// IMPORTANTE: Reemplaza con la URL de tu API real
const API_BASE_URL = 'http://localhost:8000'; // Cambia esto por tu URL de API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default api;
