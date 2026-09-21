# Migrant CRM

Веб-интерфейс получает сотрудников только через FastAPI-прокси: React → FastAPI → 1С.
React не содержит секрет My-Authorization и не обращается к 1С напрямую.

## Запуск

1. Скопируйте backend/.env.example в backend/.env и заполните только backend-настройки.
2. В отдельном терминале перейдите в backend, создайте виртуальное окружение, установите зависимости из requirements.txt и запустите uvicorn app.main:app --reload.
3. В корне проекта выполните npm install, затем npm run dev.

По умолчанию Vite проксирует /api на http://127.0.0.1:8000. Для развёртывания настройте обратный прокси либо задайте VITE_API_URL адресом FastAPI.

## Контракты

FastAPI предоставляет GET /api/objects, GET /api/employees?fullName=... и внутренний GET /api/employees/{tn}.
Внутри используются только подтверждённые 1С endpoints: objects, employees и employees?fullName=....

OneCClient находится в backend/app/onec_client.py. Он получает временный токен через GET /Proffart_hrm/hs/datatransfer/enter с постоянным секретом из ONEC_AUTH_SECRET, кеширует его в памяти до validTo и повторяет запрос один раз после ответа 401/403. Токен и постоянный секрет никогда не передаются в React.

Фильтр fullName отправляется в 1С. Остальные фильтры применяются в UI до получения их подтверждённых query-параметров. Значение -1 никогда не показывается пользователю: дата определяет «Не указано» или «Просрочен», а неотрицательное daysTo... отображается как число дней.
