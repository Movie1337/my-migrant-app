import { Employee, EmployeeDocument, EmploymentStatus } from '../types';

type SourceRecord = Record<string, unknown>;

function pickString(source: SourceRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];

    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function pickNullableString(source: SourceRecord, keys: string[]): string | null | undefined {
  const value = pickString(source, keys);
  return value === undefined ? undefined : value;
}

function normalizeStatus(status?: string, dismissedAt?: string | null): EmploymentStatus {
  const value = status?.toLowerCase();

  if (dismissedAt || value?.includes('увол')) {
    return 'dismissed';
  }

  if (value?.includes('оформ')) {
    return 'onboarding';
  }

  if (value?.includes('пауз') || value?.includes('стоп')) {
    return 'suspended';
  }

  return 'active';
}

function buildDocuments(employeeId: string, source: SourceRecord): EmployeeDocument[] {
  const documents = source.documents ?? source.Документы;

  if (Array.isArray(documents)) {
    return documents.map((item, index) => {
      const record = item as SourceRecord;
      const type = pickString(record, ['type', 'Тип', 'ВидДокумента']) ?? 'other';
      const expiresAt = pickString(record, ['expiresAt', 'ДатаОкончания', 'СрокДействия']);

      return {
        id: pickString(record, ['id', 'Идентификатор']) ?? `${employeeId}-doc-${index}`,
        employeeId,
        type: type as EmployeeDocument['type'],
        title: pickString(record, ['title', 'Название', 'Представление']) ?? type,
        number: pickString(record, ['number', 'Номер']),
        issuedAt: pickString(record, ['issuedAt', 'ДатаВыдачи']),
        expiresAt,
        paymentDate: pickString(record, ['paymentDate', 'ДатаОплаты'])
      };
    });
  }

  return [
    ['patent', 'Патент', pickString(source, ['patentExpiresAt', 'ПатентДо', 'ДатаОкончанияПатента'])],
    ['check', 'Чек', pickString(source, ['checkPaymentAt', 'ЧекОплатаДо', 'ДатаОплатыЧека'])],
    [
      'registration',
      'Регистрация',
      pickString(source, ['registrationExpiresAt', 'РегистрацияДо', 'ДатаОкончанияРегистрации'])
    ],
    [
      'medicalBook',
      'Медкнижка',
      pickString(source, ['medicalBookExpiresAt', 'МедкнижкаДо', 'ДатаОкончанияМедкнижки'])
    ]
  ]
    .filter(([, , expiresAt]) => Boolean(expiresAt))
    .map(([type, title, expiresAt]) => ({
      id: `${employeeId}-${type}`,
      employeeId,
      type: type as EmployeeDocument['type'],
      title: title as string,
      expiresAt: expiresAt as string
    }));
}

export function normalizeEmployee(raw: unknown): Employee {
  const source = (raw ?? {}) as SourceRecord;
  const id =
    pickString(source, ['id', 'uid', 'Идентификатор', 'Код', 'Ссылка']) ??
    crypto.randomUUID();
  const dismissedAt = pickNullableString(source, ['dismissedAt', 'ДатаУвольнения', 'Уволен']);

  return {
    id,
    fullName: pickString(source, ['fullName', 'name', 'ФИО', 'Наименование']) ?? 'Без имени',
    phone: pickString(source, ['phone', 'Телефон']),
    citizenship: pickString(source, ['citizenship', 'Гражданство']),
    birthDate: pickString(source, ['birthDate', 'ДатаРождения']),
    hiredAt: pickString(source, ['hiredAt', 'ДатаПриема', 'ДатаПриёма']),
    dismissedAt,
    status: normalizeStatus(pickString(source, ['status', 'Статус']), dismissedAt),
    clientId: pickString(source, ['clientId', 'КлиентИд', 'ОбъектИд']),
    clientName: pickString(source, ['clientName', 'Клиент', 'Заказчик']),
    objectName: pickString(source, ['objectName', 'Объект', 'Стройка']),
    foreman: pickString(source, ['foreman', 'Бригадир']),
    patentExpiresAt: pickString(source, ['patentExpiresAt', 'ПатентДо', 'ДатаОкончанияПатента']),
    checkPaymentAt: pickString(source, ['checkPaymentAt', 'ЧекОплатаДо', 'ДатаОплатыЧека']),
    registrationExpiresAt: pickString(source, ['registrationExpiresAt', 'РегистрацияДо', 'ДатаОкончанияРегистрации']),
    medicalBookExpiresAt: pickString(source, ['medicalBookExpiresAt', 'МедкнижкаДо', 'ДатаОкончанияМедкнижки']),
    passportNumber: pickString(source, ['passportNumber', 'Паспорт']),
    documents: buildDocuments(id, source),
    history: Array.isArray(source.history)
      ? source.history.map((item, index) => ({
          id: `${id}-history-${index}`,
          date: pickString(item as SourceRecord, ['date', 'Дата']) ?? new Date().toISOString(),
          event: pickString(item as SourceRecord, ['event', 'Событие']) ?? 'Изменение карточки',
          author: pickString(item as SourceRecord, ['author', 'Автор'])
        }))
      : []
  };
}
