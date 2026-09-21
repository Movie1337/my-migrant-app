import { Employee, EmployeeFilters, EmployeesResponse } from '../types';
import { httpClient } from './http';

const oneCFilterMapping: Partial<Record<keyof EmployeeFilters, string>> = {
  fullName: 'fullName'
};

function buildConfirmedParams(filters: EmployeeFilters = {}) {
  return Object.entries(oneCFilterMapping).reduce<Record<string, string>>((params, [key, apiKey]) => {
    const value = filters[key as keyof EmployeeFilters];
    if (apiKey && typeof value === 'string' && value.trim()) params[apiKey] = value.trim();
    return params;
  }, {});
}

export const employeesApi = {
  async getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
    const response = await httpClient.get<EmployeesResponse>('/employees', {
      params: buildConfirmedParams(filters)
    });
    if (response.data.status !== 'ok' || !Array.isArray(response.data.data)) {
      throw new Error(response.data.message ?? '1С вернула некорректный список сотрудников');
    }
    return response.data.data;
  }
};
