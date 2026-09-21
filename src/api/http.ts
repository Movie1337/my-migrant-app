import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: { Accept: 'application/json' }
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        typeof error.response?.data?.message === 'string'
          ? error.response.data.message
          : error.code === 'ECONNABORTED'
            ? 'Превышено время ожидания ответа от сервера'
            : error.response?.status === 401 || error.response?.status === 403
              ? 'Сессия авторизации 1С истекла'
              : 'Не удалось получить данные из 1С';
      return Promise.reject(new Error(message));
    }

    return Promise.reject(error);
  }
);
