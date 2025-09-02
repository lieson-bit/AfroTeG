Установка зависимостей
После клонирования репозитория необходимо установить зависимости как для клиента, так и для сервера:
Шаг 1: Клонировать проект
git clone git@github.com:lieson-bit/AfroTeG.git
cd AfroTeG

Шаг 2: Установить зависимости для Backend
cd server
npm install

Шаг 3: Установить зависимости для Frontend
cd ../client
npm install

Шаг 4: Создаете файл .env в server 
PORT=
MONGO_URI=
TOKEN_SECRET=
MODE_CODE_SENDING_EMAIL_ADDRESS=
MODE_CODE_SENDING_EMAIL_PASSWORD=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_API_BASE_URL=

Шаг 5:Запустить сервер:
npm start
Используется nodemon для автоматической перезагрузки при изменении файлов.

Шаг 6:Запустить клиент:
npm run dev

Откроется локально по адресу http://localhost:3000.
