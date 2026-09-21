import { Employee, EmployeeAlert } from '../types';
import { getDaysLeft, getDeadlineStatus } from './dateStatus';

export function getEmployeeAlerts(employees: Employee[], maxDays = 30): EmployeeAlert[] {
  return employees
    .flatMap((employee) => [
      { employee, documentType: 'patent' as const, date: employee.documents.patentExpire, apiDaysLeft: employee.documents.daysToPatentExpire },
      { employee, documentType: 'registration' as const, date: employee.documents.registrationExpire, apiDaysLeft: employee.documents.daysToRegistrationExpire }
    ])
    .map(({ employee, documentType, date, apiDaysLeft }) => ({
      employee,
      documentType,
      date,
      daysLeft: date ? (apiDaysLeft >= 0 ? apiDaysLeft : getDaysLeft(date)) : null,
      severity: getDeadlineStatus(date, apiDaysLeft)
    }))
    .filter((alert): alert is EmployeeAlert => alert.daysLeft !== null && alert.daysLeft <= maxDays)
    .sort((first, second) => (first.daysLeft ?? 0) - (second.daysLeft ?? 0));
}

export function getDashboardStats(employees: Employee[]) {
  const alerts = getEmployeeAlerts(employees, 30);
  const expired = (documentType: EmployeeAlert['documentType']) =>
    alerts.filter((alert) => alert.documentType === documentType && alert.severity === 'expired').length;

  return {
    total: employees.length,
    active: employees.filter((employee) => employee.status === 'active').length,
    fired: employees.filter((employee) => employee.status === 'fired').length,
    patentExpired: expired('patent'),
    registrationExpired: expired('registration'),
    expiring7: alerts.filter((alert) => alert.daysLeft !== null && alert.daysLeft >= 0 && alert.daysLeft <= 7).length,
    expiring14: alerts.filter((alert) => alert.daysLeft !== null && alert.daysLeft >= 0 && alert.daysLeft <= 14).length,
    expiring30: alerts.filter((alert) => alert.daysLeft !== null && alert.daysLeft >= 0 && alert.daysLeft <= 30).length,
    firingSoon: employees.filter((employee) => employee.status === 'active' && employee.daysToFire >= 0 && employee.daysToFire <= 30).length
  };
}
