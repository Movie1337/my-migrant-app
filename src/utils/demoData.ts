import dayjs from 'dayjs';
import { Employee } from '../types';

export function createDemoEmployees(): Employee[] {
  const today = dayjs();

  return [
    {
      id: 'EMP-001',
      fullName: 'Ахмедов Рустам Фарходович',
      phone: '+7 900 111-22-33',
      citizenship: 'Узбекистан',
      birthDate: '1992-04-12',
      hiredAt: today.subtract(8, 'month').format('YYYY-MM-DD'),
      dismissedAt: null,
      status: 'active',
      clientId: 'CL-001',
      clientName: 'СеверСтрой',
      objectName: 'ЖК Речной, корпус 3',
      foreman: 'Иванов Петр',
      patentExpiresAt: today.add(5, 'day').format('YYYY-MM-DD'),
      checkPaymentAt: today.add(2, 'day').format('YYYY-MM-DD'),
      registrationExpiresAt: today.add(28, 'day').format('YYYY-MM-DD'),
      medicalBookExpiresAt: today.add(90, 'day').format('YYYY-MM-DD'),
      passportNumber: 'AA1234567',
      documents: [
        {
          id: 'EMP-001-patent',
          employeeId: 'EMP-001',
          type: 'patent',
          title: 'Патент',
          number: '77-123456',
          issuedAt: today.subtract(10, 'month').format('YYYY-MM-DD'),
          expiresAt: today.add(5, 'day').format('YYYY-MM-DD')
        },
        {
          id: 'EMP-001-check',
          employeeId: 'EMP-001',
          type: 'check',
          title: 'Чек по патенту',
          paymentDate: today.add(2, 'day').format('YYYY-MM-DD')
        },
        {
          id: 'EMP-001-registration',
          employeeId: 'EMP-001',
          type: 'registration',
          title: 'Регистрация',
          expiresAt: today.add(28, 'day').format('YYYY-MM-DD')
        }
      ],
      history: [
        {
          id: 'h-1',
          date: today.subtract(8, 'month').format('YYYY-MM-DD'),
          event: 'Принят на объект',
          author: 'Оператор'
        }
      ]
    },
    {
      id: 'EMP-002',
      fullName: 'Каримов Бахтиер Алиевич',
      phone: '+7 900 444-55-66',
      citizenship: 'Таджикистан',
      birthDate: '1988-10-03',
      hiredAt: today.subtract(1, 'year').format('YYYY-MM-DD'),
      dismissedAt: null,
      status: 'active',
      clientId: 'CL-002',
      clientName: 'Монолит Групп',
      objectName: 'БЦ Восток',
      foreman: 'Смирнов Алексей',
      patentExpiresAt: today.subtract(3, 'day').format('YYYY-MM-DD'),
      checkPaymentAt: today.add(12, 'day').format('YYYY-MM-DD'),
      registrationExpiresAt: today.add(6, 'day').format('YYYY-MM-DD'),
      medicalBookExpiresAt: today.add(45, 'day').format('YYYY-MM-DD'),
      passportNumber: 'AB7654321',
      documents: [
        {
          id: 'EMP-002-patent',
          employeeId: 'EMP-002',
          type: 'patent',
          title: 'Патент',
          number: '50-777001',
          expiresAt: today.subtract(3, 'day').format('YYYY-MM-DD')
        },
        {
          id: 'EMP-002-registration',
          employeeId: 'EMP-002',
          type: 'registration',
          title: 'Регистрация',
          expiresAt: today.add(6, 'day').format('YYYY-MM-DD')
        }
      ],
      history: []
    },
    {
      id: 'EMP-003',
      fullName: 'Нурматов Азизбек Шухратович',
      phone: '+7 900 777-88-99',
      citizenship: 'Киргизия',
      hiredAt: today.subtract(3, 'month').format('YYYY-MM-DD'),
      dismissedAt: today.subtract(10, 'day').format('YYYY-MM-DD'),
      status: 'dismissed',
      clientId: 'CL-001',
      clientName: 'СеверСтрой',
      objectName: 'ЖК Речной, корпус 2',
      foreman: 'Иванов Петр',
      patentExpiresAt: today.add(120, 'day').format('YYYY-MM-DD'),
      checkPaymentAt: today.add(21, 'day').format('YYYY-MM-DD'),
      registrationExpiresAt: today.add(80, 'day').format('YYYY-MM-DD'),
      medicalBookExpiresAt: today.add(180, 'day').format('YYYY-MM-DD'),
      passportNumber: 'AC555000',
      documents: [],
      history: [
        {
          id: 'h-3',
          date: today.subtract(10, 'day').format('YYYY-MM-DD'),
          event: 'Уволен',
          author: 'HR'
        }
      ]
    },
    {
      id: 'EMP-004',
      fullName: 'Юсупов Шерзод Акмалович',
      phone: '+7 900 222-33-44',
      citizenship: 'Узбекистан',
      hiredAt: today.subtract(18, 'day').format('YYYY-MM-DD'),
      dismissedAt: null,
      status: 'onboarding',
      clientId: 'CL-003',
      clientName: 'Городские Фасады',
      objectName: 'ТРЦ Центральный',
      foreman: 'Орлов Дмитрий',
      patentExpiresAt: today.add(35, 'day').format('YYYY-MM-DD'),
      checkPaymentAt: today.add(7, 'day').format('YYYY-MM-DD'),
      registrationExpiresAt: today.add(14, 'day').format('YYYY-MM-DD'),
      medicalBookExpiresAt: today.add(4, 'day').format('YYYY-MM-DD'),
      passportNumber: 'AD909090',
      documents: [
        {
          id: 'EMP-004-med',
          employeeId: 'EMP-004',
          type: 'medicalBook',
          title: 'Медкнижка',
          expiresAt: today.add(4, 'day').format('YYYY-MM-DD')
        },
        {
          id: 'EMP-004-check',
          employeeId: 'EMP-004',
          type: 'check',
          title: 'Чек по патенту',
          paymentDate: today.add(7, 'day').format('YYYY-MM-DD')
        }
      ],
      history: []
    }
  ];
}
