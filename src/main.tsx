import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import App from './App';
import './styles.css';

dayjs.locale('ru');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        },
        components: {
          Layout: {
            bodyBg: '#f4f6f8',
            siderBg: '#18202a',
            headerBg: '#ffffff'
          },
          Table: {
            headerBg: '#eef2f6',
            rowHoverBg: '#f7fbff',
            cellPaddingBlock: 9,
            cellPaddingInline: 10
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
