import {
  AlertOutlined,
  ApartmentOutlined,
  DashboardOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useEmployeesStore } from '../store/useEmployeesStore';

const { Header, Content, Sider } = Layout;

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/clients', icon: <ApartmentOutlined />, label: 'Клиенты / Объекты' },
  { key: '/employees', icon: <TeamOutlined />, label: 'Сотрудники' },
  { key: '/notifications', icon: <AlertOutlined />, label: 'Уведомления' }
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const loadEmployees = useEmployeesStore((state) => state.loadEmployees);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  return (
    <Layout className="app-shell">
      <Sider width={248} className="app-sidebar">
        <div className="brand">
          <div className="brand-mark">M</div>
          <div>
            <Typography.Title level={4}>Мигрант CRM</Typography.Title>
            <Typography.Text>учет и трудоустройство</Typography.Text>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Space direction="vertical" size={0}>
            <Typography.Text type="secondary">Оперативный контур 1С</Typography.Text>
            <Typography.Title level={3}>CRM учета мигрантов и объектов</Typography.Title>
          </Space>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
