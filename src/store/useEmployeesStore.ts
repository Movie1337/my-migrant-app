import { create } from 'zustand';
import { employeesApi } from '../api/employees';
import { objectsApi } from '../api/objects';
import { Employee, EmployeeFilters } from '../types';

interface EmployeesState {
  employees: Employee[];
  objects: string[];
  isLoading: boolean;
  isObjectsLoading: boolean;
  error: string | null;
  objectsError: string | null;
  loadEmployees: (filters?: EmployeeFilters) => Promise<void>;
  loadObjects: () => Promise<void>;
  getEmployeeByTn: (tn: string) => Employee | undefined;
}

export const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  objects: [],
  isLoading: false,
  isObjectsLoading: false,
  error: null,
  objectsError: null,

  loadEmployees: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const employees = await employeesApi.getEmployees(filters);
      set({ employees, isLoading: false });
    } catch (error) {
      set({
        employees: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Не удалось получить данные из 1С'
      });
    }
  },

  loadObjects: async () => {
    if (get().isObjectsLoading) return;
    set({ isObjectsLoading: true, objectsError: null });
    try {
      const objects = await objectsApi.getObjects();
      set({ objects, isObjectsLoading: false });
    } catch (error) {
      set({
        objects: [],
        isObjectsLoading: false,
        objectsError: error instanceof Error ? error.message : 'Не удалось получить список объектов'
      });
    }
  },

  getEmployeeByTn: (tn) => get().employees.find((employee) => employee.tn === tn)
}));
