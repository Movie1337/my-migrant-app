import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ClientsPage from './pages/ClientsPage';
import DashboardPage from './pages/DashboardPage';
import EmployeeDetailPage from './pages/EmployeeDetailPage';
import EmployeesPage from './pages/EmployeesPage';
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employee/:id" element={<EmployeeDetailPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
