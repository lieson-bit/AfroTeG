
## Установка и запуск

После клонирования репозитория выполните следующие шаги для установки зависимостей и запуска проекта:

### Шаг 1: Клонирование репозитория
```bash
git clone git@github.com:lieson-bit/AfroTeG.git
cd AfroTeG
```

### Шаг 2: Установка зависимостей для Backend
```bash
cd server
npm install
```

### Шаг 3: Установка зависимостей для Frontend
```bash
cd ../client
npm install
```

### Шаг 4: Настройка окружения
Создайте файл `.env` в папке `server` со следующими переменными:
```env
PORT=
MONGO_URI=
TOKEN_SECRET=
MODE_CODE_SENDING_EMAIL_ADDRESS=
MODE_CODE_SENDING_EMAIL_PASSWORD=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_API_BASE_URL=
```

### Шаг 5: Запуск сервера
```bash
cd server
npm start
```
*Сервер запускается с помощью nodemon для автоматической перезагрузки при изменениях.*

### Шаг 6: Запуск клиента
```bash
cd client
npm run dev
```
*Клиентское приложение будет доступно по адресу: http://localhost:3000*
