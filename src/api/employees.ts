import { httpClient } from './http';
import { ApiResponse, Employee } from '../types';
import { normalizeEmployee } from '../utils/normalizers';

export async function fetchEmployees(): Promise<Employee[]> {
  const response = await httpClient.get<ApiResponse<unknown[]>>('/Получить');
  const payload = response.data;

  if (payload.status !== 'ok' || !Array.isArray(payload.data)) {
    throw new Error(payload.message ?? '1С вернула некорректный список сотрудников');
  }

  return payload.data.map(normalizeEmployee);
}

export async function updateEmployee(employee: Employee): Promise<Employee> {
  const response = await httpClient.put<ApiResponse<unknown>>('/Отправить', employee);
  const payload = response.data;

  if (payload.status !== 'ok') {
    throw new Error(payload.message ?? 'Не удалось обновить сотрудника');
  }

  return normalizeEmployee(payload.data ?? employee);
}

export async function fetchStorageIdentifier(): Promise<unknown> {
  const response = await httpClient.get<ApiResponse<unknown>>('/ХранилищеИдентификатор');
  return response.data.data;
}
