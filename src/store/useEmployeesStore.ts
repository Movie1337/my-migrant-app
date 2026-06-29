import { create } from 'zustand';
import { fetchEmployees, updateEmployee } from '../api/employees';
import { Employee } from '../types';
import { createDemoEmployees } from '../utils/demoData';

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  loadEmployees: () => Promise<void>;
  saveEmployee: (employee: Employee) => Promise<void>;
  getEmployeeById: (id: string) => Employee | undefined;
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  loadEmployees: async () => {
    set({ isLoading: true, error: null });

    try {
      const employees = await fetchEmployees();
      set({ employees, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Не удалось загрузить сотрудников';

      set({
        employees: createDemoEmployees(),
        isLoading: false,
        error: `${message}. Показаны демо-данные для проверки интерфейса.`
      });
    }
  },

  saveEmployee: async (employee) => {
    const updated = await updateEmployee(employee);

    set({
      employees: get().employees.map((item) => (item.id === updated.id ? updated : item))
    });
  },

  getEmployeeById: (id) => get().employees.find((employee) => employee.id === id)
}));
