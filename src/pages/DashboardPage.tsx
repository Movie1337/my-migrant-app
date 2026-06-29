import {
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Alert, Col, Row, Statistic, Typography } from 'antd';
import { useMemo } from 'react';
import AlertPanel from '../components/AlertPanel';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { getDashboardStats } from '../utils/statistics';

export default function DashboardPage() {
  const { employees, error } = useEmployeesStore();
  const stats = useMemo(() => getDashboardStats(employees), [employees]);

  return (
    <div className="page-stack">
      <div className="page-title">
        <div>
          <Typography.Text type="secondary">Сегодняшняя картина по персоналу</Typography.Text>
          <Typography.Title level={2}>Dashboard</Typography.Title>
        </div>
      </div>

      {error && <Alert type="warning" showIcon message={error} />}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <div className="metric-card">
            <Statistic title="Всего сотрудников" value={stats.total} prefix={<TeamOutlined />} />
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="metric-card">
            <Statistic title="Приняты / работают" value={stats.active} prefix={<CheckCircleOutlined />} />
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="metric-card danger">
            <Statistic title="Уволены" value={stats.dismissed} prefix={<StopOutlined />} />
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="metric-card warning">
            <Statistic title="Чеки к оплате" value={stats.checksToPay} prefix={<ClockCircleOutlined />} />
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <div className="metric-card warning">
            <Statistic title="Истекают за 7 дней" value={stats.expiring7} prefix={<AlertOutlined />} />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="metric-card">
            <Statistic title="Истекают за 14 дней" value={stats.expiring14} />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="metric-card">
            <Statistic title="Истекают за 30 дней" value={stats.expiring30} />
          </div>
        </Col>
      </Row>

      <AlertPanel employees={employees} />
    </div>
  );
}
