import { AlertOutlined, CheckCircleOutlined, StopOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row, Statistic, Typography } from 'antd';
import { useMemo } from 'react';
import AlertPanel from '../components/AlertPanel';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { getDashboardStats } from '../utils/statistics';

export default function DashboardPage() {
  const { employees, error, loadEmployees } = useEmployeesStore();
  const stats = useMemo(() => getDashboardStats(employees), [employees]);

  return <div className="page-stack">
    <div className="page-title"><div><Typography.Text type="secondary">Данные рассчитываются из ответа 1С</Typography.Text><Typography.Title level={2}>Dashboard</Typography.Title></div></div>
    {error && <Alert type="error" showIcon message="Не удалось получить данные из 1С" description={error} action={<Button size="small" onClick={() => void loadEmployees()}>Повторить</Button>} />}
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}><div className="metric-card"><Statistic title="Всего сотрудников" value={stats.total} prefix={<TeamOutlined />} /></div></Col>
      <Col xs={24} sm={12} xl={6}><div className="metric-card"><Statistic title="Работают" value={stats.active} prefix={<CheckCircleOutlined />} /></div></Col>
      <Col xs={24} sm={12} xl={6}><div className="metric-card danger"><Statistic title="Уволены" value={stats.fired} prefix={<StopOutlined />} /></div></Col>
      <Col xs={24} sm={12} xl={6}><div className="metric-card warning"><Statistic title="Увольнение ≤ 30 дней" value={stats.firingSoon} prefix={<AlertOutlined />} /></div></Col>
    </Row>
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}><div className="metric-card danger"><Statistic title="Просрочен патент" value={stats.patentExpired} /></div></Col>
      <Col xs={24} md={8}><div className="metric-card danger"><Statistic title="Просрочена регистрация" value={stats.registrationExpired} /></div></Col>
      <Col xs={24} md={8}><div className="metric-card warning"><Statistic title="Истекают за 7 дней" value={stats.expiring7} /></div></Col>
    </Row>
    <AlertPanel employees={employees} />
  </div>;
}
