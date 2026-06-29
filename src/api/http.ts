import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_1C_API_URL ?? 'http://localhost/hs/ПередачаДанных';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Не удалось выполнить запрос к 1С';

    return Promise.reject(new Error(message));
  }
);
