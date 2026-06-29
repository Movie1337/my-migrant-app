import { DocumentAlert, Employee, EmployeeDocument } from '../types';
import { getDaysLeft, getDeadlineStatus } from './dateStatus';

export function getEmployeeDocumentAlerts(
  employees: Employee[],
  maxDays = 30
): DocumentAlert[] {
  return employees
    .flatMap((employee) =>
      employee.documents
        .map((document: EmployeeDocument) => {
          const targetDate = document.expiresAt ?? document.paymentDate;
          const daysLeft = getDaysLeft(targetDate);

          if (daysLeft === null || daysLeft > maxDays) {
            return null;
          }

          return {
            employee,
            document,
            daysLeft,
            severity: getDeadlineStatus(targetDate)
          };
        })
        .filter((alert): alert is DocumentAlert => alert !== null)
    )
    .sort((first, second) => first.daysLeft - second.daysLeft);
}

export function getDashboardStats(employees: Employee[]) {
  const alerts = getEmployeeDocumentAlerts(employees, 30);

  return {
    total: employees.length,
    active: employees.filter((employee) => employee.status === 'active').length,
    dismissed: employees.filter((employee) => employee.status === 'dismissed').length,
    expiring7: alerts.filter((alert) => alert.daysLeft >= 0 && alert.daysLeft <= 7).length,
    expiring14: alerts.filter((alert) => alert.daysLeft >= 0 && alert.daysLeft <= 14).length,
    expiring30: alerts.filter((alert) => alert.daysLeft >= 0 && alert.daysLeft <= 30).length,
    expired: alerts.filter((alert) => alert.daysLeft < 0).length,
    checksToPay: alerts.filter((alert) => alert.document.type === 'check').length
  };
}
